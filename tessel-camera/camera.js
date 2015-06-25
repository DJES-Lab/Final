/**
 * Created by derek on 2015/5/11.
 */
// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
 This camera example takes a picture. If a
 directory is specified with the --upload-dir
 flag, the picture is saved to that directory.
 *********************************************/
var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port['D']);

var notificationLED = tessel.led[1]; // Set up an LED to notify when we're taking a picture

var pictures = [];
var uid;
var uName;

exports.takePicture = function(type) {
    console.log('Taking a picture');
    notificationLED.low();
    camera.takePicture(function (err, image) {
        if (err) {
            console.log('error taking image', err);
        } else {
            notificationLED.high();
            // Name the image
            var name;
            var da = new Date();
            if (type == 'userName') {
                name = '_' + uName + '_' + da.getTime() + '.jpg';
            }
            else {
                name = uid + '_' + da.getTime() + '.jpg';
            }
            pictures.push({
                image: image,
                name: name
            });
            console.log('done.');
            // Turn the camera off to end the script
            //camera.disable();
        }
    });
};

exports.getPictures = function() {
    return pictures;
};

exports.clearPictures = function() {
    pictures.length = 0;
};

exports.setUid = function(id) {
    uid = id;
};

exports.setUName = function(name) {
    uName = name;
};

// Wait for the camera module to say it's ready
camera.on('ready', function() {
    notificationLED.high();
    console.log('Camera is ready!');
    // Take the picture
});

camera.on('error', function(err) {
    console.error(err);
});