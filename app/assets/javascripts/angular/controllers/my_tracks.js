'use strict';

angular.module('mentorhub.my_tracks', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/my_tracks', {
            templateUrl: 'angular/templates/my_tracks.html',
            controller: 'MyTracksController'
        })
    }])

    .controller('MyTracksController', function () {
        
    });
