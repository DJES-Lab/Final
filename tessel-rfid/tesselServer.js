/**
 * Created by chen on 2015/6/8.
 */
var http = require('http');
var config = require('./../tessel-camera/config');

var getRequestHandler = function (req, res) {
    res.setTimeout(10000, function () {
        console.log('Tessel server timeout! No RFID cards!');
    });
    console.log('Got HTTP GET Request');
    //res.writeHeader(200, { 'Content-Type': 'text/plain' });
    res.write('Testing ...');
    res.end();
};

var server = http.createServer(function (req, res) {
    if (req.method === 'GET') {
        getRequestHandler(req, res);
    }
});

server.listen(config.tesselServer.port, config.tesselServer.host);
console.log('Tessel server waiting for connection at http://' + config.tesselServer.host + ':' + config.tesselServer.port);
