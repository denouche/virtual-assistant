const _ = require('lodash'),
    SlackService = require('../interface/slack-service');


class AssistantFeature {

	static getId(interfaceType, channelOrImId) {
        // string, The ID of this type of FSM.
        // You can concat the cannelOrImId to be able to run multiple FSM on differents channels or IMs.
		throw new TypeError("Not implemented, please implement this function in sub class");
	}

	static getTriggerKeywords() {
        // Array of string that will trigger the FSM to start
		throw new TypeError("Not implemented, please implement this function in sub class");
	}

	static getTTL() {
		// In seconds
		throw new TypeError("Not implemented, please implement this function in sub class");
	}
    
    static canHandle(message) {
        return _.some(this.getTriggerKeywords(), function(keyword) {
            return new RegExp(keyword, 'i').test(message);
        });
    }

    static getCache() {
        if(!this.cache) {
            this.cache = require('memory-cache');
        }
        return this.cache;
    }



    constructor(interfac, context, id) {
	    // context is : 
	    // { 
	    //  userId: xxx, // the user who launched the fsm
        //  channelId: xxx, // the channel where the fsm was launched
	    //  model: {
	    //    currentPlayer: -1|1
	    //    game: [[],[],[]]
	    //  }
	    // }
        this.interface = interfac;
        this.id = id;
        this.context = context;

        this.resetTtl();
    }

    canTriggerEvent(name) {
        return (this.transitions().indexOf(name) !== -1 || name === 'end') && this.can(name);
    }

    onenterstate(event, from, to) {
        // generic function for every states
        console.log('enter state event=' + event + ', from=' + from + ', to=' + to);
    }

    onbeforeevent(event, from, to) {
        // generic function for every events
        console.log('event event=' + event + ', from=' + from + ', to=' + to);
    }


    send(message, channelId) {
        var toSend = '';
        if(_.isArray(message)) {
            _.forEach(message, function(m, index) {
                toSend += m;
                if(index < (message.length - 1)) {
                    toSend += '\n';
                }
            });
        }
        else {
            toSend = message;
        }
        this.interface.send(channelId || this.context.channelId, toSend);
    }

    endAndClearCache() {
        this.constructor.getCache().del(this.id);
    }

    resetTtl() {
        this.constructor.getCache().del(this.id);
        this.constructor.getCache().put(this.id, this, this.constructor.getTTL() * 1000, () => {
            // In case of timeout this function is called
            if(this.canTriggerEvent('end')) {
                this.end();
            }
        });
    }

    handle(message, context) {
        this.resetTtl();

/*
        // TODO lister les transitions possibles
        console.log(this.transitions());
        this.send("Je n'ai pas compris votre réponse");
        if(this.transitions().indexOf('yes') != -1 
            && this.transitions().indexOf('no') != -1) {
            this.send('Vous devez répondre par oui ou par non');
        }
        return false;*/
    }

	
}

module.exports = AssistantFeature;