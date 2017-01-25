'use strict';

const EventEmitter = require('events').EventEmitter;


class DefaultInterface extends EventEmitter {

    constructor(channelId, userId) {
        super();
        this.channelId = channelId;
        this.userId = userId;
    }

    send(channelId, message) {
        this.emit('response', this.channelId, this.userId, message);
    }

}


module.exports = DefaultInterface;
