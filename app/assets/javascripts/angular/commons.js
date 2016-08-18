'use strict';

angular.module('mentorhub.commons', [])

    .service('SectionInteractionServices', ["$rootScope", 'BoardServices', function ($rootScope, BoardServices) {
        var _scope = this;

        _scope.updatable_interactions = {};

        _scope.update_todo = function (route_params, payload, todo) {
            BoardServices.update_todo(route_params, payload)
                .success(function (response) {
                    todo.state = payload.todo.state;
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        _scope.updateSectionInteractionState = function (sectionInteraction, newState) {
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

        _scope.add_task = function (sectionInteraction, todo) {
            var route_params = {
                '{track_id}': sectionInteraction.track_id,
                '{section_id}': sectionInteraction.id
            };

            BoardServices.create_todo(route_params, todo)
                .success(function (response) {
                    sectionInteraction.todos.push(response['todo']);
                    todo.content = undefined;
                    _scope.updateSectionInteractionState(sectionInteraction, "tasks_pending");
                })
                .error(function (error) {
                    console.log(error)
                })
        };

        _scope.update_mentees_todo = function (sectionInteraction, todo, rejected) {
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
                    '{track_id}': sectionInteraction.track_id,
                    '{section_id}': sectionInteraction.id,
                    '{todo_id}': todo.id
                };

                _scope.update_todo(route_params, {todo: {state: new_state}}, todo);
            }
        };

        _scope.update_task = function (sectionInteraction, todo) {
            var route_params = {
                '{track_id}': sectionInteraction.track_id,
                '{section_id}': sectionInteraction.id,
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

        _scope.delete_task = function (sectionInteraction, todo) {
            var route_params = {
                '{track_id}': sectionInteraction.track_id,
                '{section_id}': sectionInteraction.id,
                '{todo_id}': todo.id
            };

            BoardServices.delete_todo(route_params, {todo: todo.id})
                .success(function (response) {
                    var index = sectionInteraction.todos.indexOf(todo);
                    sectionInteraction.todos.splice(index, 1);

                    if (sectionInteraction.todos.length > 0) {
                        sectionInteraction.state = "tasks_pending";
                    } else {
                        sectionInteraction.state = "review_pending";
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        };


        _scope.subscribeToTrack = function (track, name) {
            App.trackChannel = App.cable.subscriptions.create(
                {
                    channel: 'TrackChannel',
                    track_id: track.id
                },
                {
                    received: function (data) {
                        var updated_track = JSON.parse(data);
                        var updatable_interactions = _scope.updatable_interactions;
                        var track_index = updatable_interactions.all_tracks.map(function (e) {
                            return e.id
                        }).indexOf(updated_track.id);

                        for (var k in updated_track) {
                            updatable_interactions.all_tracks[track_index][k] = updated_track[k];
                        }

                        updated_track.section_interactions.forEach(function (updated_section) {

                            var section_index = updatable_interactions.all_sections.map(function (e) {
                                return e.id
                            }).indexOf(updated_section.id);

                            if (section_index == -1) {
                                updatable_interactions.all_sections.push(updated_section);
                            } else {
                                for (var k in updated_section) {
                                    updatable_interactions.all_sections[section_index][k] = updated_section[k];
                                }
                            }
                        });

                        $rootScope.$broadcast(name);
                    }
                }
            );
        };
    }]);
