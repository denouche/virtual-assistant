const low = require('lowdb');

class StorageService {

    constructor(filename) {
        this.db = low(filename || 'db.json');
    }

    get() {
        return this.db;
    }

}

module.exports = StorageService;
