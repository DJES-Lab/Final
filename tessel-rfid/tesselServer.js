/**
 * Created by chen on 2015/6/8.
 */
var http = require('http');
var config = require('./config');
var event = require('./event');
//var rfid = require('./rfid');
var setState = require('./fsm').setState;

var getRequestHandler = function (req, res) {
    //res.setTimeout(10000, function () {
    //    console.log('Tessel server timeout! No RFID cards!');
    //});
    console.log('Got HTTP GET Request');
    setState(1);
    var cardListener = function(data) {
        console.log('card: ' + data);
        res.write(data);
        res.end();
        event.removeListener('sendRFIDByHttp', cardListener);
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
