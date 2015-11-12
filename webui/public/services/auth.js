var Module = angular.module('webui.services');

Module.factory('Auth', ['$http', '$rootScope', function($http, $rootScope) {
    var s = {};

    s.register = function(uname, pword) {
        return $http.post('http://localhost:1111/register', {
            username: uname,
            password: pword
        });
    };

    s.login = function(uname, pword) {
        return $http.post('http://localhost:1111/login', {
                username: uname,
                password: pword
            })
            .then(function(res) {
                $rootScope.apiToken = res.data;
            });
    };

    s.logout = function() {
        return $http.post('http://localhost:1111/logout', {
                token: $rootScope.apiToken
            })
            .then(function(res) {
                $rootScope.apiToken = null;
            });
    };

    return s;
}]);