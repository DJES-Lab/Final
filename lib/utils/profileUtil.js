/**
 * Created by derek on 2015/6/25.
 */

var config = require('../config/config'),
    ErrorUtil = require('./errorUtil'),
    Promise = require('bluebird'),
    request = require('request-promise'),
    _ = require('lodash');

var picturesPath = '/../public/rfid-pictures/';

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
                resolve(newActiveProfile);
            }
        });
    });
};

var updateProfiles = function(user, newProfiles) {
    return new Promise(function(resolve, reject) {
        user.store({
            profile: newProfiles
        }, function(err) {
            if (err) {
                reject({
                    type: 'INTERNAL',
                    message: 'Failed to update ' + newProfiles.length + 'profiles for ' + user.allProperties().username
                });
            } else {
                resolve(newProfiles);
            }
        });
    });
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
                .then(function(newProfileNamesString) {
                    var newProfileNames = JSON.parse(newProfileNamesString);
                    console.log(newProfileNames);
                    var userProperties = user.allProperties();
                    if (newProfileNames.length) {
                        var oldProfiles = userProperties.profiles;
                        var oldActiveProfile = userProperties.activeProfile;
                        var newProfiles = newProfileNames.map(function(newProfileName) {
                            return __dirname + picturesPath + newProfileName;
                        });
                        var unionProfiles = _.union(oldProfiles, newProfiles);
                        var activeProfile = oldActiveProfile;

                        var updatePromises = [];
                        if (oldActiveProfile == '') {
                            updatePromises.push(updateActiveProfile(user, newProfiles[0]));
                            activeProfile = newProfiles[0];
                        }
                        updatePromises.push(updateProfiles(user, unionProfiles));

                        Promise.all(updatePromises)
                            .then(resolve({
                                    activeProfile: activeProfile,
                                    profiles: unionProfiles
                                }
                            ))
                            .catch(reject)
                    } else {
                        resolve({
                            activeProfile: userProperties.activeProfile,
                            profiles: userProperties.profiles
                        });
                    }
                })
                .catch(function(err) {
                    reject(ErrorUtil.errorHandler(err));
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
            updateActiveProfile(user, req.body.activeProfile)
                .then(resolve)
                .catch(reject)
        }
    });
};