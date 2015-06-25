/**
 * Created by chen on 2015/6/25.
 */
var http = require('http');
var config = require('./config');
var event = require('./event');
var setState = require('./fsm').setState;
var setUName = require('./camera').setUName;

// To initiate running of the module
var ir = require('./ir');

var postRequestHandler = function (req, res) {
    //res.setTimeout(10000, function () {
    //    console.log('Tessel server timeout! No RFID cards!');
    //});
    console.log('Got HTTP POST Request');
    setState(2);
    var post_request_body = '';
    req.on('data', function (data) {
        post_request_body += data;
    });
    req.on('end', function (data) {
        //console.log(post_request_body);
        var obj = JSON.parse(post_request_body);
        setUName(obj.username);
    });
    var pictureListener = function(pictureNames) {
        console.log('Returning picture names...');
        res.write(JSON.stringify(pictureNames));
        res.end();
        event.removeListener('uploadProfile', pictureListener);
    };
    event.on('uploadProfile', pictureListener);
};

var server = http.createServer(function (req, res) {
    //console.log(req);
    if (req.method === 'POST') {
        postRequestHandler(req, res);
    }
});

server.listen(config.tesselServer.port, config.tesselServer.host);
console.log('Tessel server waiting for connection at http://' + config.tesselServer.host + ':' + config.tesselServer.port);
