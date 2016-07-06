'use strict';

angular.module('mentorhub.board', ['ngRoute', 'duScroll'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/board', {
            templateUrl: 'angular/templates/board.html',
            controller: 'BoardController'
        })
    }])

    .controller('BoardController', function ($scope) {
        var init = function () {
            $scope.active_tab = '';
        };

        init();
    });
