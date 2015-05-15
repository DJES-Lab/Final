var tessel = require('tessel');
var infraredlib = require('ir-attx4');
var infrared = infraredlib.use(tessel.port['A']);
var parseIR = require('./parseIR');
var relayToggle = require('./relay').relayToggle;
var servoLeft = require('./servo').servoLeft;
var servoRight = require('./servo').servoRight;
var autoPanorama = require('./servo').autoPanorama;

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
    //console.log("Received RX Data: ", JSON.stringify(data));
    if (data.length > 10) {
        //console.log('Received signal');
        var button = parseIR(data);
        console.log(button + ' is pressed');
        switch (button) {
            case 'leftButton':
                servoLeft();
                break;
            case 'rightButton':
                servoRight();
                break;
            case 'upButton':
                break;
            case 'powerButton':
                relayToggle();
                break;
            case 'okButton':
                break;
            case 'playButton':
                autoPanorama();
                break;
            default:
        }
    }
});
