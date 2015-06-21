/**
 * Created by derek on 2015/3/26.
 */
var RfidUtil = require('../utils/tessel/rfidUtil'),
    ErrorUtil = require('../utils/errorUtil');

/**
 * Route middleware to ensure user is authenticated
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
};

/**
 * Authorizations routing middleware
 */
exports.comment = {
    hasAuthorization: function(req, res, next) {
        if (req.comment.allProperties().creator.id != req.user.allProperties().id) {
            return res.sendStatus(403);
        }
        next();
    }
};

exports.rfid = {
    hasAuthorization: function(req, res, next) {
        RfidUtil.userHasRfid(req.user.allProperties().rfids, req.rfid.allProperties().rfid)
            .then(function(valid) {
                if (!valid) {
                    return res.status(403).json({
                        type: 'FORBIDDEN',
                        message: 'This Rfid does not belong to you!'
                    });
                }
                next();
            })
            .catch(function(err) {
                return res.status(403).json(err);
            });
    },
    checkIdentity: function(req, res, next) {
        if (req.permission == 1) {  // VIP permission needs to check user's identity
            RfidUtil.requestRfid()
                .then(function(rfid) {
                    return RfidUtil.userHasRfid(req.user.allProperties().rfids, rfid);
                })
                .then(function(valid) {
                    if (!valid) {
                        return res.status(403).json({
                            type: 'FORBIDDEN',
                            message: 'This Rfid does not belong to you! (Forgot to add it?)'
                        });
                    }
                    next();
                })
                .catch(function(err) {
                    return res.status(403).json(ErrorUtil.errorHandler(err));
                });
        } else {
            next();
        }
    }
};