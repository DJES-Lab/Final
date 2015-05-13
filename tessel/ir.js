var tessel = require('tessel');
var infraredlib = require('ir-attx4');
var infrared = infraredlib.use(tessel.port['A']);
//var relaylib = require('relay-mono');
//var relay = relaylib.use(tessel.port['B']);
var parseIR = require('./parseIR');

// When we're connected
infrared.on('ready', function() {
    if (!err) {
        console.log("Connected to IR!");
    } else {
        console.log(err);
    }
});

// If we get data, print it out
infrared.on('data', function(data) {
    console.log("Received RX Data: ", JSON.stringify(data));
    if (data.length > 10) {
        console.log('Received signal');
        console.log(parseIR(data));
        //console.log('Toggling relays...');
        //relay.toggle(1, function toggleOneResult(err) {
        //    if (err) console.log("Err toggling 1", err);
        //});
    }
});

//relay.on('ready', function relayReady () {
//    console.log('Relay ready!');
//});
//
//// When a relay channel is set, it emits the 'latch' event
//relay.on('latch', function(channel, value) {
//    console.log('latch on relay channel ' + channel + ' switched to', value);
//});