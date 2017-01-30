const ConfigurationService = require('../configuration-service'),
    debug = require('debug')('virtual-assistant:database-mongodb'),
    MongoDBAdapter = require('js-data-mongodb'),
    Container = require('js-data').Container;


class MongodbDao {

    static getContainer(name) {
        if(!this.dbUrl) {
            this.dbUrl = ConfigurationService.get('database.mongodb.url');
            if(!this.dbUrl) {
                debug(`Error: missing mongodb configuration URL.
                    Please set the configuration \`database.mongodb.url\` with the database url (eg: \`mongodb://localhost:27017/myproject\`)
                    Also be careful to encodeURIComponent the password if it contains special chars`);
            }
            else {
                this.dbUrl = this.dbUrl.replace(/^<(.*)>$/, '$1'); // strip wrong chars if the url has a link form
            }
        }

        let adapter;
        if(this.adapter) {
            adapter = this.adapter;
        }
        else {
            adapter = new MongoDBAdapter({
              uri: this.dbUrl
            });
            if(this.dbUrl) {
                // Only keep adapter if the url is set, to avoid reloading on first configuration
                this.adapter = adapter;
            }
        }

        let store = new Container();
        store.registerAdapter('mongodb', adapter, { 'default': true });
        return store;
    }

}

module.exports = MongodbDao;
