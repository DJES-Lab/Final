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

//var url = 'http://' + serverConfig.host + ':' + serverConfig.port;

exports.uploadPictures = function() {
    var pictures = getPictures();
    console.log('Uploading pictures ...');

    var d = new Date();
    var name =  d.getTime() + '.jpg';
    //process.env.TESSEL_UPLOAD_DIR = '../public/pictures/';
    process.sendfile(name, pictures[0]);
};