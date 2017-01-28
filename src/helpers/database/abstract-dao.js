class AbstractDAO {

	constructor(collection) {
		this.collection = collection;
	}

    static _getCollection(name) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

    insertOne(doc) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

    insertMany(docs) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

    find(query) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

    findOne(query) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

    count(query) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

    updateOne(query, update, options) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

    updateMany(query, update, options) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

    deleteOne(query, options) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

    deleteMany(query, options) {
		throw new TypeError("Not implemented, please implement this function in sub class");
    }

}

module.exports = AbstractDAO;
