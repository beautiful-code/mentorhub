'use strict';

angular.module('mentorhub.tracks', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/tracks', {
            templateUrl: 'angular/templates/tracks.html',
            controller: 'TracksController'
        })
    }])

    .controller('TracksController', function () {
        
    });
