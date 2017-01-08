const _ = require('lodash'),
    SlackService = require('./interface/slack-service'),
    AssistantFeature = require('./feature/assistant-feature'),
    Configuration = require('./feature/configuration/configuration');

class VirtualAssistant {

	/**
		options = {
	        slack: { 
	        	token: process.env.SLACK_TOKEN,
	        	administrators: [] // if needed, give here the user ids that are administrator of the bot.
							        // The default administrators are the slack administrator, but this array can allow to add administrator for the bot but not for the entire slack
							        // The slack administrator will remain administrators of the but even if you don't give them in the array.
	        }
	    };
	*/
	constructor(featureList, options) {
		this.featureList = _.concat(featureList, Configuration);
		this.slackService = null;
		
		if(options.slack) {
			this.slackService = new SlackService(options.slack);
		}
	}

	run() {
		if(this.slackService) {
			this.slackService.on('channel', (message, context) => {
			    let regexpBot = new RegExp('<@' + this.slackService.getAuthenticatedUserId() + '>');
			    if(regexpBot.test(message)) {
			        // Someone talk to the bot
			        let messageToHandle = message.replace(regexpBot, '');
			        this._onMessage(this.slackService, _.merge(context, {interfaceType: 'channel'}), messageToHandle);
			    }

			});

			this.slackService.on('message', (message, context) => {
			    this._onMessage(this.slackService, _.merge(context, {interfaceType: 'im'}), message);
			});
		}
	}


	_getFeatureHandling(text) {
	    return _.filter(this.featureList, function(e) {
	        return e.canHandle(text);
	    });
	}

	_getCacheId(scope, channelId) {
		return scope === AssistantFeature.scopes.GLOBAL ? AssistantFeature.scopes.GLOBAL : [scope, channelId].join('-');
	}

	_getCurrentFeatureCacheId(currentChannelId) {
	    // OLD : D'abord on regarde si une feature est active sur le channel
	    // OLD : Si on est sur un IM alors dans tous les cas on ne trouvera rien là
	    // OLD : Ensuite si non, on regarde si une feature est active sur le IM (interfaceType)

	    let cacheKey = this._getCacheId(AssistantFeature.scopes.GLOBAL, currentChannelId);
	    if(AssistantFeature.getCache().keys().indexOf(cacheKey) !== -1) {
    		// Global feature currently running, take it
    		// TODO: possibility to get out of the global feature currently running, for specific user.
    		// For example : Regexp challenge is running but one specific user want to play tic tac toe in IM
    		return cacheKey;
    	}
    	else {
    		// Sinon on regarde si une des feature est active en local sur le channel actuel
    		let foundFeature = false;
    		_.forEach(this.featureList, (o) => {
    			if(!foundFeature) {
	    			let currentCacheId = this._getCacheId(o.getScope(), currentChannelId);
		    		if(AssistantFeature.getCache().keys().indexOf(currentCacheId) !== -1) {
		    			foundFeature = true;
		    			cacheKey = currentCacheId;
		    		}
		    	}
    		});
    		return foundFeature ? cacheKey : null;
    	}
	}

	_onMessage(fromInterface, context, message) {
	    let featureCacheId = this._getCurrentFeatureCacheId(context.channelId);

	    if(AssistantFeature.getCache().get(featureCacheId)) {
	        let feature = AssistantFeature.getCache().get(featureCacheId);
	        feature.handle(message, context);
	        feature.postHandle(message, context);
	    }
	    else {
	        let foundItems = this._getFeatureHandling(message);
	        console.log('foundItems', foundItems);
	        if(foundItems && foundItems.length > 0) {
	            if(foundItems.length === 1) {
	                let foundFeature = foundItems[0],
	                	featureId = this._getCacheId(foundFeature.getScope(), context.channelId);
	                let newFeature = new foundFeature(fromInterface, context, featureId);
	                newFeature.handle(message);
	            }
	            else {
	                console.error('Multiple features matching text ', message);
	            }
	        }
	        else {
	        	let toSend = [];
	        	if(!/(?:aide|help)/.test(message)) {
	        		// Si il ne demande pas d'aide, alors on a pas compris
	        		toSend.push('Je ne suis pas sûr de comprendre.');
	        	}
	        	toSend.push('Je peux vous aider à faire ces actions :');
	        	this.featureList.forEach(function(feature) {
	        		if(feature.getDescription()) {
		        		let desc = '•' + feature.getDescription(),
		        			keys = _.slice(feature.getTriggerKeywords(), 0, 2);
		        		desc += ' (pour ça dites moi "' + keys.join('", ou "') + '")';
		        		toSend.push(desc);
		        	}
	        	});
	        	fromInterface.send(context.channelId, toSend.join('\n'));
	        }
	    }
	}

}

module.exports = VirtualAssistant;