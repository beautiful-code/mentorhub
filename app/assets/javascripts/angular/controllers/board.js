'use strict';

angular.module('mentorhub.board', [])

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
            },
            'create_todo': function (section_interaction_id, payload) {
                return $http.post(ApiUrls.create_todo.replace('{section_id}', section_interaction_id), payload);
            }
        }
    })

    .directive('selectSubnav', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                $(element).on('click', function () {
                    $(element).parent().children().removeClass('active');
                    $(element).addClass('active');

                    var sections = {};
                    switch (attr.selectSubnav) {
                        case 'All':
                            sections = scope[scope.active_tab];
                            break;
                        default:
                            sections[attr.selectSubnav] = scope[scope.active_tab][attr.selectSubnav];
                            break;
                    }

                    scope.$apply(function () {
                        $parse('sections.data').assign(scope, sections);
                    });
                });
            }
        }
    })

    .controller('BoardController', function ($scope, BoardServices) {
        var init = function () {
            $scope.active_tab = '';

            BoardServices.boards()
                .success(function (response) {
                    $scope.user_mentee_exercises = response.mentoring_tracks;
                    $scope.user_exercises = response.learning_tracks;
                    
                    $scope.sections = { data: $scope.user_exercises };
                })
                .error(function (error) {
                    console.log(error);
                })
        };

        $scope.add_task = function (exercise, todo) {
            BoardServices.create_todo(exercise.id, todo)
                .success(function (response) {
                    exercise.todos.push(response['todo']);
                    todo.content = undefined;
                })
                .error(function (error) {
                    console.log(error)
                })
        };

        $scope.change_tab = function (tab) {
            $scope.active_tab = tab;
            $scope.sections.data = $scope[tab];

            var subnav_element = $(".user_tracks-subnav");
            subnav_element.children().removeClass('active');
            subnav_element.children().find("a:contains('All')").parent().addClass('active');
        };

        $scope.checkTodosStatus = function(mentee_id, track, exercise) {
            var track_id = $scope.user_mentee_exercises[mentee_id].learning_tracks.indexOf(track);
            var exercise_id = $scope.user_mentee_exercises[mentee_id].learning_tracks[track_id].section_interactions.indexOf(exercise);
            var todos = $scope.user_mentee_exercises[mentee_id].learning_tracks[track_id].section_interactions[exercise_id].todos;

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
