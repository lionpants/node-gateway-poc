var Module = angular.module('webui.controllers');

Module.controller('IndexBodyCtrl', function($scope, Product) {
    $scope.messageHeader = "The Product List";
    $scope.products = [];

    $scope.loadProducts = function() {
        $scope.products = Product.query();
    }
});