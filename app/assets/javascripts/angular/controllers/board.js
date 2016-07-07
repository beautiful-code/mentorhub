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
                    $scope.mentoring_tracks = response.mentoring_tracks;
                    $scope.learning_tracks = response.learning_tracks;
                })
                .error(function (error) {
                    console.log(error);
                })
        };

        $scope.checkTodosStatus = function(mentee_id, track, exercise) {
            var track_id = $scope.mentoring_tracks[mentee_id].learning_tracks.indexOf(track);
            var exercise_id = $scope.mentoring_tracks[mentee_id].learning_tracks[track_id].section_interactions.indexOf(exercise);
            var todos = $scope.mentoring_tracks[mentee_id].learning_tracks[track_id].section_interactions[exercise_id].todos;

            var counter = 0;
            for(var i = 0; i < todos.length; ++i) {
                if(todos[i] == 'complete') {
                    counter++;
                }
            }

            return counter == todos.length;
        };

        init();
    });
