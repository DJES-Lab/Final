/**
 * Created by chen on 2015/5/11.
 */
var tessel = require('tessel');
var relaylib = require('relay-mono');

var relay = relaylib.use(tessel.port['B']);

// Wait for the module to connect
relay.on('ready', function relayReady () {
    console.log('Relay is ready!');
    //setInterval(function toggle() {
    //    // Toggle relay channel 1
    //    relay.toggle(1, function toggleOneResult(err) {
    //        if (err) console.log("Err toggling 1", err);
    //    });
    //}, 2000); // Every 2 seconds (2000ms)
});

exports.relayToggle = function() {
    // Toggle relay channel 1
    relay.toggle(1, function toggleOneResult(err) {
        if (err) console.log("Err toggling 1", err);
    });
};

// When a relay channel is set, it emits the 'latch' event
relay.on('latch', function(channel, value) {
    console.log('latch on relay channel ' + channel + ' switched to', value);
});