/**
 * Created by chen on 2015/6/25.
 */
var http = require('http');
var config = require('./config');
var event = require('./event');
var setState = require('./fsm').setState;

var getRequestHandler = function (req, res) {
    //res.setTimeout(10000, function () {
    //    console.log('Tessel server timeout! No RFID cards!');
    //});
    console.log('Got HTTP GET Request');
    setState(2);
    var pictureListener = function(pictureNames) {
        console.log('Returning picture names...');
        res.write(JSON.stringify(pictureNames));
        res.end();
        event.removeListener('uploadProfile', pictureListener);
    };
    event.on('sendRFIDByHttp', cardListener);
};

var server = http.createServer(function (req, res) {
    if (req.method === 'GET') {
        getRequestHandler(req, res);
    }
});

server.listen(config.tesselServer.port, config.tesselServer.host);
console.log('Tessel server waiting for connection at http://' + config.tesselServer.host + ':' + config.tesselServer.port);
