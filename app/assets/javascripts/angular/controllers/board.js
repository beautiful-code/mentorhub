'use strict';

angular.module('mentorhub.board', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/board', {
            templateUrl: 'angular/templates/board.html',
            controller: 'BoardController'
        })
    }])

    .controller('BoardController', function () {
        
    });
