const _ = require('lodash'),
    debug = require('debug')('virtual-assistant:features-service');

class FeaturesService {

    constructor() {
        this._list = [];
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new FeaturesService();
        }
        return this.instance;
    }

    get list() {
        return this._list;
    }

    set list(list) {
        this._list = list;
    }

    add() {
        debug('add %o', arguments)
        _.forEach(arguments, (e) => {
            var toAdd = e;
            if(!_.isArray(e)) {
                toAdd = [e];
            }
            _.forEach(toAdd, function(feat) {
                feat.init();
            });
            this._list = _.concat(this._list, toAdd);
        });
    }

}

module.exports = FeaturesService;