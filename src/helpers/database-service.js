const ConfigurationService = require('./configuration-service'),
    debug = require('debug')('virtual-assistant:database-service');

class DatabaseService {

    static collection(name) {
        debug('collection', name);
        if(/\W/.test(name)) {
            debug('Error: only use word characters in collection name');
            return null;
        }
        if(!this.dbModuleName) {
            this.dbModuleName = ConfigurationService.get('database.module');
            if(!this.dbModuleName) {
                debug(`Warn: no database configuration found, an embedded database will be used (module './database/embedded').
If you want to change it, set the configuration 'database.module' with the database module you want to use. For example to use mongodb, set it to './database/mongodb'.`);
                this.dbModuleName = './database/embedded';
            }
        }
        if(!this.dbModule) {
            this.dbModule = {};
        }
        if(!this.dbModule[name]) {
            let dbModule;
            try {
                dbModule = require(this.dbModuleName);
            } catch(e) {
                debug(`Error: database module ${this.dbModuleName} not found, using default embedded database module instead.`)
                this.dbModuleName = './database/embedded';
                dbModule = require(this.dbModuleName);
            }
            this.dbModule[name] = new dbModule(name);
        }
        return this.dbModule[name];
    }

}

module.exports = DatabaseService;
