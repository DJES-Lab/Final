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
    /**
     * 1. Scan picture folder (rfids, picture urls)
     * 2. Update redis database for each rfid
     * 3. return picture urls of given user's/permission pictures
     *
     * Permissions:
     * 1. Public: get all pictures with public permissions (find rfid permission == 0)
     * 2. VIP Public: get all pictures with VPI permissions (find rfid permission ==1)
     * 3. Private: get all user owned pictures (find user's rfids then get all pictures of those rfids)
     */
};