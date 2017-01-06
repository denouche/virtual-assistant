const AssistantFeature = require('../assistant-feature'),
    StateMachine = require('javascript-state-machine'),
    ConfigurationService = require('../../helpers/configuration-service.js'),
    SlackService = require('../../interface/slack-service');

class Configuration extends AssistantFeature {

    static getId(interfaceType, channelOrImId) {
        return 'Configuration-' + interfaceType + '-' + channelOrImId;
    }

    static getTriggerKeywords() {
        return [
            'configuration', 'config'
        ];
    }

    static getDescription() {
        return 'Vous permettre de configurer mes paramètres';
    }

    static getTTL() {
        return 1 /* min */ * 60;
    }



    constructor(interfac, context, id) {
        super(interfac, context, id);
        StateMachine.create({
            target: Configuration.prototype,
            error: function(eventName, from, to, args, errorCode, errorMessage) {
                console.error('Uncatched error',  'event ' + eventName + ' was naughty :- ' + errorMessage)
                console.error(args)
            },
            initial: { state: 'Help', event: 'startup', defer: true }, // defer is important since the startup event is launched after the fsm is stored in cache
            terminal: 'End',
            events: [
                { name: 'startup', from: 'none', to: 'Help' },

                { name: 'help', from: '*', to: 'Help' },
                { name: 'wait', from: '*', to: 'Wait' },

                { name: 'text', from: 'Wait', to: 'Text' },

                { name: 'end', from: '*', to: 'End' },
            ]
        });

    }

    handle(message, context) {
        super.handle(message, context);
        if(this.current === 'none') {
            this.startup();
        }
        else {
            if(message.match(/^(?:fin|end|exit|stop|quit|quitter|bye)$/i) && this.canTriggerEvent('end')) {
                this.end(context.userId);
            }
            else if(this.canTriggerEvent('text')) {
                this.text(message, context.userId);
            }
        }
    }


    /*********** STATES ***************/

    onHelp(event, from, to) {
        if(this.context.interfaceType === 'im') {
            var fromUser = SlackService.getDataStore().getUserById(this.context.userId);
            if(fromUser.is_admin || 'U2Q4ALC6B' === this.context.userId /* xee */ || 'U0DHA6T5L' === this.context.userId /* sfeirgroup*/) {
                var toSend = [
                    'Mode configuration activé, dites "fin" pour le quitter.',
                    'Voici la configuration actuelle :```',
                    JSON.stringify(ConfigurationService.get(), null, 2),
                    '``` ',
                    'Vous pouvez faire les actions suivantes :',
                    '```get <?key>',
                    'set <key> <value>',
                    'delete <key>```'
                ];
                this.send(toSend);
                this.wait();
            }
            else {
                this.send('Désolé, seul un administrateur peut accéder à la configuration.');
                this.end();
            }
        }
        else {
            this.send("Ma configuration doit s'effectuer via messages privés.");
            this.end();
        }
    }

    onWait(event, from, to) {
        // Do nothing
    }

    onText(event, from, to, text) {
        var getRegexp = /^get(?:\s+(.*))?$/,
            setRegexp = /^set\s+([^\s]+)\s([^\s]+)$/,
            deleteRegexp = /^delete\s+([^\s]+)$/,
            matcher;
        try {
        if(getRegexp.test(text)) {
            matcher = text.match(getRegexp);
            var config = ConfigurationService.get(matcher[1]);
            if(config) {
                this.send('```' + JSON.stringify(config, null, 2) + '```');
            }
            else {
                this.send('Configuration non trouvée');
            }
        }
        else if(setRegexp.test(text)) {
            matcher = text.match(setRegexp);
            ConfigurationService.set(matcher[1], matcher[2]);
            this.send('Done');
        }
        else if(deleteRegexp.test(text)) {
            matcher = text.match(deleteRegexp);
            ConfigurationService.remove(matcher[1]);
            this.send('Done');
        }
        else {
            this.send("Je n'ai pas compris votre demande.");
        }
        }
        catch(e) {
            console.error('Error on configuration Text state', e);
        }
        this.wait();
    }

    onEnd(event, from, to) {
        this.send('Fin du mode configuration');
        this.clearCache();
    }

}



module.exports = Configuration;
