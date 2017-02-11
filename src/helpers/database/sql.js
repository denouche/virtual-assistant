const ConfigurationService = require('../configuration-service'),
    debug = require('debug')('virtual-assistant:database-sql'),
    SqlAdapter = require('js-data-sql').SqlAdapter,
    Container = require('js-data').Container;


class SqlDao {

    static getContainer(name) {
        if(!this.dbClient) {
            this.dbClient = ConfigurationService.get('database.sql.client');
            if(!this.dbClient) {
                debug(`Error: missing sql client configuration.
Please set the configuration \`database.sql.client\` with the sql client you want to use: "mysql", "pg", or "sqlite3"`);
            }
        }
        if((this.dbClient === 'pg' || this.dbClient === 'mysql') && !this.dbConnectionHost) {
            this.dbConnectionHost = ConfigurationService.get('database.sql.connection.host');
            if(!this.dbConnectionHost) {
                debug(`Error: missing sql host configuration.
Please set the configuration \`database.sql.connection.host\` with the sql hostname`);
            }
        }
        if((this.dbClient === 'pg' || this.dbClient === 'mysql') && !this.dbConnectionUser) {
            this.dbConnectionUser = ConfigurationService.get('database.sql.connection.user');
            if(!this.dbConnectionUser) {
                debug(`Error: missing sql user configuration.
Please set the configuration \`database.sql.connection.user\` with the sql connection user`);
            }
        }
        if((this.dbClient === 'pg' || this.dbClient === 'mysql') && !this.dbConnectionPassword) {
            this.dbConnectionPassword = ConfigurationService.get('database.sql.connection.password');
            if(!this.dbConnectionPassword) {
                debug(`Error: missing sql password configuration.
Please set the configuration \`database.sql.connection.password\` with the sql connection password`);
            }
        }
        if((this.dbClient === 'pg' || this.dbClient === 'mysql') && !this.dbConnectionDatabase) {
            this.dbConnectionDatabase = ConfigurationService.get('database.sql.connection.database');
            if(!this.dbConnectionDatabase) {
                debug(`Error: missing sql database configuration.
Please set the configuration \`database.sql.connection.database\` with the sql connection database`);
            }
        }
        if((this.dbClient === 'pg' || this.dbClient === 'mysql') && !this.dbConnectionPort) {
            this.dbConnectionPort = ConfigurationService.get('database.sql.connection.port');
            if(!this.dbConnectionPort) {
                debug(`Error: missing sql port configuration.
Please set the configuration \`database.sql.connection.port\` with the sql connection port`);
            }
        }
        if(this.dbClient === 'sqlite3' && !this.dbConnectionFile) {
            this.dbConnectionFile = ConfigurationService.get('database.sql.connection.file');
            if(!this.dbConnectionFile) {
                debug(`Error: missing sql file configuration.
Please set the configuration \`database.sql.connection.file\` with the sql connection file`);
            }
        }

        let adapter;
        if(this.adapter) {
            adapter = this.adapter;
        }
        else {
            let opts = {};
            if(this.dbClient === 'sqlite3') {
                opts = {
                    filename: this.dbConnectionFile
                };
            }
            else if(this.dbClient === 'pg' || this.dbClient === 'mysql') {
                opts = {
                    host: this.dbConnectionHost,
                    user: this.dbConnectionUser,
                    password: this.dbConnectionPassword,
                    database: this.dbConnectionDatabase,
                    port: this.dbConnectionPort
                };
            }
            else {
                debug(`Error: invalid sql client [${this.dbClient}].
Please set the configuration \`database.sql.client\` with the sql client you want to use: "mysql", "pg", or "sqlite3".`);
            }
            adapter = new SqlAdapter({
                knexOpts: {
                    client: this.dbClient,
                    connection: opts
                }
            });
            if(this.dbClient && this.dbConnectionHost && this.dbConnectionUser && this.dbConnectionPassword && this.dbConnectionDatabase && this.dbConnectionPort) {
                // Only keep adapter if the config is set, to avoid reloading on first configuration
                this.adapter = adapter;
            }
        }

        let store = new Container();
        store.registerAdapter('sql', adapter, { default: true });
        return store;
    }

}

module.exports = SqlDao;
