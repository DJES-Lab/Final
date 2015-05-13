var tessel = require('tessel');
var infraredlib = require('ir-attx4');
var infrared = infraredlib.use(tessel.port['A']);
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
    }
});
