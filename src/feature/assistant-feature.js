const _ = require('lodash'),
    Debug = require('debug'),
    uuidV4 = require('uuid/v4');

class AssistantFeature {

    static debug() {
        if(!this._logger) {
            this._logger = Debug(`virtual-assistant:assistant-feature:${this.name}`);
        }
        this._logger.apply(this, arguments);
    }

    /**
    * Use this function to initialize the feature, for example to register events in StatisticsService.
    */
    static init() {
        this.debug('init');
    }

    static get scopes() {
        return {
            SHARED: 'SHARED', // si lancé sur un channel, channel + tous les im   &&   si lancé sur un im, im
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

    debug() {
        this.constructor.debug.apply(this.constructor, arguments);
    }

    initAssistantFeature(interfac, context) {
        this.interface = interfac;
        this.id = uuidV4();
        this.context = context;

        this.resetTtl();
    }

    canTriggerEvent(name) {
        return this.transitions && (this.transitions().indexOf(name) !== -1 || name === 'end') && this.can(name);
    }

    onenterstate(event, from, to) {
        // generic function for every states
        this.debug('enter state event=' + event + ', from=' + from + ', to=' + to);
    }

    onbeforeevent(event, from, to) {
        // generic function for every events
        this.debug('event event=' + event + ', from=' + from + ', to=' + to);
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
        /*this.interface.sendAttachments(channelId || this.context.channelId, [
            {
                title: "titre",
                image_url: "http://media.androidappsgame.com/4/13897/the-test-fun-for-friends-13897.jpg"
            }
        ]);*/
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
        debug(this.transitions());
        this.send("Je n'ai pas compris votre réponse");
        if(this.transitions().indexOf('yes') != -1 
            && this.transitions().indexOf('no') != -1) {
            this.send('Vous devez répondre par oui ou par non');
        }
        return false;*/
    }

    
}

module.exports = AssistantFeature;
