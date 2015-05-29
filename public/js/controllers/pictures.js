/**
 * Created by derek on 2015/5/17.
 */

angular.module('app')
    .controller('picturesController', function ($scope, $http) {
        $scope.slideInterval = 5000;

        $scope.allPictures = {
            single: [],
            series: []
        };

        $scope.activePictureSeries = 0;

        $scope.nextPictureSeries = function() {
            if($scope.activePictureSeries < $scope.allPictures.series.length - 1) {
                $scope.activePictureSeries++;
            } else {
                $scope.activePictureSeries = 0;
            }
        };

        $scope.prevPictureSeries = function() {
            if($scope.activePictureSeries > 0) {
                $scope.activePictureSeries--;
            } else {
                $scope.activePictureSeries = $scope.allPictures.series.length - 1;
            }
        };

        $http.get('api/tessel/pictures/')
            .success(function (data, status, headers, config) {
                $scope.allPictures = data;
            });
    });
