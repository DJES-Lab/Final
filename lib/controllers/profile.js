/**
 * Created by derek on 2015/6/25.
 */
var Promise = require('bluebird'),
    ProfileUtil = require('../utils/profileUtil');

exports.newProfile = function(req, res) {
    ProfileUtil.newProfile(req)
        .then(function(profileObj) {
            res.json(profileObj);
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

exports.updateActive = function(req, res) {
    ProfileUtil.updateActive(req)
        .then(function(activeProfile) {
            res.json(activeProfile);
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};