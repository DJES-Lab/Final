/**
 * Created by derek on 2015/6/15.
 */
var Nohm = require('nohm').Nohm,
    User = require('../../models/user'),
    Rfid = require('../../models/tessel/rfid'),
    Promise = require('bluebird');

var getRfidById = exports.getRfidById = function(id) {
    return new Promise(function(resolve, reject) {
        var rfid = Nohm.factory('Rfid', id, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rfid);
            }
        })
    });
};

exports.registerRfid = function(req) {

};

exports.changeRfidPermission = function(req) {

};

exports.getPictures = function(req) {

};