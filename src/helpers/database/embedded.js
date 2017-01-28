const AbstractDAO = require('./abstract-dao'),
	Datastore = require('nedb'),
	ConfigurationService = require('../configuration-service'),
	path = require('path');

class EmbeddedDAO extends AbstractDAO {

    static _getCollection(name) {
        if(!this.dbBasepath) {
            this.dbBasepath = ConfigurationService.get('database.embedded.basepath');
            if(!this.dbBasepath) {
            	this.dbBasepath = 'database';
	            console.warn(`Warn: missing base path folder for embedded database files. The default value './database/' will be used.
If you want to change it, set the configuration 'database.embedded.basepath' with the base path folder where to store the database files.`);
            }
        }
    	if(!this.db) {
    		this.db = {};
    	}
    	if(!this.db[name]) {
    		this.db[name] = new Datastore({ filename: path.join(this.dbBasepath, (name || 'database') + '.db') });
    	}
        return new Promise((resolve, reject) => {
        	this.db[name].loadDatabase((err) => {
        		resolve(this.db[name])
			});
        });
    }

    insertOne(doc) {
    	return this.constructor._getCollection(this.collection)
    		.then(function(db) {
    			return new Promise((resolve, reject) => {
	    			db.insert(doc, function (err, newDoc) {
	    				if(err) {
	    					reject(err);
	    				}
	    				else {
	    					resolve(newDoc);
	    				}
	    			});
	    		});
    		});
    }

    insertMany(docs) {
    	return this.insertOne(docs);
    }

    find(query) {
    	return this.constructor._getCollection(this.collection)
    		.then(function(db) {
    			return new Promise((resolve, reject) => {
	    			db.find(query, function (err, docs) {
	    				if(err) {
	    					reject(err);
	    				}
	    				else {
	    					resolve(docs);
	    				}
	    			});
	    		});
    		});
    }

    findOne(query) {
    	return this.constructor._getCollection(this.collection)
    		.then(function(db) {
    			return new Promise((resolve, reject) => {
	    			db.findOne(query, function (err, doc) {
	    				if(err) {
	    					reject(err);
	    				}
	    				else {
	    					resolve(doc);
	    				}
	    			});
	    		});
    		});
    }

    count(query) {
    	return this.constructor._getCollection(this.collection)
    		.then(function(db) {
    			return new Promise((resolve, reject) => {
	    			db.count(query, function (err, count) {
	    				if(err) {
	    					reject(err);
	    				}
	    				else {
	    					resolve(count);
	    				}
	    			});
	    		});
    		});
    }

    updateOne(query, update) {
    	return this.constructor._getCollection(this.collection)
    		.then(function(db) {
    			return new Promise((resolve, reject) => {
	    			db.update(query, update, { multi: false }, function (err, numAffected) {
	    				if(err) {
	    					reject(err);
	    				}
	    				else {
	    					resolve(numAffected);
	    				}
	    			});
	    		});
    		});
    }

    updateMany(query, update) {
    	return this.constructor._getCollection(this.collection)
    		.then(function(db) {
    			return new Promise((resolve, reject) => {
	    			db.update(query, update, { multi: true }, function (err, numAffected) {
	    				if(err) {
	    					reject(err);
	    				}
	    				else {
	    					resolve(numAffected);
	    				}
	    			});
	    		});
    		});
    }

    deleteOne(query) {
    	return this.constructor._getCollection(this.collection)
    		.then(function(db) {
    			return new Promise((resolve, reject) => {
	    			db.remove(query, { multi: false }, function (err, numRemoved) {
	    				if(err) {
	    					reject(err);
	    				}
	    				else {
	    					resolve(numRemoved);
	    				}
	    			});
	    		});
    		});
    }

    deleteMany(query) {
    	return this.constructor._getCollection(this.collection)
    		.then(function(db) {
    			return new Promise((resolve, reject) => {
	    			db.remove(query, { multi: true }, function (err, numRemoved) {
	    				if(err) {
	    					reject(err);
	    				}
	    				else {
	    					resolve(numRemoved);
	    				}
	    			});
	    		});
    		});
    }

}

module.exports = EmbeddedDAO;
