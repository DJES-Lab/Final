var tessel = require('tessel');
var infraredlib = require('ir-attx4');
var infrared = infraredlib.use(tessel.port['A']);
var parseIR = require('./parseIR');
//var relayToggle = require('./relay').relayToggle;
var servoLeft = require('./servo').servoLeft;
var servoRight = require('./servo').servoRight;
var autoPanorama = require('./servo').autoPanorama;
var uploadPictures = require('./uploadPictures').uploadPictures;
var takePicture = require('./camera').takePicture;
var getState = require('./fsm').getState;
//var getPictures = require('./camera').getPictures;
//var clearPictures = require('./camera').clearPictures;

// To initiate running of the module
var nrf24_Rx = require('./nrf24_Rx');

var notificationLED = tessel.led[2];

// When we're connected
infrared.on('ready', function() {
    if (!err) {
        console.log("Connected to IR!");
        notificationLED.high();
    } else {
        console.log(err);
    }
});

// If we get data, print it out
infrared.on('data', function(data) {
    //console.log("Received RX Data: ", JSON.stringify(data));
    if (data.length > 10) {
        //console.log('Received signal');
        var state = getState();
        if (state == 0) {
            console.log('Tessel-camera is locked. Please register with an RFID card.')
        }
        else {
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
                    uploadPictures();
                    break;
                case 'powerButton':
                    //relayToggle();
                    break;
                case 'okButton':
                    if (state == 1) {
                        takePicture('userId');
                    }
                    else {
                        takePicture('userName');
                    }
                    break;
                case 'playButton':
                    // Deprecated: only used in ESLab3
                    //autoPanorama();
                    break;
                default:
            }
        }
    }
});
