/**
 * Created by derek on 2015/6/22.
 */

angular.module('app')
    .controller('rfidPicturesController', function ($scope, $http, $q, growl) {
        var getPictures = function(permission) {
            return new $q(function(resolve, reject) {
                $http.get('api/tessel/rfid_pictures/' + permission)
                    .then(function(res) {
                        resolve(res.data);
                    })
                    .catch(function(err) {
                        reject(err.data);
                    })
            });
        };

        $scope.rfidPicturesModel = {
            'loadingPictures': false,
            'permissions': {
                'public': 0,
                'vip': 1,
                'private': 2
            },
            'public': [],
            'vip': [],
            'private': []
        };

        $scope.getRfidPictures = function(permissionType) {
            $scope.rfidPicturesModel.loadingPictures = true;
            getPictures($scope.rfidPicturesModel.permissions[permissionType])
                .then(function(pictureUrls) {
                    $scope.rfidPicturesModel.loadingPictures = false;
                    $scope.rfidPicturesModel[permissionType] = pictureUrls;
                    if (permissionType == 'vip') {
                        growl.success('Identity Confirmed!');
                    }
                })
                .catch(function(err) {
                    $scope.rfidPicturesModel.loadingPictures = false;
                    growl.error('Failed loading pictures of ' + permissionType + ' permission! Error: ' + err.message);
                })
        };

        $scope.getRfidPictures('private');
        $scope.getRfidPictures('public');
    });
