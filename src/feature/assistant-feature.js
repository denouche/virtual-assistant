const _ = require('lodash');


class AssistantFeature {

    static get scopes() {
        return {
            GLOBAL: 'GLOBAL', // si lancé sur un channel, channel + tous les im   &&   si lancé sur un im, im
            LOCAL: 'LOCAL', // si lancé sur un channel, channel   &&   si lancé sur un im, im
            // TODO 
            // PRIVATE_ONLY // seulement en IM
            // PUBLIC_ONLY // seulement en public
            // entre deux personnes ?
        };
    }

    /**
    *   Override if needed
    */
    static getScope() {
        // Optionnal, default value is AssistantFeature.scopes.LOCAL
        // return here the scope of this feature.
        // Availables scopes are available in AssistantFeature.scopes
        // Default value is AssistantFeature.scopes.LOCAL
        return AssistantFeature.scopes.LOCAL;
    }

    /**
    *   Override to add your own trigger keywords
    */
	static getTriggerKeywords() {
        // Array of string that will trigger the feature to start
		throw new TypeError("Not implemented, please implement this function in sub class");
	}

    /**
    *   Override to add the description of the feature this class provide
    */
    static getDescription() {
        // return here the description of your feature.
        // This description will be used for the help text of the bot
        throw new TypeError("Not implemented, please implement this function in sub class");
    }

    /**
    *   Override if needed
    */
	static getTTL() {
        // Optionnal, default value is 0
        // In seconds
        // Setting this to > 0 will keep the feature state for the given duration
        // Set to 0 to disable the persistence of this feature
        return 0;
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

    static getCacheId(interfac, channelId, userId) {
        // channel, group ou im
        let datastore = interfac.getDataStore();
        if(datastore.getChannelById(channelId)
            || datastore.getGroupById(channelId)) {
            // On est dans un channel/group
            switch(this.getScope()) {
                case AssistantFeature.scopes.GLOBAL:
                    // Global + tous les ims
                    return AssistantFeature.scopes.GLOBAL;
                case AssistantFeature.scopes.LOCAL:
                    // Local au channel/group en cours, on concatene le channelId pour la clé du cache
                    return [this.getScope(), channelId].join('-');
            }
        }
        else if(datastore.getDMById(channelId)) {
            // on est dans un IM
            switch(this.getScope()) {
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
                    return [this.getScope(), channelId].join('-');
                case AssistantFeature.scopes.LOCAL:
                    // Local au channel/group en cours, on concatene le channelId pour la clé du cache
                    return [this.getScope(), channelId].join('-');
            }

            return [this.getScope(), channelId].join('-');
        }
        // On ne devrait pas passer ici
        console.warn('_getCacheId', channelId, userId, 'Not in channel, groups, or ims');
        return null;
    }



    constructor(interfac, context) {
	    // context is : 
	    // { 
	    //  userId: xxx, // the user who launched the feature
        //  channelId: xxx, // the channel where the feature was launched
        //  interfaceType: im|channel // The interface type where the feature was initialy launched
	    //  model: {
        //      // put your feature model here, this will be persisted
	    //  }
	    // }
        this.initAssistantFeature(interfac, context);
    }

    initAssistantFeature(interfac, context) {
        this.interface = interfac;
        this.id = this.constructor.getCacheId(interfac, context.channelId, context.userId);
        this.context = context;

        this.resetTtl();
    }

    canTriggerEvent(name) {
        return this.transitions && (this.transitions().indexOf(name) !== -1 || name === 'end') && this.can(name);
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
            toSend = message.join('\n');
        }
        else {
            toSend = message;
        }
        this.interface.send(channelId || this.context.channelId, toSend);
    }

    clearCache() {
        this.constructor.getCache().del(this.id);
    }

    resetTtl() {
        if(this.constructor.getTTL()
            && this.constructor.getTTL() > 0) {
            this.constructor.getCache().del(this.id);
            this.constructor.getCache().put(this.id, this, this.constructor.getTTL() * 1000, () => {
                // In case of timeout this function is called
                if(this.canTriggerEvent('end')) {
                    this.end();
                }
            });
        }
    }

    preHandle(message, context) {
        this.resetTtl();
        return true;
    }

    handle(message, context) {
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
