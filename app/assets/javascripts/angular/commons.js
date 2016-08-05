'use strict';

angular.module('mentorhub.commons', [])

    .service('SectionInteractionServices', ['BoardServices', function (BoardServices) {
        var _scope = this;

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

        _scope.add_task = function (section, todo) {
            var route_params = {
                '{track_id}': exercise.track_id,
                '{section_id}': exercise.id
            };

            BoardServices.create_todo(route_params, todo)
                .success(function (response) {
                    section.todos.push(response['todo']);
                    todo.content = undefined;
                    this.updateSectionInteractionState(section, "tasks_pending");
                })
                .error(function (error) {
                    console.log(error)
                })
        };

        _scope.update_mentees_todo = function (section, todo, rejected) {
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

                _scope.update_todo(route_params, {todo: {state: new_state}}, todo);
            }
        };

        _scope.update_task = function (section, todo) {
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

        _scope.delete_task = function (section, todo) {
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
    }]);
