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

	_getCurrentFeatureCacheId(interfac, context) {
    	let cacheKey = null;
		_.forEach(this.featureList, (o) => {
			if(!cacheKey) {
    			let currentCacheId = o.getCacheId(interfac, context.channelId, context.userId);
	    		if(currentCacheId && AssistantFeature.getCache().keys().indexOf(currentCacheId) !== -1) {
	    			cacheKey = currentCacheId;
	    		}
	    	}
		});
		return cacheKey || null;
	}

	_onMessage(fromInterface, context, message) {
	    let featureCacheId = this._getCurrentFeatureCacheId(fromInterface, context);

	    if(featureCacheId && AssistantFeature.getCache().get(featureCacheId)) {
	        let feature = AssistantFeature.getCache().get(featureCacheId);
	        let result = feature.preHandle(message, context);
	        if(result) {
	        	feature.handle(message, context);
	        }
	    }
	    else {
	        let foundItems = this._getFeatureHandling(message);
	        console.log('foundItems', foundItems);
	        if(foundItems && foundItems.length > 0) {
	            if(foundItems.length === 1) {
	                let foundFeature = foundItems[0];
	                let newFeature = new foundFeature(fromInterface, context);
	                let result = newFeature.preHandle(message, context);
	                if(result) {
	                	newFeature.handle(message, context);
	                }
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