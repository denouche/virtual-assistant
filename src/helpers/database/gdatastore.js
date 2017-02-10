const ConfigurationService = require('../configuration-service'),
    debug = require('debug')('virtual-assistant:database-gdatastore'),
    CloudDatastoreAdapter = require('js-data-cloud-datastore').CloudDatastoreAdapter,
    Container = require('js-data').Container;

class GDatastoreDao {

    static getContainer(name) {
    
        if(!this.configProjectId) {
            this.configProjectId = ConfigurationService.get('database.gdatastore.projectId');
            if(!this.configProjectId) {
                debug(`Error: missing gdatastore configuration projectId.
                    Please set the configuration \`database.gdatastore.projectId\` with the Google Cloud projectId`);
            }
        }

        if(!process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
            debug(`Error: missing Google Datastore credentials.
                    Please set the environment variable \`GOOGLE_APPLICATION_CREDENTIALS\` with the path to the Google Cloud service account JSON authentication file`);
        }

        let adapter;
        if(this.adapter) {
            adapter = this.adapter;
        }
        else {
            adapter = new CloudDatastoreAdapter({
                datastoreOpts: {
                    projectId: this.configProjectId
                }
            });
            if(this.configProjectId && process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
                // Only keep adapter if the url is set, to avoid reloading on first configuration
                this.adapter = adapter;
            }
        }

        let store = new Container();
        store.registerAdapter('datastore', adapter, { 'default': true });
        return store;
    }

}

module.exports = GDatastoreDao;

