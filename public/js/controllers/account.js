/**
 * Created by derek on 2015/4/13.
 */
angular.module('app')
    .controller('accountController', function ($rootScope, $scope, $timeout, Auth, RfidCard, $http, $q, $location, growl) {
        var setPermissionModels = function(cards) {
            cards.forEach(function(card) {
                card.permissionModel = card.permission;
            })
        };

        var getCards = function() {
            return RfidCard.getCards()
                .then(function(rfids) {
                    $scope.rfidCardsModel.cards = rfids;
                    setPermissionModels($scope.rfidCardsModel.cards);
                });
        };

        $scope.rfidCardsModel = {
            cards: [],
            waitingRfidCard: false,
            permissionChanged: false
        };

        $scope.changePasswordModel = {
            user: {
                oldPassword: "",
                newPassword: ""
            },
            errors: {}
        };
        $scope.deleteAccountModel = {
            user: {
                password: ""
            },
            errors: {}
        };

        $scope.changePassword = function(form) {
            Auth.changePassword($scope.changePasswordModel.user.oldPassword, $scope.changePasswordModel.user.newPassword, function(err) {
                $scope.changePasswordModel.errors = {};

                if (!err) {
                    $scope.changePasswordModel.user = {
                        oldPassword: "",
                        newPassword: ""
                    };
                    $scope.deleteAccountModel.user.password = "";
                    growl.success('Password changed successfully');
                    $location.path('/account');
                } else {
                    angular.forEach(err.changePasswordModel.errors, function(error, field) {
                        form[field].$setValidity('redis', false);
                        $scope.changePasswordModel.errors[field] = error.type;
                    })
                }
            })
        };

        $scope.deleteAccount = function(form) {
            Auth.removeUser(function(err) {
                $scope.deleteAccountModel.errors = {};
                if (!err) {
                    growl.success('Account deleted');
                    $location.path('/login');
                } else {
                    angular.forEach(err.deleteAccountModel.errors, function(error, field) {
                        form[field].$setValidity('redis', false);
                        $scope.deleteAccountModel.errors[field] = error.type;
                    })
                }
            });
        };

        //$scope.updatePermission = function(rfidId, newPermission, oldPermission) {
        //    if (newPermission != oldPermission) {
        //        RfidCard.updatePermission(rfidId, newPermission)
        //            .then(function(rfid) {
        //                growl.success('Permission updated successfully! Rfid: ' + rfid.rfid + ' New permission: ' + rfid.permission);
        //                getCards();
        //            })
        //            .catch(function(err) {
        //                growl.error('Failed updating permission: ' + oldPermission + '->' + newPermission + '! Error: ' + err.message);
        //            });
        //    }
        //};

        $scope.checkPermissionChanged = function() {
            $timeout(function() {
                if ($scope.rfidCardsModel.cards.length) {
                    $scope.rfidCardsModel.permissionChanged = _.some($scope.rfidCardsModel.cards.map(function(card) {
                        return card.permissionModel != card.permission;
                    }));
                }
            });
        };

        $scope.updatePermissions = function() {
            if ($scope.rfidCardsModel.cards.length) {
                var updatePromises = [];
                $scope.rfidCardsModel.cards.forEach(function(card) {
                    if (card.permissionModel != card.permission) {
                        updatePromises.push(RfidCard.updatePermission(card.id, card.permissionModel));
                    }
                });
                $q.all(updatePromises)
                    .then(function(rfids) {
                        rfids.forEach(function(rfid) {
                            growl.success('Permission updated successfully! Rfid: ' + rfid.rfid + ' New permission: ' + rfid.permission);
                        });
                        return getCards();
                    })
                    .then($scope.checkPermissionChanged)
                    .catch(function(err) {
                        growl.error('Failed updating permission! Error: ' + err.message);
                        $scope.checkPermissionChanged();
                    })
            }
        };

        $scope.addNewCard = function() {
            $scope.rfidCardsModel.waitingRfidCard = true;
            RfidCard.newCard()
                .then(function(rfid) {
                    $scope.rfidCardsModel.waitingRfidCard = false;
                    growl.success('New card added successfully! Rfid: ' + rfid.rfid);
                    getCards();
                })
                .catch(function(err) {
                    $scope.rfidCardsModel.waitingRfidCard = false;
                    growl.error('Failed adding new card! Error: ' + err.message);
                });
        };

        getCards();
    });