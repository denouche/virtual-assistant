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

	_getCacheId(scope, channelId, userId) {
		// channel, group ou im
		let datastore = SlackService.getDataStore();
		if(datastore.getChannelById(channelId)
			|| datastore.getGroupById(channelId)) {
			// On est dans un channel/group
			switch(scope) {
				case AssistantFeature.scopes.GLOBAL:
					// Global + tous les ims
					return AssistantFeature.scopes.GLOBAL;
				case AssistantFeature.scopes.LOCAL:
					// Local au channel/group en cours, on concatene le channelId pour la clé du cache
					return [scope, channelId].join('-');
			}
		}
		else if(datastore.getDMById(channelId)) {
			// on est dans un IM
			switch(scope) {
				case AssistantFeature.scopes.GLOBAL:
					// Global + tous les ims
					
					// Avant de retourner ici, on vérifie le channel courant de la feature
					let feat = AssistantFeature.getCache().get(AssistantFeature.scopes.GLOBAL);
					if(feat) {
						let channelFeat = feat.context.channelId;
						let channelOrGroup = datastore.getChannelById(channelFeat) || datastore.getGroupById(channelFeat);
						if(channelOrGroup && channelOrGroup.members.indexOf(userId) !== -1) {
							return AssistantFeature.scopes.GLOBAL;
						}
						// Si le user n'est pas dans ce channel/group, une éventuelle feature courante ne le concerne pas, même globale
						return null;
					}
					// Ici ça veut dire qu'on a pas de feature global en cours, on va donc la créer, mais en local seulement
					return [scope, channelId].join('-');
				case AssistantFeature.scopes.LOCAL:
					// Local au channel/group en cours, on concatene le channelId pour la clé du cache
					return [scope, channelId].join('-');
			}

			return [scope, channelId].join('-');
		}
		// On ne devrait pas passer ici
		console.warn('_getCacheId', channelId, userId, 'Not in channel, groups, or ims');
		return null;
	}

	_getCurrentFeatureCacheId(context) {
    	let cacheKey = null;
		_.forEach(this.featureList, (o) => {
			if(!cacheKey) {
    			let currentCacheId = this._getCacheId(o.getScope(), context.channelId, context.userId);
	    		if(currentCacheId && AssistantFeature.getCache().keys().indexOf(currentCacheId) !== -1) {
	    			cacheKey = currentCacheId;
	    		}
	    	}
		});
		return cacheKey || null;
	}

	_onMessage(fromInterface, context, message) {
	    let featureCacheId = this._getCurrentFeatureCacheId(context);

	    if(featureCacheId && AssistantFeature.getCache().get(featureCacheId)) {
	        let feature = AssistantFeature.getCache().get(featureCacheId);
	        feature.preHandle(message, context);
	        feature.handle(message, context);
	    }
	    else {
	        let foundItems = this._getFeatureHandling(message);
	        console.log('foundItems', foundItems);
	        if(foundItems && foundItems.length > 0) {
	            if(foundItems.length === 1) {
	                let foundFeature = foundItems[0],
	                	featureId = this._getCacheId(foundFeature.getScope(), context.channelId, context.userId);
	                let newFeature = new foundFeature(fromInterface, context, featureId);
	                newFeature.preHandle(message, context);
	                newFeature.handle(message, context);
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