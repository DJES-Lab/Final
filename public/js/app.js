'use strict';

// Declare app level module which depends on filters, and services

angular.module('app', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'http-auth-interceptor',
  'mwl.bluebird',
  'ui.bootstrap',
  'ui.select',
  'bgf.paginateAnything',
  'angularFileUpload',
  'angular-growl',
  'nvd3ChartDirectives'
])
    .config(function ($routeProvider, $locationProvider, growlProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'mainController'
            })
            .when('/comments', {
                templateUrl: 'partials/comments.html',
                controller: 'commentsController'
            })
            .when('/tessel-graph', {
                templateUrl: 'partials/tessel-graph.html',
                controller: 'tesselGraphController'
            })
            .when('/pictures', {
                templateUrl: 'partials/pictures.html',
                controller: 'picturesController'
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'loginController'
            })
            .when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'signupController'
            })
            .when('/account', {
                templateUrl: 'partials/account.html',
                controller: 'accountController'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);

        growlProvider.globalTimeToLive(5000);
        growlProvider.globalPosition('bottom-left');
    })
    .run(function($rootScope, $location, Auth) {
        $rootScope.$watch('currentUser', function(currentUser) {
            if (!currentUser && (['/login', '/logout', '/signup'].indexOf($location.path()) == -1)) {
                Auth.currentUser();
            }

            $rootScope.$on('event:auth-loginRequired', function() {
                $location.path('/login');
                return false;
            })
        })
    });
