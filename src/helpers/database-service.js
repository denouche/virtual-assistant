const ConfigurationService = require('./configuration-service');

class DatabaseService {

    static _get(name) {
    	if(!this.db) {
    		this.db = new Promise((resolve, reject) => {
	    		MongoClient.connect(url, function(err, db) {
	    			if(err) {
	    				reject(err)
	    			}
	    			else {
		    			resolve(db);
		    		}
	    		});
    		});
    	}
		return this.db.then(function(db) {
			return db.collection(name);
		});
    }

    static collection(name) {
    	if(/\W/.test(name)) {
    		console.error('Error: only use word characters in collection name');
    		return null;
    	}
        if(!this.dbModule) {
            let dbModuleName = ConfigurationService.get('database.module');
            if(!dbModuleName) {
                console.warn(`Warn: no database configuration found, an embedded database will be used (module './database/embedded').
If you want to change it, set the configuration 'database.module' with the database module you want to use. For example to use mongodb, set it to './database/mongodb'.`);
                dbModuleName = './database/embedded';
            }
            let dbModule = require(dbModuleName);
            this.dbModule = new dbModule(name);
        }
    	return this.dbModule;
    }

    insertOne(doc) {
        return this.dbModule.insertOne.apply(this.dbModule, arguments);
    }

    insertMany(docs) {
        return this.dbModule.insertMany.apply(this.dbModule, arguments);
    }

    find(query) {
        return this.dbModule.find.apply(this.dbModule, arguments);
    }

    findOne(query) {
        return this.dbModule.findOne.apply(this.dbModule, arguments);
    }

    count(query) {
        return this.dbModule.count.apply(this.dbModule, arguments);
    }

    updateOne(query, update, options) {
        return this.dbModule.updateOne.apply(this.dbModule, arguments);
    }

    updateMany(query, update, options) {
        return this.dbModule.updateMany.apply(this.dbModule, arguments);
    }

    deleteOne(query, options) {
        return this.dbModule.deleteOne.apply(this.dbModule, arguments);
    }

    deleteMany(query, options) {
        return this.dbModule.deleteMany.apply(this.dbModule, arguments);
    }

}

module.exports = DatabaseService;
