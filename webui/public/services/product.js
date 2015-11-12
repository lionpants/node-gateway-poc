var Module = angular.module('webui.services');

Module.factory('Products', ['$http', function($http) {
    var s = {};

    s.getProducts = function() {
        return $http.get('http://localhost:1111/products');
    };

    s.createProduct = function(product) {
        return $http.post('http://localhost:1111/products', product);
    };

    return s;
}]);