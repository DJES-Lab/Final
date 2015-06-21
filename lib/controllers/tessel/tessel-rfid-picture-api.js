/**
 * Created by derek on 2015/6/21.
 */
var RfidPictureUtil = require('../../utils/rfidPictureUtil');

exports.permission = function(req, res, next, permission) {
    if (permission == 0 || permission == 1 || permission == 2) {
        req.permission = permission;
        next();
    } else {
        next(new Error('Permission ' + permission + ' is not valid '));
    }
};

exports.getPictures = function(req, res) {
    console.log('Http Tessel Rfid Picture GET received!');
    RfidPictureUtil.getPictures(req)
        .then(function(allPictures) {
            res.json(allPictures);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
};