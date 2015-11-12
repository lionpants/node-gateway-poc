var Module = angular.module('webui.controllers');

Module.controller('IndexBodyCtrl', function($rootScope, $scope, Auth, Products) {
    $scope.messageHeader = "The Product List";
    $scope.products = [];
    $scope.newProduct = {};
    $scope.loginFields = {};
    $scope.isLoggedIn = $rootScope.apiToken ? true : false;

    $scope.register = function() {
        Auth.register($scope.loginFields.username, $scope.loginFields.password)
            .then(function(res) {
                $scope.loginFields = {};
                showResponse(false, 'Registered, login now.');
            })
            .catch(function(res) {
                showResponse(true, res.data);
            });
    }

    $scope.login = function() {
        Auth.login($scope.loginFields.username, $scope.loginFields.password)
            .then(function(res) {
                $scope.isLoggedIn = $rootScope.apiToken ? true : false;
                showResponse(false, '');
                $scope.loadProducts();
            })
            .catch(function(res) {
                showResponse(true, res.data);
            });
    }

    $scope.logout = function() {
        Auth.logout()
            .then(function(res) {
                $scope.isLoggedIn = $rootScope.apiToken ? true : false;
                $scope.loginFields = {};
            });
    }

    $scope.loadProducts = function() {
        if ($scope.isLoggedIn) {
            Products.getProducts()
                .then(function(res) {
                    $scope.products = res.data;
                });
        }
    }

    $scope.addProduct = function() {
        Products.createProduct($scope.newProduct)
            .then(function(res) {
                $scope.loadProducts();
            });
    }

    function showResponse(bad, message) {
        $scope.goodResponse = '';
        $scope.badResponse = '';

        if (bad) $scope.badResponse = message;
        else $scope.goodResponse = message;
    }

    $scope.loadProducts();
});