/**
 * Created by derek on 2015/5/15.
 */
var tessel = require('tessel');
var http = require('http');
http.post = require('./httpJsonPost');
var serverConfig = require('./config').server;

var cameraAPI = require('./camera');

var url = 'http://' + serverConfig.host + ':' + serverConfig.port;

exports.uploadPictures = function() {
    var pictures = cameraAPI.getPictures();

    http.post(url + '/api/tessel/pictures', pictures, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log(chunk);
            cameraAPI.clearPictures();
        });
    });
};