/**
 * Created by derek on 2015/6/25.
 */

var config = require('../config/config'),
    ErrorUtil = require('./errorUtil'),
    RfidPictureUtil = require('./rfidPictureUtil'),
    Promise = require('bluebird'),
    request = require('request-promise'),
    _ = require('lodash');

var picturesPath = '/../../public/rfid-pictures/';
var pictureFileGlobPattern = '*.{jpg,jpeg,png}';

var requestProfiles = function(user) {
    var tesselCameraUrl = 'http://' + config.tesselCamera.host + ':' + config.tesselCamera.port;
    var requestOptions = {
        uri: tesselCameraUrl,
        timeout: config.tesselCamera.timeout,
        json: {
                username: user.allProperties().username
        }
    };
    return request.post(requestOptions);
};

var updateActiveProfile = function(user, newActiveProfile) {
    return new Promise(function(resolve, reject) {
        user.store({
            activeProfile: newActiveProfile
        }, function(err) {
            if (err) {
                reject({
                    type: 'INTERNAL',
                    message: 'Failed to update user active profile to' + newActiveProfile + ' for ' + user.allProperties().username
                });
            } else {
                resolve(user.allProperties().activeProfile);
            }
        });
    });
};

var updateProfiles = function(user, newProfiles) {
    return new Promise(function(resolve, reject) {
        user.store({
            profiles: newProfiles
        }, function(err) {
            if (err) {
                reject({
                    type: 'INTERNAL',
                    message: 'Failed to update ' + newProfiles.length + 'profiles for ' + user.allProperties().username
                });
            } else {
                resolve(user.allProperties().profiles);
            }
        });
    });
};

var updateProfilesAndActiveProfile = exports.updateProfilesAndActiveProfile = function(req) {
    return new Promise(function(resolve, reject) {
        var user = req.user;
        if (!user) {
            reject({
                type: 'USER_NOT_EXIST',
                message: 'User does not exist'
            });
        } else {
            var userProperties = user.allProperties();
            RfidPictureUtil.queryPictures(__dirname + picturesPath + pictureFileGlobPattern)
                .then(function(picturesPath) {
                    return getUserPictures(userProperties.username, picturesPath);
                })
                .then(function(userPictures) {
                    var updatePromises = [];
                    updatePromises.push(updateProfiles(user, userPictures));
                    if (userPictures.length) {
                        if (userProperties.activeProfile == '') {
                            updatePromises.push(updateActiveProfile(user, userPictures[0]));
                        }
                    } else {
                        if (userProperties.activeProfile != '') {
                            updatePromises.push(updateActiveProfile(user, ''));
                        }
                    }

                    return Promise.all(updatePromises)
                        .then(function(results) {
                            var activeProfile = userProperties.activeProfile;
                            if (results.length == 2) {
                                activeProfile = results[1];
                            }
                            return {
                                profiles: results[0],
                                activeProfile: activeProfile
                            };
                        });
                })
                .then(resolve)
                .catch(reject);
        }
    });
};

var getUserPictures = function(username, profilePicturesFilePath) {
    var profileRegex = /_([^_]+)_(\d+)\.*/;
    var userPictures = [];

    profilePicturesFilePath.forEach(function(profilePictureFilePath) {
        var profilePictureFilename = profilePictureFilePath.replace(/(.*pictures\/)(.*)/, '$2');
        var matched = profilePictureFilename.match(profileRegex);
        if (matched && matched[1] == username) {
            userPictures.push(profilePictureFilePath);
        }
    });
    return userPictures;
};

exports.newProfile = function(req) {
    return new Promise(function(resolve, reject) {
        var user = req.user;
        if (!user) {
            reject({
                type: 'USER_NOT_EXIST',
                message: 'User does not exist'
            });
        } else {
            requestProfiles(user)
                .then(function(newProfileNames) {
                    if (newProfileNames && newProfileNames.length) {
                        return Promise.delay(5000)
                            .then(function() {
                                return updateProfilesAndActiveProfile(req)
                            })
                            .then(function(profileObj) {
                                profileObj.newProfileNum = newProfileNames.length;
                                return profileObj;
                            })
                    } else {
                        throw {
                            type: 'TESSEL',
                            message: 'Receive no uploaded profiles from tessel camera'
                        };
                    }
                })
                .then(resolve)
                .catch(function(err) {
                    reject(ErrorUtil.errorHandler(err, 'newProfile'));
                });
        }
    });
};

exports.updateActive = function(req) {
    return new Promise(function(resolve, reject) {
        var user = req.user;
        if (!user) {
            reject({
                type: 'USER_NOT_EXIST',
                message: 'User does not exist'
            });
        } else {
            if (req.body.activeProfile) {
                updateActiveProfile(user, req.body.activeProfile)
                    .then(resolve)
                    .catch(reject)
            } else {
                reject({
                    type: 'UPDATE_VALUE_NOT_PROVIDED',
                    message: 'The new active profile is not provided'
                })
            }
        }
    });
};