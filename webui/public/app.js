angular.module('webui.services', ['ngResource']);
angular.module('webui.controllers', ['webui.services']);

var Module = angular.module('webui', ['webui.controllers', 'ngCookies', 'ngMessages', 'ngRoute']);

// Add the Auth header to each request if it exists
Module.factory('httpRequestInterceptor', function($rootScope) {
    return {
        request: function(config) {
            if ($rootScope.apiToken) {
                config.headers['Authorization'] = "Bearer " + $rootScope.apiToken;
            }
            return config;
        }
    };
});

Module
    .config(function($locationProvider, $routeProvider, $httpProvider) {
        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('httpRequestInterceptor');
    });