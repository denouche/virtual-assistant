const _ = require('lodash'),
    SlackService = require('./interface/slack-service'),
    AssistantFeature = require('./feature/assistant-feature'),
    Configuration = require('./feature/configuration/configuration');

class VirtualAssistant {

	constructor(featureList, interfaceList) {
		this.featureList = _.concat([Configuration], featureList);
		this.slackService = null;
		
		if(interfaceList.slack) {
			this.slackService = new SlackService(interfaceList.slack.token);
		}
	}

	run() {
		if(this.slackService) {
			this.slackService.on('channel', (message, context) => {
			    let regexpBot = new RegExp('<@' + this.slackService.getAuthenticatedUserId() + '>');
			    if(regexpBot.test(message)) {
			        // Someone talk to the bot
			        let messageToHandle = message.replace(regexpBot, '');
			        this.onMessage(this.slackService, _.merge(context, {interfaceType: 'channel'}), messageToHandle);
			    }

			});

			this.slackService.on('message', (message, context) => {
			    this.onMessage(this.slackService, _.merge(context, {interfaceType: 'im'}), message);
			});
		}
	}


	getFeatureHandling(text) {
	    return _.filter(this.featureList, function(e) {
	        return e.canHandle(text);
	    });
	}

	getCurrentFeatureCacheId(interfaceType, currentChannelId) {
	    // D'abord on regarde si une FSM est active sur le channel
	    // Si on est sur un IM alors dans tous les cas on ne trouvera rien là
	    // Ensuite si non, on regarde si une FSM est active sur le IM (interfaceType)

	    let fsmForChannel = _.find(this.featureList, function(o) {
	        return !!AssistantFeature.getCache().get(o.getId('channel', currentChannelId));
	    });
	    if(fsmForChannel) {
	        return fsmForChannel.getId('channel', currentChannelId);
	    }

	    let fsmForCurrentInterfaceType = _.find(this.featureList, function(o) {
	        return !!AssistantFeature.getCache().get(o.getId(interfaceType, currentChannelId));
	    });
	    if(fsmForCurrentInterfaceType) {
	        return fsmForCurrentInterfaceType.getId(interfaceType, currentChannelId);
	    }

	    return null;
	}

	onMessage(fromInterface, context, message) {
	    let fsmCacheId = this.getCurrentFeatureCacheId(context.interfaceType, context.channelId);

	    if(AssistantFeature.getCache().get(fsmCacheId)) {
	        let fsm = AssistantFeature.getCache().get(fsmCacheId);
	        fsm.handle(message, context);
	    }
	    else {
	        let foundItems = this.getFeatureHandling(message);
	        console.log('foundItems', foundItems);
	        if(foundItems && foundItems.length > 0) {
	            if(foundItems.length === 1) {
	                let foundFsm = foundItems[0],
	                    fsmId = foundFsm.getId(context.interfaceType, context.channelId);
	                let newFsm = new foundFsm(fromInterface, context, fsmId);
	                newFsm.handle(message);
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
	        		let desc = '•' + feature.getDescription(),
	        			keys = _.slice(feature.getTriggerKeywords(), 0, 2);
	        		desc += ' (pour ça dites moi "' + keys.join('", ou "') + '")';
	        		toSend.push(desc);
	        	});
	        	fromInterface.send(context.channelId, toSend.join('\n'));
	        }
	    }
	}

}

module.exports = VirtualAssistant;