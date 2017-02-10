const Adapter = require('js-data-adapter').Adapter,
    Container = require('js-data').Container;


class MyAdapter extends Adapter {}

class MockDao {

    static getContainer(name) {
        const adapter = new MyAdapter({});
        const store = new Container();
        store.registerAdapter('mock', adapter, { 'default': true });
        return store;
    }

}

module.exports = MockDao;
