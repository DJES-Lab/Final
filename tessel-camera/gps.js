
var tessel = require('tessel');
var gpsLib = require('gps-a2235h');
gpsLib.debug = 0; // switch this to 1 for debug logs, 2 for printing out raw nmea messages

// GPS uses software UART, which is only available on Port C
// we use Port C because it is port most isolated from RF noise
var gps = gpsLib.use(tessel.port['C']);
var led1 = tessel.led[0].output(0);
var led2 = tessel.led[1].output(0);

var gpsData = exports.gpsData = {};

// Wait until the module is connected
gps.on('ready', function () {
    console.log('GPS module powered and ready. Waiting for satellites...');
    led1.toggle();

    // Emit coordinates when we get a coordinate fix
    gps.on('coordinates', function (coords) {
        console.log('Lat:', coords.lat, '\tLon:', coords.lon, '\tTimestamp:', coords.timestamp);
        gpsData.lat = coords.lat;
        gpsData.lng = coords.lon;
        led2.toggle();
    });

    // Emit altitude when we get an altitude fix
    gps.on('altitude', function (alt) {
        console.log('Got an altitude of', alt.alt, 'meters (timestamp: ' + alt.timestamp + ')');
        led2.toggle();
    });

    // Emitted when we have information about a fix on satellites
    gps.on('fix', function (data) {
        console.log(data.numSat, 'fixed.');
        led2.toggle();
    });

    gps.on('dropped', function(){
        // we dropped the gps signal
        console.log("gps signal dropped");
        led2.toggle();
    });
});

gps.on('error', function(err){
    console.log("got this error", err);
});