'use strict';

angular.module('mentorhub.mentees_tracks', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/mentees_tracks', {
            templateUrl: 'angular/templates/mentees_tracks.html',
            controller: 'MenteesTrackController'
        })
    }])

    .controller('MenteesTrackController', function () {
        
    });
