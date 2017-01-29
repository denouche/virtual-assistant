const _ = require('lodash'),
    debug = require('debug')('virtual-assistant:features-service');

class FeaturesService {

    constructor() {
        this._featuresList = [];
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new FeaturesService();
        }
        return this.instance;
    }

    get list() {
        return this._featuresList;
    }

    set list(list) {
        this._featuresList = list;
    }

    add() {
        debug('add %o', arguments)
        _.forEach(arguments, (e) => {
            var toAdd = e;
            if(!_.isArray(e)) {
                toAdd = [e];
            }
            this._featuresList = _.concat(this._featuresList, toAdd);
        });
    }

}

module.exports = FeaturesService;