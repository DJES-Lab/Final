/**
 * Created by derek on 2015/6/25.
 */

var pictures = [];
var uid;
var uName;

exports.addPicture = function(picture) {
    pictures.push(picture);
};

exports.getPictures = function() {
    return pictures;
};

exports.clearPictures = function() {
    pictures.length = 0;
};

exports.getUid = function() {
    return uid;
};

exports.setUid = function(id) {
    uid = id;
};

exports.getUName = function() {
    return uName;
};

exports.setUName = function(name) {
    uName = name;
};