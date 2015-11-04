angular.module('webui.services', ['ngResource']);
angular.module('webui.controllers', ['webui.services']);

var Module = angular.module('webui', ['webui.controllers', 'ngCookies', 'ngMessages', 'ngRoute']);

Module.config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);


});