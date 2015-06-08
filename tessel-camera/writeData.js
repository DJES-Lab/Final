/**
 * Created by chen on 2015/4/17.
 */
var tessel = require('tessel');
var sdcardlib = require('sdcard');
var sdcard = sdcardlib.use(tessel.port['B']);
var led1 = tessel.led[0];
var http = require('http');
http.post = require('./httpJsonPost');
var serverConfig = require('./config').server;
var dataInfo = require('./config').dataInfo;

var url = 'http://' + serverConfig.host + ':' + serverConfig.port;

//var fileID = 0;
var batchSize = 300;
var accelerometerData = require('./accelerometer').accelerometerData;
var climateData = require('./climate').climateData;
var gpsData = require('./gps').gpsData;
var data = [];
for (var i = 0; i < batchSize; i++) {
    data.push({
        title: '',
        accelerometerData: {},
        climateData: {},
        gpsData: {},
        time: {}
    })
}

sdcard.on('ready', function() {
    sdcard.getFilesystems(function(err, fss) {
        fs = fss[0];
        console.log('File System is ready');

        var i = 0;
        setInterval(function() {
            //console.log(accelerometerData);
            data[i].title = dataInfo.title;
            data[i].accelerometerData.x = accelerometerData.x;
            data[i].accelerometerData.y = accelerometerData.y;
            data[i].accelerometerData.z = accelerometerData.z;
            data[i].climateData.degree = climateData.degree;
            data[i].climateData.humidity = climateData.humidity;
            data[i].gpsData.lat = gpsData.lat;
            data[i].gpsData.lng = gpsData.lng;
            data[i].time = new Date().toString();
            i++;
            if (i == batchSize) {
                //console.log(data);
                //var fileName = 'accelData' + fileID + '.txt';
                var writeBlinkID = setInterval(function() {
                    led1.toggle();
                }, 400);
                fs.writeFile('data.txt', JSON.stringify(data).slice(1, -1) + ',', function (err) {
                    console.log('Write complete');
                    clearInterval(writeBlinkID);
                    led1.output(1);
                });

                //fs.appendFileSync('accelData.txt', JSON.stringify(data).slice(1, -1) + ',', 'utf8');
                i = 0;
                //fileID++;
            }
        }, 1000);
    });
});
