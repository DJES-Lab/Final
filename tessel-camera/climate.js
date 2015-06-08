
var tessel = require('tessel');
// if you're using a si7020 replace this lib with climate-si7020
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['D']);

var climateData = exports.climateData = {};

climate.on('ready', function () {
    console.log('Connected to si7005');

    // Loop forever
    //setImmediate(function loop () {
    //    climate.readTemperature('c', function (err, temp) {
    //        climate.readHumidity(function (err, humid) {
    //            console.log('Degrees:', temp.toFixed(4) + 'C', 'Humidity:', humid.toFixed(4) + '%RH');
    //            setTimeout(loop, 300);
    //        });
    //    });
    //});
    setInterval(function () {
        climate.readTemperature('c', function (err, temp) {
            climate.readHumidity(function (err, humid) {
                //console.log('Degrees:', temp.toFixed(4) + 'C', 'Humidity:', humid.toFixed(4) + '%RH');
                climateData.degree = Math.round(temp * 1e4) / 1e4;
                climateData.humidity = Math.round(humid * 1e4) / 1e4;
            });
        });
    }, 500);
});

climate.on('error', function(err) {
    console.log('error connecting module', err);
});