
var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);

var accelerometerData = exports.accelerometerData = {};

// Initialize the accelerometer.
accel.on('ready', function () {

    accel.setOutputRate(2.0, function () {
        console.log('Output rate is changed to 2.0 Hz')
    });

    // Stream accelerometer data
    accel.on('data', function (xyz) {
        //console.log('x:', xyz[0].toFixed(2),
        //    'y:', xyz[1].toFixed(2),
        //    'z:', xyz[2].toFixed(2));
        //accelerometerData.x = xyz[0].toFixed(2);
        //accelerometerData.y = xyz[1].toFixed(2);
        //accelerometerData.z = xyz[2].toFixed(2);
        accelerometerData.x = Math.round(xyz[0] * 1e2) / 1e2;
        accelerometerData.y = Math.round(xyz[1] * 1e2) / 1e2;
        accelerometerData.z = Math.round(xyz[2] * 1e2) / 1e2;
    });

});

accel.on('error', function(err){
    console.log('Error:', err);
});