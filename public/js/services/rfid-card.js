/**
 * Created by derek on 2015/6/21.
 */
'use strict';

angular.module('app')
    .factory('RfidCard', function RfidCard($http, $q) {
        return {
            getCards: function() {
                return new $q(function(resolve, reject) {
                    $http.get('api/tessel/rfids')
                        .then(function(res) {
                            resolve(res.data);
                        })
                        .catch(function(err) {
                            reject(err.data)
                        });
                });
            },

            newCard: function() {
                return new $q(function(resolve, reject) {
                    $http.get('api/tessel/rfid')
                        .then(function(res) {
                            resolve(res.data);
                        })
                        .catch(function(err) {
                            reject(err.data);
                        })
                });
            },

            updatePermission: function(rfidId, newPermission) {
                return new $q(function(resolve, reject) {
                    $http.put('api/tessel/rfid/' + rfidId, {
                        permission: newPermission
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