const _ = require('lodash'),
    SlackService = require('./interface/slack-service'),
    AssistantFeature = require('./feature/assistant-feature');

class VirtualAssistant {

	constructor(featureList, interfaceList) {
		this.featureList = featureList;
		this.slackService = null;
		
		if(interfaceList.slack) {
			this.slackService = new SlackService(interfaceList.slack.token);
		}
	}

	run() {
		if(this.slackService) {
			this.slackService.on('channel', (message, context) => {
			    console.log('channel', message, "from", context.userId)
			    let regexpUser = /^<@([^>]+)>:?\s*(.*)$/,
			        matcher = message.match(regexpUser);
			    if(matcher && matcher[1] === this.slackService.getAuthenticatedUserId() && matcher[2]) {
			        // Someone talk to the bot
			        this.onMessage(this.slackService, _.merge(context, {interfaceType: 'channel'}), matcher[2]);
			    }

			});

			this.slackService.on('message', (message, context) => {
			    console.log('im', message, "from", context.userId)
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
	    console.log('onMessage', context, message);
	    
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
	                newFsm.startup();
	            }
	            else {
	                console.error('Multiple features matching text ', message);
	            }
	        }
	        else {
	            // Someone is talking to the bot but no FSM to handle that.
	            // List help
	            // TODO
	            // Un genre de catch all qui irait lister les FSM, leur description (static getDescription), et lister :
	            // je peux : - aider à remplir ton CRA, pour ça dit "CRA", ou "compte rendu",
	            // Jouer au morpion, pour ça dit moi "morpion", ou "tic tac toe"
	            // Tirer les keywords de static getTriggerKeyworks()
	        }
	    }
	}

}

module.exports = VirtualAssistant;