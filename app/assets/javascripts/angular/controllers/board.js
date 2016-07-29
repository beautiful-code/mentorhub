angular.module('mentorhub.board', [])

    .run(['$http', function ($http) {
        $http.defaults.headers.common['Accept'] = 'application/json';
        $http.defaults.headers.common['Content-Type'] = 'application/json';
    }])

    .factory('BoardServices', ['$http', 'ApiUrls', 'Utils', function ($http, ApiUrls, Utils) {
        return {
            update_section: function (route_params, payload) {
                return $http.put(
                    Utils.multi_replace(ApiUrls.update_section, route_params),
                    payload
                )
            },
            create_todo: function (route_params, payload) {
                return $http.post(
                    Utils.multi_replace(ApiUrls.create_todo, route_params),
                    payload
                );
            },
            update_todo: function (route_params, payload) {
                return $http.put(
                    Utils.multi_replace(ApiUrls.update_todo, route_params),
                    payload
                );
            },
            delete_todo: function (route_params, payload) {
                return $http.delete(
                    Utils.multi_replace(ApiUrls.update_todo, route_params),
                    payload
                )
            },
            board_data: function () {
                return $http.get(ApiUrls.board_data)
            }
        }
    }])

    .service('PubSubServices', function () {
        this.getAllSectionInteractions = function (data) {
            var all_sections = [];
            var all_tracks = [];

            for (var key in data.mentoring_tracks) {
                data.mentoring_tracks[key].learning_tracks.forEach(function (track) {
                    all_tracks.push(track);
                    all_sections = all_sections.concat(track.recent_incomplete_section_interactions);
                });
            }

            for (var key in data.learning_tracks) {
                var track = data.learning_tracks[key];
                all_tracks.push(track);
                all_sections = all_sections.concat(track.recent_incomplete_section_interactions);
            }

            return {
                all_sections: all_sections,
                all_tracks: all_tracks
            };
        };

        this.getInteractions = function (data) {
            var interactions = [];

            for (var key in data.mentoring_tracks) {
                data.mentoring_tracks[key].learning_tracks.forEach(function (track) {
                    interactions.push({menteeId: track.mentee_id, mentorId: track.mentor_id})
                });
            }

            for (var key in data.learning_tracks) {
                var track = data.learning_tracks[key];
                interactions.push({menteeId: track.mentee_id, mentorId: track.mentor_id})
            }

            return interactions;
        }
    })

    .directive('userTracks', function () {
        return {
            templateUrl: 'templates/user-tracks.html'
        }
    })

    .directive('userMenteeTracks', function () {
        return {
            templateUrl: 'templates/user-mentee-tracks.html'
        }
    })

    .directive('selectSubnav', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                $(element).on('click', function () {
                    $(element).parent().children().removeClass('active');
                    $(element).addClass('active');

                    var sections = {};
                    switch (scope.active_tab) {
                        case 'user_tracks':
                            sections[attr.selectSubnav] = scope[scope.active_tab][attr.selectSubnav];
                            break;

                        case 'user_mentee_tracks':
                            sections = [scope.combined_mentee_tracks[attr.selectSubnav]];
                            break;
                    }

                    scope.$apply(function () {
                        $parse('sections.data').assign(scope, sections);
                        $parse('subnav.active').assign(scope, attr.selectSubnav);
                    });
                });
            }
        }
    }])

    .controller('BoardController', ['$rootScope', '$scope', '$timeout', 'BoardServices', 'PubSubServices',
        function ($rootScope, $scope, $timeout, BoardServices, PubSubServices) {
            $scope.active_tab = 'user_tracks';
            $scope.subnav = {};
            $scope.sections = {data: {}};
            var updatable_interactions = {};

            var parse_mentee_tracks = function (data) {
                $scope.combined_mentee_tracks = [];
                angular.forEach(data, function (value, key) {
                    $scope.combined_mentee_tracks = $scope.combined_mentee_tracks.concat(value.learning_tracks);
                });

                return data;
            };

            var subscribeToInteraction = function (menteeId, mentorId) {
                App.trackInteraction = App.cable.subscriptions.create(
                    {
                        channel: 'InteractionChannel',
                        mentee_id: menteeId,
                        mentor_id: mentorId
                    },
                    {
                        received: function (data) {
                            data = JSON.parse(data);
                            var updated_section = data.section_interaction;
                            var updated_track = data.track;

                            var section_index = updatable_interactions.all_sections.map(function (e) {
                                return e.id
                            }).indexOf(updated_section.id);

                            var track_index = updatable_interactions.all_tracks.map(function (e) {
                                return e.id
                            }).indexOf(updated_track.id);

                            for (var k in updated_section) {
                                updatable_interactions.all_sections[section_index][k] = updated_section[k];
                            }

                            for (var k in updated_track) {
                                updatable_interactions.all_tracks[track_index][k] = updated_track[k];
                            }

                            $scope.$apply();
                        }
                    }
                );
            };

            var init = function () {
                if (typeof PageConfig !== "undefined" && typeof PageConfig.boardJson !== "undefined") {
                    $scope.user_mentee_tracks = parse_mentee_tracks(PageConfig.boardJson.mentoring_tracks);
                    $scope.user_tracks = PageConfig.boardJson.learning_tracks;

                    updatable_interactions = PubSubServices.getAllSectionInteractions(PageConfig.boardJson);

                    PubSubServices.getInteractions(PageConfig.boardJson).forEach(function (interaction) {
                        subscribeToInteraction(interaction.menteeId, interaction.mentorId);
                    });
                }

                if (Object.keys($scope.user_tracks).length != 0) {
                    $scope.subnav = {active: Object.keys($scope.user_tracks)[0]};
                    $scope.sections.data[$scope.subnav.active] = $scope[$scope.active_tab][$scope.subnav.active];
                }
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
                        updateSectionInteractionState(exercise, "tasks_pending");
                    })
                    .error(function (error) {
                        console.log(error)
                    })
            };

            $scope.change_tab = function (tab) {
                $scope.active_tab = tab;
                $scope.sections.data = undefined;

                switch (tab) {
                    case 'user_tracks':
                        if (Object.keys($scope[tab]).length != 0) {
                            $scope.subnav.active = Object.keys($scope[tab])[0];

                            $scope.sections.data = {};
                            $scope.sections.data[$scope.subnav.active] = $scope[tab][$scope.subnav.active];
                        }
                        break;

                    case 'user_mentee_tracks':
                        if ($scope.combined_mentee_tracks.length != 0) {
                            $scope.sections.data = [$scope.combined_mentee_tracks[0]];
                        }
                        break;
                }

                var subnav_element = $(".user_tracks-subnav");
                subnav_element.children().removeClass('active');
                subnav_element.children(":first-child").addClass('active');
            };

            $scope.add_mentee_notes = function (exercise, note) {
                var route_params = {
                    '{track_id}': exercise.track_id,
                    '{section_id}': exercise.id
                };

                BoardServices.update_section(route_params, {section_interaction: {mentee_notes: note.mentee_notes}})
                    .success(function (response) {
                        exercise.mentee_notes = note.mentee_notes;
                        note.edit = false;
                        note.mentee_notes = null;
                        updateSectionInteractionState(exercise, "review_pending");
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            };

            var updateSectionInteractionState = function (sectionInteraction, newState) {
                BoardServices.update_section(
                    {
                        '{track_id}': sectionInteraction.track_id,
                        '{section_id}': sectionInteraction.id
                    },
                    {
                        section_interaction: {state: newState}
                    }
                ).success(function (response) {
                    sectionInteraction.state = newState;
                }).error(function (error) {
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
                    var new_state = todo.state == 'incomplete' ? 'to_be_reviewed' : 'incomplete';

                    var route_params = {
                        '{track_id}': section.track_id,
                        '{section_id}': section.id,
                        '{todo_id}': todo.id
                    };

                    update_todo(route_params, {todo: {state: new_state}}, todo);
                }
            };

            $scope.update_mentees_todo = function (section, todo, rejected) {
                var new_state;

                if (!rejected) {
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

                    update_todo(route_params, {todo: {state: new_state}}, todo);
                }
            };

            $scope.update_task = function (section, todo) {
                var route_params = {
                    '{track_id}': section.track_id,
                    '{section_id}': section.id,
                    '{todo_id}': todo.id
                };

                todo.state = "incomplete";
                BoardServices.update_todo(route_params, {todo: todo})
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

                BoardServices.delete_todo(route_params, {todo: todo.id})
                    .success(function (response) {
                        var index = section.todos.indexOf(todo);
                        section.todos.splice(index, 1);

                        if (section.todos.length > 0) {
                            section.state = "tasks_pending";
                        } else {
                            section.state = "review_pending";
                        }
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            };

            var todoStatusHelper = function (exercise) {
                var todos = exercise.todos;

                var counter = 0;
                for (var i = 0; i < todos.length; ++i) {
                    if (todos[i].state == 'completed') {
                        counter++;
                    }
                }

                return counter;
            };

            $scope.checkMenteeTodosStatus = function (exercise) {
                return todoStatusHelper(exercise) == exercise.todos.length;
            };

            $scope.checkMyTodosStatus = function (exercise) {
                $scope.status = {};
                var completed_tasks = todoStatusHelper(exercise);
                $scope.status.mytodo = "You have " + (exercise.todos.length - completed_tasks) + " task(s) left to do.";

                return true;
            };

            $scope.sectionStatus = function (id, track, exercise) {
                if (exercise.state != "new" && todoStatusHelper(exercise) == exercise.todos.length) {
                    updateSectionInteractionState(exercise, 'section_completed');
                }
            };

            init();
        }]);
