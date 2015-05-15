/**
 * Created by derek on 2015/5/15.
 */
var Promise = require('bluebird');

exports.savePictures = function(req, res) {
    console.log(req.body);

    res.send('Hi');
};