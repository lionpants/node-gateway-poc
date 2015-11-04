var Module = angular.module('webui.services');

Module.factory('Product', ['$resource', function($resource) {
    return $resource('http://localhost:1111/products');
}]);