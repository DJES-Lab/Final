/**
 * Created by derek on 2015/5/29.
 */
var Promise = require('bluebird'),
    glob = require('glob');

var picturesPath = '/../../public/pictures/';
var pictureFileGlobPattern = '*.jpg';

// Querying all pictures files in pictures storing directory
var queryPictures = function(picturesPath) {
    return new Promise(function (resolve, reject) {
        glob(picturesPath, function(err, files) {
            if (err) {
                reject(err);
            }

            var allPictureFiles = files.map(function(filePath) {
                return filePath.replace(/(.*public\/)(.*)/, '$2');
            });

            resolve(allPictureFiles);
        });
    });
};

// Splitting all pictures into 2 sets: single pictures, series pictures
var splitPictures = function(allFiles) {
    var seriesPicturesRegex = /\d+_\d+\.*/;

    var singlePictures = [];
    var seriesPictures = [];

    allFiles.forEach(function(filePath) {
        if (filePath.replace(/(.*pictures\/)(.*)/, '$2').match(seriesPicturesRegex)) {
            seriesPictures.push(filePath);
        } else {
            singlePictures.push(filePath);
        }
    });

    return [singlePictures, seriesPictures];
};

// Clustering all series pictures into their own group
var clusterPictures = function(seriesPicturesFilePath) {
    var clusterRegex = /(\d+)_(\d+)\.*/;

    var clusterMap = {};

    seriesPicturesFilePath.forEach(function(seriesPictureFilePath) {
        var seriesPictureFilename = seriesPictureFilePath.replace(/(.*pictures\/)(.*)/, '$2');
        var matched = seriesPictureFilename.match(clusterRegex);
        var cluster = matched[1];
        var pictureNum = matched[2];
        if (!clusterMap[cluster]) {
            clusterMap[cluster] = [];
        }
        clusterMap[cluster][pictureNum - 1] = seriesPictureFilePath;
    });

    var clusters = Object.keys(clusterMap).sort(function(cluster) { return Number(cluster); }).reverse();
    return clusters.map(function(cluster) { return clusterMap[cluster]; });
};

// Get both pictures and series pictures (picture series)
exports.getAllPictures = function() {
    return new Promise(function(resolve, reject) {
        queryPictures(__dirname + picturesPath + pictureFileGlobPattern)
            .then(splitPictures)
            .spread(function(singlePictures, seriesPictures) {
                var clusteredPictures = clusterPictures(seriesPictures);
                var allPictures = {
                    single: singlePictures,
                    series: clusteredPictures
                };
                resolve(allPictures);
            })
            .catch(reject);
    });
};

// Get only series pictures
exports.getSeriesPictures = function() {
    return new Promise(function(resolve, reject) {
        queryPictures(__dirname + picturesPath + pictureFileGlobPattern)
            .then(splitPictures)
            .spread(function(singlePictures, seriesPictures) {
                var clusteredPictures = clusterPictures(seriesPictures);
                resolve(clusteredPictures);
            })
            .catch(reject);
    });
};

// Get only not series pictures
exports.getSinglePictures = function() {
    return new Promise(function(resolve, reject) {
        queryPictures(__dirname + picturesPath + pictureFileGlobPattern)
            .then(splitPictures)
            .spread(function(singlePictures, seriesPictures) {
                resolve(singlePictures);
            })
            .catch(reject);
    });
};