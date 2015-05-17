/**
 * Created by derek on 2015/5/17.
 */

angular.module('app')
    .controller('picturesController', function ($scope, $http) {
        $scope.pictureUrls = [];

        $http.get('api/tessel/pictures/')
            .success(function (data, status, headers, config) {
                $scope.pictureUrls = data;
            });
    });
