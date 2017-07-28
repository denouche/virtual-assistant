const debug = require('debug')('virtual-assistant:feature:statistics'),
    AssistantFeature = require('../assistant-feature'),
    StateMachine = require('javascript-state-machine'),
    Features = require('../../helpers/features-service'),
    Database = require('../../helpers/database-service'),
    chrono = require('chrono-node'),
    _ = require('lodash'),
    moment = require('moment');

class Statistics extends AssistantFeature {

    static getTriggerKeywords() {
        return [
            'stats', 'statistic', 'statistique'
        ];
    }

    static getDescription() {
        return "Vous permettre de consulter mes statistiques d'utilisation";
    }

    static getTTL() {
        return 1 /* min */ * 60;
    }


    constructor(interfac, context) {
        super(interfac, context);
        StateMachine.create({
            target: Statistics.prototype,
            error: function(eventName, from, to, args, errorCode, errorMessage) {
                debug('Uncatched error',  'event ' + eventName + ' was naughty :- ' + errorMessage)
                debug(args)
            },
            initial: { state: 'Help', event: 'startup', defer: true }, // defer is important since the startup event is launched after the feature is stored in cache
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

    _getFeaturesPatterns() {
        let features = Features.getInstance().list.map((feature) => {
            let resultStrings = feature.getTriggerKeywords().map((keyword) => {
                let s;
                if(keyword instanceof RegExp) {
                    s = keyword.source;
                }
                else if(keyword instanceof String || typeof(keyword) === 'string') {
                    s = '\\b' + keyword + '\\b';
                }
                return s;
            });
            
            let ro = {}
            ro[feature.name] = `(${resultStrings.join('|')})`;
            return ro;
        });
        let resultObject = _.assign({}, ...features);
        return resultObject;
        
    }


    /*********** STATES ***************/

    onHelp(event, from, to) {
        var toSend = [
            'Consultation des statistiques, dites "fin" pour quitter.',
            'Quelles statistiques voulez-vous consulter ?'
        ];
        this.send(toSend);
        this.wait();
    }

    onWait(event, from, to) {
        // Do nothing
    }

    onText(event, from, to, text) {
        try {
        this.send('Calcul des statistiques en cours ...');

        let featuresToSearch = [],
            allFeatures = [];
        _.map(this._getFeaturesPatterns(), (pattern, featureName) => {
            allFeatures.push(featureName);
            if(featureName === 'Statistics') {
                // Ignore the stats feature, because almost the sentences will contains the stats keyword
                return;
            }

            let m = text.match(new RegExp(pattern, 'g'));
            if(m) {
                featuresToSearch.push(featureName);
            }
        });
        if(featuresToSearch.length === 0) {
            featuresToSearch = allFeatures;
        }

        let toSend = [];

        var chronoResults = chrono.parse(text),
            filterDateStart, filterDateEnd;
        console.log(chronoResults);
        if(chronoResults.length > 0) {
            toSend.push('Voici les statistiques pour les dates suivantes :');
            let dateSentence = '';
            if(chronoResults[0].start) {
                filterDateStart = moment(chronoResults[0].start.date()).locale('fr');
                dateSentence += 'du ' + filterDateStart.format('LLLL');
            }
            if(chronoResults[0].end) {
                filterDateEnd = moment(chronoResults[0].end.date()).locale('fr');
                dateSentence += ' au ' + filterDateEnd.format('LLLL');
            } else {
                dateSentence += " à aujourd'hui";
            }
            toSend.push(dateSentence);
        } else {
            toSend.push("Voici l'ensemble des statistiques :");
        }

        let futureStats = [];
        featuresToSearch.forEach((name) => {
            let st = Database.collection('statistics').findAll({eventName: 'feature_launch', 'event.feature': name })
                .then((data) => {
                    data = _.filter(data, (e) => {
                        let d = moment(e.date);
                        if(filterDateStart && filterDateEnd) {
                            return d.isBetween(filterDateStart, filterDateEnd);
                        } else if(filterDateStart) {
                            return d.isAfter(filterDateStart);
                        } else if(filterDateEnd) {
                            return d.isBefore(filterDateEnd);
                        } else {
                            return true;
                        }
                    });
                    return {name: name, data: data};
                    //let byUser = _.countBy(data, 'event.userId');
                    //this.send(`  • ${name}: solicité ${data.length} fois par ${_.keys(byUser).length} utilisateurs différents`);
                });
            futureStats.push(st);
        });
        Promise.all(futureStats)
            .then((dataArray) => {
                dataArray = _(dataArray)
                    .sortBy([(o) => {
                        return o.data.length;
                    }])
                    .reverse()
                    .value();
                dataArray.forEach((data) => {
                    let byUser = _.countBy(data.data, 'event.userId');
                    toSend.push(`  • ${data.name}: solicité ${data.data.length} fois par ${_.keys(byUser).length} utilisateurs différents`);
                });
                this.send(toSend);
            })
} catch(e) {
    console.log('ouuuuuuuuuups', e)
}
        /*var results = chrono.parse(text);
        console.log(results);

        if(results.length > 0) {
            if(results[0].start) {
                console.log(results[0].start.date());
            }
            if(results[0].end) {
                console.log(results[0].end.date());
            }
        }

        Features.getInstance().list


        //Database.collection('statistics').findAll({eventName: 'feature_launch', 'event.feature': text })
        Database.collection('statistics').findAll({
            where: {
                eventName: {
                    '==': 'feature_launch'
                },
                'event.feature': {
                    '==': text
                },
                'date': {
                    '>=': moment('2017-04-21T22:01:12.000Z').toDate()
                }
            }
        })
        //, 'date': {'>': new Date('2017-04-01T00:00:00.000Z')}})
            .then((data) => {
                this.send(data.length + ' events')
                /*let start = moment('2017-04-01T00:00:00.000Z'),
                    end = moment('2017-04-30T23:59:00.000Z')
                console.log(data[0].date, typeof data[0].date)
                data = _.filter(data, function(e) {
                    console.log('laaaaa', e.date, e.date.getDate())
                    let d = moment(e.date);
                    return d.isBetween(start, end);
                })*/
                /*let byUser = _.countBy(data, 'event.userId');
                console.log('ICIII', byUser)
                this.send(_.keys(byUser).length + ' unique users');
                this.send('```'+JSON.stringify(data)+'```');
            })*/
        this.wait();
    }

    onEnd(event, from, to) {
        this.send('Fin de la consultation des statistiques');
        this.clearCache();
    }

}



module.exports = Statistics;
