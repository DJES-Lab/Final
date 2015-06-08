
var tessel = require('tessel');
//var ambientlib = require('ambient-attx4');

var amb = require('ambient-attx4').use(tessel.port['D']);

var ambientData = module.exports = {};

//amb.on('ready', function () {
    // Get points of light and sound data.
    //console.log('Ambient ready!');
    //setInterval( function () {
        //console.log('In setInterval');
        //ambient.getLightLevel( function(err, ldata) {
        //    console.log(err);
        //    if (err) throw err;
        //    ambient.getSoundLevel( function(err, sdata) {
        //        if (err) throw err;
        //        console.log("Light level:", ldata.toFixed(6), " ", "Sound Level:", sdata.toFixed(6));
        //        ambientData.soundLevel = sdata.toFixed(6);
        //        ambientData.lightLevel = ldata.toFixed(6);
        //    });
        //})
    //}, 500); // The readings will happen every .5 seconds unless the trigger is hit


//});

//ambient.on('error', function (err) {
//    console.log(err)
//});