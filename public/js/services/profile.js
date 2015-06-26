/**
 * Created by derek on 2015/6/27.
 */
'use strict';

angular.module('app')
    .factory('Profile', function RfidCard($http, $q) {
        return {
            getProfiles: function() {
                return new $q(function(resolve, reject) {
                    $http.get('api/profiles')
                        .then(function(res) {
                            resolve(res.data);
                        })
                        .catch(function(err) {
                            reject(err.data)
                        });
                });
            },

            newProfile: function() {
                return new $q(function(resolve, reject) {
                    $http.get('api/profile')
                        .then(function(res) {
                            resolve(res.data);
                        })
                        .catch(function(err) {
                            reject(err.data);
                        })
                });
            },

            updateActiveProfile: function(newActiveProfile) {
                return new $q(function(resolve, reject) {
                    $http.put('api/profile/active', {
                        activeProfile: newActiveProfile
                    })
                        .then(function(res) {
                            resolve(res.data);
                        })
                        .catch(function(err) {
                            reject(err.data);
                        });
                });
            }
        };
    });