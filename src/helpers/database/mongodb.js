const AbstractDAO = require('./abstract-dao'),
    MongoClient = require('mongodb').MongoClient,
    ConfigurationService = require('../configuration-service');

class MongodbDAO extends AbstractDAO {

    static _getCollection(name) {
        if(!this.dbUrl) {
            this.dbUrl = ConfigurationService.get('database.mongodb.url');
            if(!this.dbUrl) {
                console.error('Error: missing mongodb configuration URL. Please set the configuration `database.mongodb.url` with the database url (eg: `mongodb://localhost:27017/myproject`)');
                return null;
            }
        }
    	if(!this.db) {
    		this.db = new Promise((resolve, reject) => {
	    		MongoClient.connect(this.dbUrl, function(err, db) {
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

    insertOne(doc) {
    	var args = arguments;
    	return this.constructor._getCollection(this.collection)
    		.then(function(collection) {
    			return collection.insertOne.apply(collection, args);
    		});
    }

    insertMany(docs) {
    	var args = arguments;
    	return this.constructor._getCollection(this.collection)
    		.then(function(collection) {
    			return collection.insertMany.apply(collection, args);
    		});
    }

    find(query) {
    	var args = arguments;
    	return this.constructor._getCollection(this.collection)
    		.then(function(collection) {
    			return collection.find.apply(collection, args);
    		})
    		.then(function(results) {
    			return new Promise((resolve, reject) => {
    				results.toArray(function(err, documents) {
    					if(err) {
    						reject(err);
    					}
    					else {
    						resolve(documents);
    					}
    				});
    			});
    		});
    }

    findOne(query) {
    	var args = arguments;
    	return this.constructor._getCollection(this.collection)
    		.then(function(collection) {
    			return collection.findOne.apply(collection, args);
    		});
    }

    count(query) {
    	var args = arguments;
    	return this.constructor._getCollection(this.collection)
    		.then(function(collection) {
    			return collection.count.apply(collection, args);
    		});
    }

    updateOne(query, update, options) {
    	var args = arguments;
    	return this.constructor._getCollection(this.collection)
    		.then(function(collection) {
    			return collection.updateOne.apply(collection, args);
    		});
    }

    updateMany(query, update, options) {
    	var args = arguments;
    	return this.constructor._getCollection(this.collection)
    		.then(function(collection) {
    			return collection.updateMany.apply(collection, args);
    		});
    }

    deleteOne(query, options) {
    	var args = arguments;
    	return this.constructor._getCollection(this.collection)
    		.then(function(collection) {
    			return collection.deleteOne.apply(collection, args);
    		});
    }

    deleteMany(query, options) {
    	var args = arguments;
    	return this.constructor._getCollection(this.collection)
    		.then(function(collection) {
    			return collection.deleteMany.apply(collection, args);
    		});
    }

}

module.exports = MongodbDAO;
