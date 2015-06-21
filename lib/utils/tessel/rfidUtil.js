/**
 * Created by derek on 2015/6/15.
 */
var config = require('../../config/config'),
    Nohm = require('nohm').Nohm,
    User = require('../../models/user'),
    Rfid = require('../../models/tessel/rfid'),
    ErrorUtil = require('../errorUtil'),
    Promise = require('bluebird'),
    request = require('request-promise'),
    _ = require('lodash');

var requestRfid = exports.requestRfid = function() {
    var tesselRfidUrl = 'http://' + config.tesselRfid.host + ':' + config.tesselRfid.port;
    var requestOptions = {
        uri: tesselRfidUrl,
        timeout: config.tesselRfid.timeout
    };
    return request.get(requestOptions);
};

var getRfidById = exports.getRfidById = function(id) {
    return new Promise(function(resolve, reject) {
        var rfid = Nohm.factory('Rfid', id, function (err) {
            if (err) {
                reject({
                    type: 'INTERNAL',
                    message: 'Failed to load Rfid with id: ' + id
                });
            }
            else {
                resolve(rfid);
            }
        })
    });
};

var getRfidByRfid = exports.getRfidByRfid = function(rfid) {
    return new Promise(function(resolve, reject) {
        Rfid.find({
            rfid: rfid
        }, function(err, ids) {
            if (err) {
                reject({
                    type: 'INTERNAL',
                    message: 'Failed to load Rfid ' + rfid
                });
            }
            if (ids.length) {
                resolve(getRfidById(ids[0]));
            } else {
                resolve(null);
            }
        });
    });
};

var userHasRfid = exports.userHasRfid = function(userRfids, rfid) {
    return new Promise(function(resolve, reject) {
        getRfidByRfid(rfid)
            .then(function(rfidObj) {
                var valid = false;
                if (rfidObj) {
                    var rfidId = rfidObj.allProperties().id;
                    valid = _.some(userRfids, function(userRfidId) {
                        return userRfidId == rfidId;
                    });
                }
                resolve(valid);
            })
            .catch(reject);
    });
};

var createRfid = function(rfid) {
    return new Promise(function(resolve, reject) {
        getRfidByRfid(rfid)
            .then(function(rfidObj) {
                if (rfidObj) {
                    reject({
                        type: 'EXIST',
                        message: 'Rfid ' + rfid + ' already exists'
                    });
                } else {
                    var rfidModel = Nohm.factory('Rfid');
                    rfidModel.store({
                        rfid: rfid,
                        creationTime: new Date().toString()
                    }, function (err) {
                        if (err) {
                            reject({
                                type: 'INTERNAL',
                                message: 'Failed to create Rfid ' + rfid
                            });
                        } else {
                            resolve(rfidModel.allProperties());
                        }
                    });
                }
            })
            .catch(reject);
    });
};

var updateRfid = function(rfid) {
    return new Promise(function(resolve, reject) {
        requestRfid()
            .then(function(newRfid) {
                var oldRfid = rfid.allProperties().rfid;
                if (newRfid != oldRfid) {
                    //TODO: Need to update picture files!
                    rfid.store({
                        rfid: newRfid
                    }, function (err) {
                        if (err) {
                            reject({
                                type: 'INTERNAL',
                                message: 'Failed to update new Rfid ' + newRfid + ' for old Rfid ' + oldRfid
                            });
                        } else {
                            resolve(rfid.allProperties());
                        }
                    });
                } else {
                    resolve(rfid.allProperties());
                }
            })
            .catch(function(err) {
                reject(ErrorUtil.errorHandler(err));
            });
    });
};

var updateRfidPermission = function(rfid, newPermission) {
    return new Promise(function(resolve, reject) {
        rfid.store({
            permission: newPermission
        }, function(err) {
            if (err) {
                reject({
                    type: 'INTERNAL',
                    message: 'Failed to update permission ' + newPermission + ' into Rfid ' + rfid.allProperties().rfid
                });
            } else {
                resolve(rfid.allProperties());
            }
        });
    });
};

exports.updateRfidPictures = function(rfid, newPictures) {
    return new Promise(function(resolve, reject) {
        rfid.store({
            pictures: newPictures
        }, function(err) {
            if (err) {
                reject({
                    type: 'INTERNAL',
                    message: 'Failed to update ' + newPictures.length + ' pictures into Rfid ' + rfid.allProperties().rfid
                });
            } else {
                resolve(rfid.allProperties());
            }
        });
    });
};

exports.registerRfid = function(req) {
    return new Promise(function(resolve, reject) {
        requestRfid()
            .then(createRfid)
            .then(function(rfid) {
                // Updating user model with new rfid
                var user = req.user;
                if (!user) {
                    reject({
                        type: 'USER_NOT_EXIST',
                        message: 'User does not exist'
                    });
                } else {
                    var userRfids = user.allProperties().rfids;
                    userRfids.push(rfid.id);
                    user.store({
                        rfids: userRfids
                    }, function(err) {
                        if (err) {
                            reject({
                                type: 'INTERNAL',
                                message: 'Failed to add new Rfid ' + rfid.id + ' for User ' + user.allProperties().id
                            });
                        } else {
                            resolve(rfid);
                        }
                    });
                }
            })
            .catch(function(err) {
                reject(ErrorUtil.errorHandler(err));
            });
    });
};

exports.getUserRfids = function(req) {
    return new Promise(function(resolve, reject) {
        var user = req.user;
        if (!user) {
            reject({
                type: 'USER_NOT_EXIST',
                message: 'User does not exist'
            });
        } else {
            var userRfids = user.allProperties().rfids;
            Promise.map(userRfids, function(id) {
                return getRfidById(id)
                    .then(function(rfid) {
                        return rfid.allProperties();
                    })
            }, {
                concurrency: 1
            })
                .then(resolve)
                .catch(reject);
        }
    });
};

exports.getPermissionRfids = function(permission) {
    return new Promise(function(resolve, reject) {
        Rfid.find({
            permission: {
                min: permission,
                max: permission
            }
        }, function(err, ids) {
            if (err) {
                reject({
                    type: 'INTERNAL',
                    message: 'Failed to load Rfids with permission ' + permission
                });
            }
            if (ids.length) {
                Promise.map(ids, function(id) {
                    return getRfidById(id)
                        .then(function(rfid) {
                            return rfid.allProperties();
                        })
                }, {
                    concurrency: 1
                })
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve(null);
            }
        });
    });
};

exports.updateRfid = function(req) {
    return new Promise(function(resolve, reject) {
        var rfid = req.rfid;
        var updatePromises = [];
        if (req.body.rfid != undefined) {
            updatePromises.push(updateRfid(rfid));
        }
        if (req.body.permission != undefined) {
            updatePromises.push(updateRfidPermission(rfid, req.body.permission));
        }
        Promise.all(updatePromises)
            .then(resolve(rfid.allProperties()))
            .catch(reject);
    });
};

exports.destroyRfid = function(req) {

};