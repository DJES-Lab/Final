/**
 * Created by derek on 2015/5/15.
 */
var Promise = require('bluebird'),
    glob = require('glob');

var options = {
    picturesDir: __dirname + '/../../../public/pictures/'
};

exports.getPictures = function(req, res) {
    console.log('Http Tessel Picture GET received!');

    var pictureFilePattern = '*.jpg';

    glob(options.picturesDir + pictureFilePattern, function(err, files) {
        var resFiles = files.map(function(filePath) {
            return filePath.replace(/(.*public\/)(.*)/, '$2');
        });
        res.json(resFiles);
    });
};

exports.savePictures = function(req, res) {
    console.log('Http Tessel Picture POST received!');
    console.log(req.body);

    res.send('Hi');
};