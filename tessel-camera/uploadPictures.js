/**
 * Created by derek on 2015/5/15.
 */
var tessel = require('tessel');
//var http = require('http');
//http.post = require('./httpJsonPost');
//var serverConfig = require('./config').server;

//var cameraAPI = require('./camera');
var getPictures = require('./camera').getPictures;
var clearPictures = require('./camera').clearPictures;
var getState = require('./fsm').getState;
var setState = require('./fsm').setState;
var event = require('./event');

//var url = 'http://' + serverConfig.host + ':' + serverConfig.port;

exports.uploadPictures = function() {
    var pictures = getPictures();
    console.log('Uploading pictures ...');

    if (pictures.length > 0) {
        for (var i = 0; i < pictures.length; i++) {
            process.sendfile(pictures[i].name, pictures[i].image);
        }
        clearPictures();
        var state = getState();
        if (state == 2) {
            setState(0);
            var pictureNames = pictures.map(function(picture){
                return picture.name;
            });
            event.trigger('uploadProfile', pictureNames);
        }
    }
    else {
        console.log('No pictures to be uploaded!');
    }
};