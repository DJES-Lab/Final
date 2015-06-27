/**
 * Created by derek on 2015/6/21.
 */
var Promise = require('bluebird'),
    glob = require('glob'),
    RfidUtil = require('./tessel/rfidUtil'),
    _ = require('lodash');

var picturesPath = '/../../public/rfid-pictures/';
var pictureFileGlobPattern = '*.{jpg,jpeg,png}';

// Querying all pictures files in pictures storing directory
var queryPictures = exports.queryPictures = function(picturesPath) {
    return new Promise(function (resolve, reject) {
        glob(picturesPath, function(err, files) {
            if (err) {
                reject({
                    type: 'INTERNAL',
                    message: 'Failed to glob pictures in path: ' + picturesPath
                });
            }

            var allPictureFiles = files.map(function(filePath) {
                return filePath.replace(/(.*public\/)(.*)/, '$2');
            });

            resolve(allPictureFiles);
        });
    });
};

// Clustering all rfid pictures into their own rfid group
var clusterPictures = function(rfidPicturesFilePath) {
    var clusterRegex = /(^[^_][a-f0-9]+)_(\d+)\.*/;

    var clusterMap = {};

    rfidPicturesFilePath.forEach(function(rfidPictureFilePath) {
        var rfidPictureFilename = rfidPictureFilePath.replace(/(.*pictures\/)(.*)/, '$2');
        var matched = rfidPictureFilename.match(clusterRegex);
        if (matched) {
            var cluster = matched[1];
            if (!clusterMap[cluster]) {
                clusterMap[cluster] = [];
            }
            clusterMap[cluster].push(rfidPictureFilePath);
        }
    });
    return clusterMap;
};

var updateRfidPictures = function(clusterMap) {
    return new Promise(function(resolve, reject) {
        var rfids = Object.keys(clusterMap);
        if (rfids.length) {
            Promise.map(rfids, function (rfid) {
                RfidUtil.getRfidByRfid(rfid)
                    .then(function (rfidObj) {
                        if (rfidObj) {
                            RfidUtil.updateRfidPictures(rfidObj, clusterMap[rfid])
                        }
                    })
            }, {
                concurrency: 1
            })
                .then(resolve(clusterMap))
                .catch(reject);
        } else {
            RfidUtil.getAllRfidRfids()
                .then(function(rfidIds) {
                    Promise.map(rfidIds, function(rfidId) {
                        RfidUtil.getRfidById(rfidId)
                            .then(function(rfidObj) {
                                if (rfidObj) {
                                    RfidUtil.updateRfidPictures(rfidObj, []);
                                }
                            })
                    }, {
                        concurrency: 1
                    })
                })
                .then(resolve(clusterMap))
                .catch(reject);
        }

    });
};


exports.getPictures = function(req) {
    /**
     * 1. Scan picture folder (rfids, picture urls)
     * 2. Update redis database for each rfid
     * 3. return picture urls of given user's/permission pictures
     *
     * Permissions:
     * 1. Public: get all pictures with public permissions (find rfid permission == 0)
     * 2. VIP Public: get all pictures with VIP permissions (find rfid permission ==1)
     * 3. Private: get all user owned pictures (find user's rfids then get all pictures of those rfids)
     */
    return new Promise(function(resolve, reject) {
        queryPictures(__dirname + picturesPath + pictureFileGlobPattern)
            .then(clusterPictures)
            .then(updateRfidPictures)
            .then(function() {
                if (req.permission == 2) {
                    return RfidUtil.getUserRfids(req);
                } else {
                    return RfidUtil.getPermissionRfids(Number(req.permission));
                }
            })
            .then(function(rfids) {
                var pictureUrls = [];
                if (rfids) {
                    rfids.forEach(function (rfid) {
                        pictureUrls = _.union(pictureUrls, rfid.pictures);
                    });
                }
                resolve(pictureUrls);
            })
            .catch(reject)
    });
};