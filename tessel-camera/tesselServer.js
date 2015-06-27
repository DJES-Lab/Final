/**
 * Created by chen on 2015/6/25.
 */
var http = require('http');
var config = require('./config');
var event = require('./event');
var setState = require('./fsm').setState;
var api = require('./api');

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
        var obj = JSON.parse(post_request_body);
        api.setUName(obj.username);
    });
    var pictureListener = function(pictureNames) {
        console.log('Returning picture names...');
        res.write(JSON.stringify(pictureNames));
        res.end();
        event.removeListener('uploadProfile', pictureListener);
    };
    event.on('uploadProfile', pictureListener);
    setTimeout(function() {
        pictureListener([]);  // If no picture is taken, respond with empty picture name array
    }, 60000);
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        postRequestHandler(req, res);
    }
});

server.listen(config.tesselServer.port, config.tesselServer.host);
console.log('Tessel server waiting for connection at http://' + config.tesselServer.host + ':' + config.tesselServer.port);
