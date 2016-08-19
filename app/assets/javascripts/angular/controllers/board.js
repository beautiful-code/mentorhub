angular.module('mentorhub.board', [])

    .run(['$http', function ($http) {
        $http.defaults.headers.common['Accept'] = 'application/json';
        $http.defaults.headers.common['Content-Type'] = 'application/json';
    }])

    .factory('BoardServices', ['$http', 'ApiUrls', 'Utils', function ($http, ApiUrls, Utils) {
        return {
            update_section: function (route_params, payload) {
                return $http.put(
                    Utils.multi_replace(ApiUrls.update_section_interaction, route_params),
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
                    all_sections = all_sections.concat(track.section_interactions);
                });
            }

            for (var key in data.learning_tracks) {
                var track = data.learning_tracks[key];
                all_tracks.push(track);
                all_sections = all_sections.concat(track.section_interactions);
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

    .controller('BoardController', ['$rootScope', '$scope', '$timeout', 'BoardServices', 'PubSubServices', 'SectionInteractionServices',
        function ($rootScope, $scope, $timeout, BoardServices, PubSubServices, SectionInteractionServices) {
            $scope.active_tab = 'user_tracks';
            $scope.subnav = {};
            $scope.sections = {data: {}};
            $scope.sectionInteractionServices = SectionInteractionServices;

            var updatable_interactions = {};

            var parse_mentee_tracks = function (data) {
                $scope.combined_mentee_tracks = [];
                angular.forEach(data, function (value, key) {
                    $scope.combined_mentee_tracks = $scope.combined_mentee_tracks.concat(value.learning_tracks);
                });

                return data;
            };

            $scope.$on('BoardController', function (event, data) {
                $scope.$apply(function () {
                    if (angular.isArray($scope.sections.data)) {
                        var section_index = $scope.sections.data[0].section_interactions.map(function (e) {
                            return e.id
                        }).indexOf($scope.sectionInteraction.id);
                        $scope.sectionInteraction = $scope.sections.data[0].section_interactions[section_index]
                    }
                    else{
                        var section_index = $scope.sections.data[Object.keys($scope.sections.data)].section_interactions.map(function (e) {
                            return e.id
                        }).indexOf($scope.sectionInteraction.id);
                        $scope.sectionInteraction = $scope.sections.data[Object.keys($scope.sections.data)].section_interactions[section_index]
                    }
                });
            })

            var init = function () {
                if (typeof PageConfig !== "undefined" && typeof PageConfig.boardJson !== "undefined") {
                    $scope.user_mentee_tracks = parse_mentee_tracks(PageConfig.boardJson.mentoring_tracks);
                    $scope.user_tracks = PageConfig.boardJson.learning_tracks;
                    SectionInteractionServices.updatable_interactions = PubSubServices.getAllSectionInteractions(PageConfig.boardJson);
                    SectionInteractionServices.updatable_interactions.all_tracks.forEach(function (track) {
                        SectionInteractionServices.subscribeToTrack(track, 'BoardController');
                    });
                }

                if (Object.keys($scope.user_tracks).length != 0) {
                    $scope.subnav = {active: Object.keys($scope.user_tracks)[0]};
                    $scope.sections.data[$scope.subnav.active] = $scope[$scope.active_tab][$scope.subnav.active];
                }
                $scope.reloadSectionInteractions();
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
                $scope.reloadSectionInteractions();
                var subnav_element = $(".user_tracks-subnav");
                subnav_element.children().removeClass('active');
                subnav_element.children(":first-child").addClass('active');
            };

            $scope.add_mentee_notes = function (sectionInteraction, note) {
                var route_params = {
                    '{track_id}': sectionInteraction.track_id,
                    '{section_id}': sectionInteraction.id
                };

                BoardServices.update_section(route_params, {section_interaction: {mentee_notes: note.mentee_notes}})
                    .success(function (response) {
                        angular.merge(sectionInteraction, response.section_interaction);
                        note.edit = false;
                        note.mentee_notes = null;
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

                    SectionInteractionServices.update_todo(route_params, {todo: {state: new_state}}, todo);
                }
            };

            var todoStatusHelper = function (sectionInteraction) {
                var todos = sectionInteraction.todos;

                var counter = {
                    incomplete: 0,
                    completed: 0,
                    to_review: 0
                };

                for (var i = 0; i < todos.length; ++i) {
                    switch (todos[i].state) {
                        case 'completed':
                            counter.completed++;
                            break;
                        case 'to_be_reviewed':
                            counter.to_review++;
                            break;
                        default:
                            counter.incomplete++;
                            break;
                    }
                }

                return counter;
            };

            $scope.checkMenteeTodosStatus = function (sectionInteraction) {
                if (sectionInteraction !== undefined) {
                    return todoStatusHelper(sectionInteraction).completed == sectionInteraction.todos.length;
                }
            };

            $scope.checkMyTodosStatus = function (sectionInteraction) {
                if (sectionInteraction !== undefined) {
                    $scope.status = {};
                    var status = todoStatusHelper(sectionInteraction);

                    switch (status.incomplete) {
                        case 0:
                            if (!status.to_review) {
                                $scope.status.mytodo = "You have completed all the tasks.";
                            } else {
                                $scope.status.mytodo = "There " +
                                    (status.to_review > 1 ? 'are ' + status.to_review + ' tasks' : 'is ' + status.to_review + ' task') +
                                    " pending to be reviewed by your mentor";
                            }
                            break;
                        default:
                            $scope.status.mytodo = "You have " +
                                (status.incomplete > 1 ? status.incomplete + ' tasks' : status.incomplete + ' task') +
                                " left to do.";
                            break;
                    }

                    return true;
                }
            };

            $scope.sectionStatus = function (id, track, sectionInteraction) {
                if (sectionInteraction.state != "new" && todoStatusHelper(sectionInteraction).completed == sectionInteraction.todos.length) {
                    SectionInteractionServices.updateSectionInteractionState(sectionInteraction, 'section_completed');
                }
            };

            $scope.changeSectionInteraction = function(sectionInteraction){
                if($scope.sectionInteraction){
                    $scope.sectionInteraction.selected = false;
                }
                $scope.sectionInteraction = sectionInteraction;
                $scope.selected = sectionInteraction.id;
            }

            $scope.reloadSectionInteractions = function(){
                $timeout(function() {
                    var el = document.getElementById('sec0');
                    angular.element(el).triggerHandler('click');
                }, 0);
            }

            $scope.actionTodoForMyTracks = function(){
              var myLearningTracks = [];

              for(var key in $scope.user_tracks) {
                myLearningTracks.push($scope.user_tracks[key]);
              }

              return actionsTodoPresent(
                myLearningTracks,
                'trackActionTodoForMentee'
              );
            };

            $scope.actionTodoForMyMenteeTracks = function(){
              var myMenteesTracks = [];

              for (var key in $scope.user_mentee_tracks) {
                $scope.user_mentee_tracks[key].learning_tracks.forEach(function(track) {
                  myMenteesTracks.push(track);
                });
              }

              return actionsTodoPresent(
                myMenteesTracks,
                'trackActionTodoForMentor'
              );
            };

            var actionsTodoPresent = function(array, statusFunc) {
              var ret = [];

              array.forEach(function(element) {
                ret.push($scope[statusFunc](element));
              });

              return (ret.indexOf(true) != -1);
            }

            /* Does mentor has to act on anything for a track */
            $scope.trackActionTodoForMentor = function(track) {
              return actionsTodoPresent(
                track.section_interactions,
                'sectionInteractionActionTodoForMentor'
              );
            };

            /* Does mentee has to act on anything for a track */
            $scope.trackActionTodoForMentee = function(track) {
              return actionsTodoPresent(
                track.section_interactions,
                'sectionInteractionActionTodoForMentee'
              );
            }

            /* Does mentor has to act on anything for a sectionInteraction */
            $scope.sectionInteractionActionTodoForMentor = function(sectionInteraction) {
              var ret = false;

              if (sectionInteraction.state == 'section_completed' || sectionInteraction.state == 'new' ) {
                return ret;
              }

              var todosStatus = todoStatusHelper(sectionInteraction);

              if (todosStatus.to_review > 0 || todosStatus.completed == sectionInteraction.todos.length) {
                ret = true;
              } else if (sectionInteraction.state == 'review_pending') {
                ret = true;
              }

              return ret;
            }

            /* Does mentee has to act on anything for a sectionInteraction */
            $scope.sectionInteractionActionTodoForMentee = function(sectionInteraction) {
              var ret = false;

              if (sectionInteraction.state == 'section_completed' || sectionInteraction.state == 'new' ) {
                return ret;
              }

              var todosStatus = todoStatusHelper(sectionInteraction);

              if (todosStatus.incomplete > 0) {
                ret = true;
              }

              return ret;
            }

            init();
        }]);
