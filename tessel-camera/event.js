/**
 * Created by derek on 2015/6/15.
 */
var events = require('events');
var eventBus = new events.EventEmitter;

eventBus.trigger = function(eventName, data) {
    this.emit(eventName, data);
};

module.exports = eventBus;