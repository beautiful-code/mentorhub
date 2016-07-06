'use strict';

angular.module('mentorhub.board', ['ngRoute', 'duScroll'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/board', {
            templateUrl: 'angular/templates/board.html',
            controller: 'BoardController'
        })
    }])

    .factory('BoardServices', function ($http, ApiUrls) {
        return {
            'boards': function () {
                return $http.get(ApiUrls.boards);
            }
        }
    })

    .controller('BoardController', function ($scope, BoardServices) {
        var init = function () {
            $scope.active_tab = '';

            BoardServices.boards()
                .success(function (response) {
                    $scope.boards = response;
                })
                .error(function (error) {
                    console.log(error);
                })
        };

        init();
    });
