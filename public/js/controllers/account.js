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

        var updateProfileGroup = function(profiles) {
            if (profiles && profiles.length) {
                var newGroup = [];
                for (var i = 0; i < $scope.profileModel.maxGroupMembers; i++) {
                    var selectedMemberIndex = $scope.profileModel.activeProfileGroupIndex * $scope.profileModel.maxGroupMembers + i;
                    if (selectedMemberIndex < profiles.length)
                        newGroup.push(profiles[selectedMemberIndex]);
                }
                $scope.profileModel.maxActiveProfileGroupIndex = Math.ceil(profiles.length / $scope.profileModel.maxGroupMembers) - 1;
                $scope.profileModel.activeProfileGroup = newGroup;
            }
        };

        $scope.profileModel = {
            activeProfileGroupIndex: 0,
            minActiveProfileGroupIndex: 0,
            maxActiveProfileGroupIndex: 0,
            maxGroupMembers: 9,
            activeProfileGroup: [],
            waitingNewProfiles: false
        };

        $scope.rfidCardsModel = {
            cards: [],
            waitingRfidCard: false,
            waitingPermissionUpdate: false,
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
                $scope.rfidCardsModel.waitingPermissionUpdate = true;
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
                        $scope.rfidCardsModel.waitingPermissionUpdate = false;
                        return getCards();
                    })
                    .then($scope.checkPermissionChanged)
                    .catch(function(err) {
                        $scope.rfidCardsModel.waitingPermissionUpdate = false;
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


        $scope.uploadNewProfiles = function() {
            $scope.profileModel.waitingNewProfiles = true;
            $http.get('api/profile')
                .then(function(res) {
                    var profileObj = res.data;
                    $rootScope.currentUser.profiles = profileObj.profiles;
                    $rootScope.currentUser.activeProfile = profileObj.activeProfile;
                    $scope.profileModel.waitingNewProfiles = false;
                    growl.success('Profile uploaded successfully! ' + profileObj.newProfileNum + ' profiles added');
                })
                .catch(function(err) {
                    $scope.profileModel.waitingNewProfiles = false;
                    growl.error('Failed uploading new profiles from Tessel Camera! Error: ' + err.data.message);
                })
        };

        $scope.setActiveProfile = function(newActiveProfile) {
            if (newActiveProfile != $rootScope.currentUser.activeProfile) {
                $http.put('api/profile/active', {
                    activeProfile: newActiveProfile
                })
                    .then(function(res) {
                        $rootScope.currentUser.activeProfile = res.data;
                        growl.success('Your main profile picture has changed. Update successfully');
                    })
                    .catch(function(err) {
                        growl.error('Failed updating your main profile picture! Error: ' + err.data.message);
                    })
            }
        };

        $scope.prevGroup = function() {
            if ($scope.profileModel.activeProfileGroupIndex -1 >= 0)
                $scope.profileModel.activeProfileGroupIndex--;
        };

        $scope.nextGroup = function() {
            if ($scope.profileModel.activeProfileGroupIndex + 1 <= $scope.profileModel.maxActiveProfileGroupIndex)
                $scope.profileModel.activeProfileGroupIndex++;
        };

        $scope.$watch(function() {
            if ($rootScope.currentUser) {
                return $rootScope.currentUser.profiles;
            }
            else {
                return null;
            }
        }, function(newValue, oldValue) {
            if (newValue && newValue.length) {
                updateProfileGroup(newValue);
            } else {
                if (oldValue) {
                    $scope.profileModel.activeProfileGroup = [];
                    $scope.profileModel.maxActiveProfileGroupIndex = 0;
                    $scope.profileModel.activeProfileGroupIndex = 0;
                    $scope.profileModel.maxActiveProfileGroupIndex = 0;
                }
            }
        });

        $scope.$watch(function() {
            return $scope.profileModel.activeProfileGroupIndex;
        }, function(newValue, oldValue) {
            if (newValue != oldValue) {
                if ($rootScope.currentUser)
                    updateProfileGroup($rootScope.currentUser.profiles);
            }
        });

        getCards();
    });