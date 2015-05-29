/**
 * Created by derek on 2015/5/15.
 */
var PictureUtil = require('../../utils/pictureUtil');

exports.getPictures = function(req, res) {
    console.log('Http Tessel Picture GET received!');
    PictureUtil.getAllPictures()
        .then(function(allPictures) {
            res.json(allPictures);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
};

exports.savePictures = function(req, res) {
    console.log('Http Tessel Picture POST received!');
    console.log(req.body);

    res.send('Hi');
};