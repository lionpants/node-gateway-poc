var Module = angular.module('webui.controllers');

Module.controller('IndexBodyCtrl', function($scope, Product) {
    $scope.messageHeader = "The Product List";
    $scope.products = [];
    $scope.newProduct = new Product();

    $scope.loadProducts = function() {
        $scope.products = Product.query();
    }

    $scope.addProduct = function() {
        $scope.newProduct.$save(function(res) {
            $scope.loadProducts();
        });
    }
});