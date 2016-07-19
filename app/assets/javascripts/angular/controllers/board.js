angular.module('mentorhub.board', [])

    .factory('BoardServices', function ($http, ApiUrls, Utils) {
        return {
            'update_section': function (route_params, payload) {
                return $http.put(
                    Utils.multi_replace(ApiUrls.update_section, route_params),
                    payload
                )
            },
            'create_todo': function (route_params, payload) {
                return $http.post(
                    Utils.multi_replace(ApiUrls.create_todo, route_params),
                    payload
                );
            },
            'update_todo': function (route_params, payload) {
                return $http.put(
                    Utils.multi_replace(ApiUrls.update_todo, route_params),
                    payload
                );
            },
            'delete_todo': function (route_params, payload) {
                return $http.delete(
                    Utils.multi_replace(ApiUrls.update_todo, route_params),
                    payload
                )
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

    .controller('BoardController', function ($rootScope, $scope, BoardServices) {
        var init = function () {
            $scope.active_tab = '';

            $scope.user_mentee_exercises = PageConfig.boardJson.mentoring_tracks;
            $scope.user_exercises = PageConfig.boardJson.learning_tracks;

            $scope.sections = { data: $scope.user_exercises };
        };

        $scope.add_task = function (exercise, todo) {
            var route_params = {
                '{track_id}': exercise.track_id,
                '{section_id}': exercise.id
            };

            BoardServices.create_todo(route_params, todo)
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

        $scope.add_mentee_notes = function (exercise, note) {
            var route_params = {
                '{track_id}': exercise.track_id,
                '{section_id}': exercise.id
            };

            BoardServices.update_section(route_params, { section_interaction: { mentee_notes: note.mentee_notes } })
                .success(function (response) {
                    exercise.mentee_notes = note.mentee_notes;
                    note.edit = false;
                    note.mentee_notes = null;
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        var update_todo = function (route_params, payload, todo) {
            BoardServices.update_todo(route_params, payload)
                .success(function (response) {
                    todo.state = payload.todo.state;
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        $scope.update_my_todo = function (section, todo) {
            if (todo.state != 'completed') {
                var new_state = todo.state == 'incomplete'? 'to_be_reviewed': 'incomplete';

                var route_params = {
                    '{track_id}': section.track_id,
                    '{section_id}': section.id,
                    '{todo_id}': todo.id
                };

                update_todo(route_params, { todo: { state: new_state} }, todo);
            }
        };
        
        $scope.update_mentees_todo = function (section, todo, rejected) {
            var new_state;

            if(!rejected) {
                switch (todo.state) {
                    case 'to_be_reviewed':
                        new_state = 'completed';
                        break;
                    case 'completed':
                        new_state = 'incomplete';
                        break;
                    default:
                        new_state = 'incomplete';
                        break;
                }
            } else {
                new_state = 'incomplete';
            }

            if (todo.state != new_state) {
                var route_params = {
                    '{track_id}': section.track_id,
                    '{section_id}': section.id,
                    '{todo_id}': todo.id
                };

                update_todo(route_params, { todo: { state: new_state} }, todo);
            }
        };

        $scope.update_task = function (section, todo) {
            var route_params = {
                '{track_id}': section.track_id,
                '{section_id}': section.id,
                '{todo_id}': todo.id
            };

            todo.state = "incomplete";
            BoardServices.update_todo(route_params, { todo: todo})
                .success(function (response) {
                    todo.edit = false;
                    todo.state = 'incomplete';
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        $scope.delete_task = function (section, todo) {
            var route_params = {
                '{track_id}': section.track_id,
                '{section_id}': section.id,
                '{todo_id}': todo.id
            };

            BoardServices.delete_todo(route_params, { todo: todo.id})
                .success(function (response) {
                    var index = section.todos.indexOf(todo);
                    section.todos.splice(index, 1);
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        $scope.checkMenteeTodosStatus = function(id, track, exercise) {
            var track_id = $scope.user_mentee_exercises[id].learning_tracks.indexOf(track);
            var exercise_id = $scope.user_mentee_exercises[id].learning_tracks[track_id]
                .recent_incomplete_section_interactions.indexOf(exercise);
            var todos = $scope.user_mentee_exercises[id].learning_tracks[track_id]
                .recent_incomplete_section_interactions[exercise_id].todos;

            var counter = 0;
            for(var i = 0; i < todos.length; ++i) {
                if(todos[i].state == 'completed') {
                    counter++;
                }
            }

            return counter == todos.length;
        };

        init();
    });