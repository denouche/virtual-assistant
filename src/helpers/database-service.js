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
                debug(`Warn: no database configuration found.
If you want to set it, set the configuration 'database.module' with the database module you want to use. For example to use mongodb, set it to './database/mongodb'.`);
                this.dbModuleName = './database/mock';
            }
        }

        let dbContainer;
        try {
            let dbModule = require(this.dbModuleName);
            dbContainer = dbModule.getContainer(name)
        } catch(e) {
            debug(`Error: database module ${this.dbModuleName} not found`, e);
            // Let's retry with mock
            this.dbModuleName = './database/mock';
            let dbModule = require(this.dbModuleName);
            dbContainer = dbModule.getContainer(name)
        }

        if(dbContainer) {
            let mapper = dbContainer.getMapperByName(name);
            if(!mapper) {
                mapper = dbContainer.defineMapper(name, {
                  table: name
                });
            }
            return mapper;
        }
        
        // Should never happens because by default the mock module is loaded
        return null;
    }

}

module.exports = DatabaseService;
