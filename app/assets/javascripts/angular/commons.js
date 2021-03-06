'use strict';

angular.module('mentorhub.commons', [])

    .service('SectionInteractionServices', ["$rootScope", 'BoardServices', function ($rootScope, BoardServices) {
        var _scope = this;

        _scope.updatable_interactions = [];

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
                    sectionInteraction.todos.push(response.todo);
                    todo.content = undefined;
                    _scope.updateSectionInteractionState(sectionInteraction, "tasks_pending");
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        _scope.add_question = function (sectionInteraction, question) {
            var route_params = {
                '{track_id}': sectionInteraction.track_id,
                '{section_id}': sectionInteraction.id
            };

            BoardServices.create_question(route_params, {question: question})
                .success(function (response) {
                    sectionInteraction.questions.push(response.question);
                    question.question = undefined;
                    //_scope.updateSectionInteractionState(sectionInteraction, "tasks_pending");
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        _scope.update_mentees_todo = function (sectionInteraction, todo, rejected) {
            var new_state;
            new_state = (!rejected && todo.state == 'to_be_reviewed') ? 'completed' : 'incomplete';

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

        _scope.update_question = function (sectionInteraction, question) {
          var route_params = {
            '{track_id}': sectionInteraction.track_id,
            '{section_id}': sectionInteraction.id,
            '{question_id}': question.id
          };
          BoardServices.update_question(route_params, {question: question})
            .success(function (response) {
              question.edit = false;
            })
            .error(function (error) {
              console.log(error);
            });
        };

        _scope.delete_question = function (sectionInteraction, question) {
            var route_params = {
                '{track_id}': sectionInteraction.track_id,
                '{section_id}': sectionInteraction.id,
                '{question_id}': question.id
            };

            BoardServices.delete_question(route_params, {question: question.id})
                .success(function (response) {
                    var index = sectionInteraction.questions.indexOf(question);
                    sectionInteraction.questions.splice(index, 1);
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
                        var track_index = updatable_interactions.map(function (e) {
                            return e.id;
                        }).indexOf(updated_track.id);
                        angular.extend(updatable_interactions[track_index], updated_track);
                        $rootScope.$broadcast(name);
                    }
                }
            );
        };
    }]);
