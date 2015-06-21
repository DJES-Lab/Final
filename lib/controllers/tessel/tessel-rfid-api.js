/**
 * Created by derek on 2015/6/15.
 */
var RfidUtil = require('../../utils/tessel/rfidUtil');

exports.rfid = function(req, res, next, id) {
    RfidUtil.getRfidById(id)
        .then(function(rfid) {
            req.rfid = rfid;
            next();
        })
        .catch(function(err) {
            if (err == 'not found') {
                return next(new Error('Failed to load data ' + id));
            } else {
                return next(err);
            }
        });
};

exports.registerRfid = function(req, res) {
    console.log('Got rfid registering request');
    RfidUtil.registerRfid(req)
        .then(function(rfid) {
            res.json(rfid);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
};

exports.getAll= function(req, res) {
    console.log('Getting user rfids');
    RfidUtil.getUserRfids(req)
        .then(function(rfids) {
            res.json(rfids);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
};

exports.show = function(req, res) {
    res.json(req.rfid.allProperties());
};

exports.update = function(req, res) {
    RfidUtil.updateRfid(req)
        .then(function(rfid) {
            res.json(rfid);
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

exports.destroy = function(req, res) {
    RfidUtil.destroyRfid(req)
        .then(function(rfid) {
            res.json(rfid);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
};