/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('app')
    .controller('navbarController', ["$scope", "Auth", "$location", function($scope, Auth, $location) {
        $scope.menu = [];

        $scope.authMenu = [{
            "title": "Comments",
            "link": "comments/"
        }, {
            "title": "Tessel Graph",
            "link": "tessel-graph/"
        }, {
            "title": "Pictures",
            "link": "pictures/"
        }];

        $scope.logout = function() {
            Auth.logout(function(err) {
                if (!err) {
                    $location.path('/login');
                }
            });
        };
    }]);