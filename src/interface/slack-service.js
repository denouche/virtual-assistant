'use strict';

const RtmClient = require('@slack/client').RtmClient,
    CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS,
    RTM_EVENTS = require('@slack/client').RTM_EVENTS,
    MemoryDataStore = require('@slack/client').MemoryDataStore,
    Bottleneck = require('bottleneck'),
    _ = require('lodash'),
    entities = require('entities'),
    EventEmitter = require('events').EventEmitter;

const limiter = new Bottleneck(1, 1000);


class SlackService extends EventEmitter {

    constructor(options) {
        super();
        
        this.slackToken = options.token;
        this.administrators = options.administrators || [];

        this.slack = null; // RtmClient
        this.authenticatedUserId = null; // Current bot id

        this.init();
        this.slack.start();
    }
    
    getDataStore() {
        return this.slack.dataStore;
    }

    isAdministrator(userId) {
        return this.administrators.indexOf(userId) !== -1;
    }

    getAuthenticatedUserId() {
        return this.authenticatedUserId;
    }

    init() {
        if(!this.slackToken) {
            throw "Missing slack token. You must instanciate this interface with the slack token as parameter";
        }

        this.slack = new RtmClient(process.env.SLACK_TOKEN, {
            logLevel: 'warning',
            dataStore: new MemoryDataStore()
        });
        this.slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
            this.authenticatedUserId = rtmStartData.self.id;

            var channels = Object.keys(rtmStartData.channels)
                .map((k) => { return rtmStartData.channels[k]; })
                .filter((c) => { return c.is_member; })
                .map((c) => { return c.name; });
         
            var groups = Object.keys(rtmStartData.groups)
                .map((k) => { return rtmStartData.groups[k]; })
                .filter((g) => { return g.is_open && !g.is_archived; })
                .map((g) => { return g.name; });
         
            console.info('Welcome to Slack. You are ' + rtmStartData.self.name + ' of ' + rtmStartData.team.name);
         
            if (channels.length > 0) {
                console.info('You are in: ' + channels.join(', '));
            }
            else {
                console.info('You are not in any channels.');
            }
         
            if (groups.length > 0) {
               console.info('As well as: ' + groups.join(', '));
            }
        });


        this.slack.on(RTM_EVENTS.MESSAGE, (event) => {
            var channel = this.slack.dataStore.getChannelGroupOrDMById(event.channel);
            if(channel && event.type === 'message') {
                var message;
                switch(event.subtype) {
                    case undefined:
                        // new message
                        message = event;
                        break;
                    case 'message_changed':
                        message = event.message;
                        break;
                    default:
                        console.warn('event, RTM_EVENTS.MESSAGE with unmanaged event subtype ', event.subtype, JSON.stringify(event));
                        break;
                }
                if(message && message.text) {
                    if(channel.is_im) {
                        var user = this.slack.dataStore.getUserById(message.user);
                        if(!user.is_bot) {
                            // Ignore bot ims
                            this.emit('message', entities.decodeHTML(message.text), {
                                userId: message.user,
                                channelId: event.channel
                            });
                        }
                    }
                    else {
                        this.emit('channel', entities.decodeHTML(message.text), {
                            userId: message.user,
                            channelId: event.channel
                        });
                    }
                }
            }
        });
    }


    send(channelId, message) {
        if(this.slack && channelId) {
            limiter.submit((toSend, done) => {
                this.slack.sendMessage(toSend, channelId);
                done();
            }, message, () => { /* done function, callback needed */ });
        }
    }

}


module.exports = SlackService;




/*
        that.slack.on(CLIENT_EVENTS.RTM.DISCONNECT, function () {
            console.error('DISCONNECT', arguments);
        });
        */

/*
        that.slack.on(CLIENT_EVENTS.RTM.CONNECTING, function (event) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CLIENT EVENT')
            console.log('CLIENT_EVENTS.RTM.CONNECTING', JSON.stringify(event))
        });
        that.slack.on(CLIENT_EVENTS.RTM.WS_OPENING, function (event) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CLIENT EVENT')
            console.log('CLIENT_EVENTS.RTM.WS_OPENING', JSON.stringify(event))
        });
        that.slack.on(CLIENT_EVENTS.RTM.WS_OPENED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CLIENT EVENT')
            console.log('CLIENT_EVENTS.RTM.WS_OPENED', JSON.stringify(event))
        });
        that.slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CLIENT EVENT')
            console.log('CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED', JSON.stringify(event))
        });
        that.slack.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, function (event) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CLIENT EVENT')
            console.log('CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START', JSON.stringify(event))
        });
        that.slack.on(CLIENT_EVENTS.RTM.WS_CLOSE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CLIENT EVENT')
            console.log('CLIENT_EVENTS.RTM.WS_CLOSE', JSON.stringify(event))
        });
        that.slack.on(CLIENT_EVENTS.RTM.WS_ERROR, function (event) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CLIENT EVENT')
            console.log('CLIENT_EVENTS.RTM.WS_ERROR', JSON.stringify(event))
        });
        that.slack.on(CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, function (event) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CLIENT EVENT')
            console.log('CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT', JSON.stringify(event))
        });
        that.slack.on(CLIENT_EVENTS.RTM.RAW_MESSAGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CLIENT EVENT')
            console.log('CLIENT_EVENTS.RTM.RAW_MESSAGE', JSON.stringify(event))
        });
*/

/*
        that.slack.on(CLIENT_EVENTS.RTM.WS_CLOSE, function () {
            console.error('WS_CLOSE', JSON.stringify(arguments));
        });
        that.slack.on(CLIENT_EVENTS.RTM.WS_ERROR, function () {
            console.error('WS_ERROR', JSON.stringify(arguments));
        });
        that.slack.on(CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, function () {
            console.error('ATTEMPTING_RECONNECT', JSON.stringify(arguments));
        });

*/







/*

that.slack.on(RTM_EVENTS.ACCOUNTS_CHANGED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.ACCOUNTS_CHANGED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.BOT_ADDED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.BOT_ADDED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.BOT_CHANGED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.BOT_CHANGED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.CHANNEL_ARCHIVE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.CHANNEL_ARCHIVE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.CHANNEL_CREATED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.CHANNEL_CREATED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.CHANNEL_DELETED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.CHANNEL_DELETED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.CHANNEL_HISTORY_CHANGED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.CHANNEL_HISTORY_CHANGED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.CHANNEL_JOINED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.CHANNEL_JOINED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.CHANNEL_LEFT, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.CHANNEL_LEFT', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.CHANNEL_MARKED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.CHANNEL_MARKED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.CHANNEL_RENAME, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.CHANNEL_RENAME', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.CHANNEL_UNARCHIVE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.CHANNEL_UNARCHIVE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.COMMANDS_CHANGED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.COMMANDS_CHANGED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.DND_UPDATED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.DND_UPDATED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.DND_UPDATED_USER, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.DND_UPDATED_USER', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.EMAIL_DOMAIN_CHANGED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.EMAIL_DOMAIN_CHANGED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.EMOJI_CHANGED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.EMOJI_CHANGED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_CHANGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_CHANGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_COMMENT_ADDED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_COMMENT_ADDED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_COMMENT_DELETED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_COMMENT_DELETED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_COMMENT_EDITED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_COMMENT_EDITED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_CREATED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_CREATED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_DELETED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_DELETED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_PRIVATE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_PRIVATE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_PUBLIC, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_PUBLIC', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_SHARED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_SHARED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.FILE_UNSHARED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.FILE_UNSHARED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.GROUP_ARCHIVE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.GROUP_ARCHIVE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.GROUP_CLOSE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.GROUP_CLOSE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.GROUP_HISTORY_CHANGED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.GROUP_HISTORY_CHANGED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.GROUP_JOINED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.GROUP_JOINED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.GROUP_LEFT, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.GROUP_LEFT', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.GROUP_MARKED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.GROUP_MARKED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.GROUP_OPEN, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.GROUP_OPEN', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.GROUP_RENAME, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.GROUP_RENAME', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.GROUP_UNARCHIVE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.GROUP_UNARCHIVE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.HELLO, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.HELLO', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.IM_CLOSE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.IM_CLOSE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.IM_CREATED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.IM_CREATED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.IM_HISTORY_CHANGED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.IM_HISTORY_CHANGED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.IM_MARKED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.IM_MARKED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.IM_OPEN, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.IM_OPEN', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.MANUAL_PRESENCE_CHANGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.MANUAL_PRESENCE_CHANGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.MESSAGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.MESSAGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.MPIM_CLOSE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.MPIM_CLOSE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.MPIM_HISTORY_CHANGED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.MPIM_HISTORY_CHANGED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.MPIM_JOINED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.MPIM_JOINED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.MPIM_OPEN, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.MPIM_OPEN', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.PIN_ADDED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.PIN_ADDED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.PIN_REMOVED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.PIN_REMOVED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.PREF_CHANGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.PREF_CHANGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.PRESENCE_CHANGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.PRESENCE_CHANGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.REACTION_ADDED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.REACTION_ADDED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.REACTION_REMOVED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.REACTION_REMOVED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.RECONNECT_URL, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.RECONNECT_URL', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.STAR_ADDED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.STAR_ADDED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.STAR_REMOVED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.STAR_REMOVED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.SUBTEAM_CREATED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.SUBTEAM_CREATED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.SUBTEAM_SELF_ADDED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.SUBTEAM_SELF_ADDED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.SUBTEAM_SELF_REMOVED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.SUBTEAM_SELF_REMOVED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.SUBTEAM_UPDATED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.SUBTEAM_UPDATED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.TEAM_DOMAIN_CHANGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.TEAM_DOMAIN_CHANGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.TEAM_JOIN, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.TEAM_JOIN', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.TEAM_MIGRATION_STARTED, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.TEAM_MIGRATION_STARTED', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.TEAM_PLAN_CHANGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.TEAM_PLAN_CHANGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.TEAM_PREF_CHANGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.TEAM_PREF_CHANGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.TEAM_PROFILE_CHANGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.TEAM_PROFILE_CHANGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.TEAM_PROFILE_DELETE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.TEAM_PROFILE_DELETE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.TEAM_PROFILE_REORDER, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.TEAM_PROFILE_REORDER', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.TEAM_RENAME, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.TEAM_RENAME', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.USER_CHANGE, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.USER_CHANGE', JSON.stringify(event))
});
that.slack.on(RTM_EVENTS.USER_TYPING, function (event) {
            console.log('$$$$$$$$$$$$$$$$$')
            console.log('RTM_EVENTS.USER_TYPING', JSON.stringify(event))
});



*/



