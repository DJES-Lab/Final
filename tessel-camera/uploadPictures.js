/**
 * Created by derek on 2015/5/15.
 */
var tessel = require('tessel');
//var http = require('http');
//http.post = require('./httpJsonPost');
//var serverConfig = require('./config').server;

var notificationLED = tessel.led[0];

var api = require('./api');
var getState = require('./fsm').getState;
var setState = require('./fsm').setState;
var event = require('./event');

//var url = 'http://' + serverConfig.host + ':' + serverConfig.port;

exports.uploadPictures = function() {
    var pictures = api.getPictures();
    console.log('Uploading pictures ...');
    notificationLED.high();
    setTimeout(function(){
        notificationLED.low();
    }, 2000);

    if (pictures.length > 0) {
        for (var i = 0; i < pictures.length; i++) {
            process.sendfile(pictures[i].name, pictures[i].image);
        }
        var state = getState();
        if (state == 2) {
            setState(0);
            var pictureNames = pictures.map(function(picture){
                return picture.name;
            });
            event.trigger('uploadProfile', pictureNames);
        }
        api.clearPictures();
    }
    else {
        console.log('No pictures to be uploaded!');
    }
};