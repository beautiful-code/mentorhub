angular.module('mentorhub.board', [])

.run(['$http', function($http) {
    $http.defaults.headers.common['Accept'] = 'application/json';
    $http.defaults.headers.common['Content-Type'] = 'application/json';
}])

.factory('BoardServices', ['$http', 'ApiUrls', 'Utils', function($http, ApiUrls, Utils) {
    return {
        update_section: function(route_params, payload) {
            return $http.put(
                Utils.multi_replace(ApiUrls.update_section_interaction, route_params),
                payload
            );
        },
        create_todo: function(route_params, payload) {
            return $http.post(
                Utils.multi_replace(ApiUrls.create_todo, route_params),
                payload
            );
        },
        update_todo: function(route_params, payload) {
            return $http.put(
                Utils.multi_replace(ApiUrls.update_todo, route_params),
                payload
            );
        },
        delete_todo: function(route_params, payload) {
            return $http.delete(
                Utils.multi_replace(ApiUrls.update_todo, route_params),
                payload
            );
        },
        create_question: function(route_params, payload) {
            return $http.post(
                Utils.multi_replace(ApiUrls.create_question, route_params),
                payload
            );
        },
        update_question: function(route_params, payload) {
            return $http.put(
                Utils.multi_replace(ApiUrls.update_question, route_params),
                payload
            );
        },
        delete_question: function(route_params, payload) {
            return $http.delete(
                Utils.multi_replace(ApiUrls.update_question, route_params),
                payload
            );
        },
        board_data: function() {
            return $http.get(ApiUrls.board_data);
        }
    };
}])

.service('PubSubServices', function() {
    this.getAllTracks = function(data) {
        var all_tracks = [];
        all_tracks = data.mentoring_tracks.concat(data.learning_tracks);
        return all_tracks;
    };
})

.directive('userTracks', function() {
    return {
        templateUrl: 'templates/user-tracks.html'
    };
})

.directive('userMenteeTracks', function() {
    return {
        templateUrl: 'templates/user-mentee-tracks.html'
    };
})

.directive('rating', ['$http', 'BoardServices', function($http, BoardServices) {
    return {
        restrict: 'A',
        scope: {
            section: '=',
            desc: '@'
        },
        templateUrl: 'templates/rating-template.html',
        link: function(scope, element, attr) {
            var updateStars = function() {
                scope.stars = [];
                for (var i = 0; i < 4; i++) {
                    scope.stars.push({
                        filled: i < scope.section.rating
                    });
                }
            }
            updateStars();
            scope.toggle = function(index, check) {
                if (check) {
                    scope.section.rating = index + 1;
                }
            };
            scope.submit = function() {
                var route_params = {
                    '{track_id}': scope.section.track_id,
                    '{section_id}': scope.section.id
                };
                BoardServices.update_section(route_params, {
                    section_interaction: {
                        rating: scope.section.rating,
                        feedback: scope.section.feedback,
                        state: "feedback_captured"
                    }
                })
            }
            scope.$watch('section.rating', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    updateStars();
                }
            });
        }
    };
}])

.directive('selectSubnav', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            $(element).on('click', function() {
                $(element).parent().children().removeClass('active');
                $(element).addClass('active');

                scope.$apply(function(){
                    $parse('active_track').assign(scope.$parent.$parent, scope[scope.active_tab][attr.selectSubnav]);
                    $parse('subnav.active').assign(scope, attr.selectSubnav);
                });
            });
        }
    };
}])

.directive('horizontalScroll', ['$timeout', function($timeout) {
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
            scope.subnav_scroll(element);
        }
    };
}])

.directive('loader', ['$timeout', function($timeout){
    return{
        restrict: 'AE',
        link: function(scope, element, attr){
            setTimeout(function() {
                    $(element).fadeOut("slow");
                },0);
        }
    }
}])

.controller('BoardController', ['$rootScope', '$scope', '$timeout', 'BoardServices', 'PubSubServices', 'SectionInteractionServices',
    function($rootScope, $scope, $timeout, BoardServices, PubSubServices, SectionInteractionServices) {
        if (sessionStorage.getItem('tab') == "user_mentee_tracks") {
            $scope.active_tab = 'user_mentee_tracks';
            sessionStorage.removeItem('tab');
        } else {
            $scope.active_tab = 'user_tracks';
        }
        $scope.subnav = {};
        $scope.sections = {
            data: {}
        };
        $scope.sectionInteractionServices = SectionInteractionServices;

        var updatable_interactions = {};

        $scope.subnav_scroll = function(element) {
            $timeout(function() {
                $(element).slick({
                    infinite: false,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                });
            });
        }


        $scope.$on('updateScope', function(event, data) {
          $scope.$apply(function() {
                var section_index = $scope.active_track.section_interactions.map(function(e) {
                    return e.id;
                }).indexOf($scope.sectionInteraction.id);
                $scope.sectionInteraction = $scope.active_track.section_interactions[section_index];
            });
        });

        var init = function() {
            if (typeof PageConfig !== "undefined" && typeof PageConfig.boardJson !== "undefined") {
                $scope.user_mentee_tracks = PageConfig.boardJson.mentoring_tracks;
                $scope.user_tracks = PageConfig.boardJson.learning_tracks;
                SectionInteractionServices.updatable_interactions = PubSubServices.getAllTracks(PageConfig.boardJson);
                SectionInteractionServices.updatable_interactions.forEach(function(track) {
                    SectionInteractionServices.subscribeToTrack(track, 'updateScope');
                });
                $scope.mentor_requests = PageConfig.mentor_requests;
            }

            $scope.change_tab($scope.active_tab);

            //angular.element(document).ready(function() {
                //setTimeout(function() {
                    //$(".loading-track").fadeOut("slow");
                //},0);
            //});
        };

        $scope.change_tab = function(tab) {
            $scope.active_tab = tab;
            $scope.active_track = $scope.sectionInteraction = undefined;
            if (Object.keys($scope[tab]).length != 0) {
              $scope.subnav.active = Object.keys($scope[tab])[0];
              $scope.active_track = $scope[tab][$scope.subnav.active];
            }
            $('.slick-initialized').slick('unslick');
            $scope.subnav_scroll($('.board-subnav-links'));
            if ($scope.active_track !== undefined) {
                $scope.reloadSectionInteractions($scope.active_track);
            }
            var subnav_element = $(".user_tracks-subnav");
            subnav_element.children().removeClass('active');
            subnav_element.children(":first-child").addClass('active');
        };

        $scope.add_mentee_notes = function(sectionInteraction, note) {
          if (note.mentee_notes != null){
            var route_params = {
              '{track_id}': sectionInteraction.track_id,
              '{section_id}': sectionInteraction.id
            };

            BoardServices.update_section(route_params, {
              section_interaction: {
                mentee_notes: note.mentee_notes
              }
            })
              .success(function(response) {
                angular.merge(sectionInteraction, response.section_interaction);
                note.edit = false;
                note.mentee_notes = null;
              })
              .error(function(error) {
                console.log(error);
              });
          }
        };

        $scope.update_my_todo = function(section, todo) {
            if (todo.state != 'completed') {
                var new_state = todo.state == 'incomplete' ? 'to_be_reviewed' : 'incomplete';

                var route_params = {
                    '{track_id}': section.track_id,
                    '{section_id}': section.id,
                    '{todo_id}': todo.id
                };

                SectionInteractionServices.update_todo(route_params, {
                    todo: {
                        state: new_state
                    }
                }, todo);
            }
        };

        var todoStatusHelper = function(sectionInteraction) {
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

        $scope.checkMenteeTodosStatus = function(sectionInteraction) {
            if (sectionInteraction !== undefined) {
                return todoStatusHelper(sectionInteraction).completed == sectionInteraction.todos.length;
            }
        };

        $scope.checkMyTodosStatus = function(sectionInteraction) {
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

        $scope.sectionStatus = function(id, track, sectionInteraction) {
            if (sectionInteraction.state != "new" && todoStatusHelper(sectionInteraction).completed == sectionInteraction.todos.length) {
                SectionInteractionServices.updateSectionInteractionState(sectionInteraction, 'section_completed');
            }
        };

        $scope.changeSectionInteraction = function(sectionInteraction) {
            angular.forEach(sectionInteraction.questions, function(question, key) {
                if($scope.active_tab == "user_tracks"){
                    question.edit = (question.answer == null) ? true : false;
                }
                else{
                    question.edit = false;
                }
            });
            $scope.sectionInteraction = sectionInteraction;
            $scope.selected = sectionInteraction.id;
        };

        $scope.reloadSectionInteractions = function(track) {
            var section_index
            if (track.recent_incomplete_section_interaction_id != null) {
                section_index = track.section_interactions.map(function(e) {
                    return e.id;
                }).indexOf(track.recent_incomplete_section_interaction_id);
            } else {
                section_index = 0;
            }
            $scope.changeSectionInteraction(track.section_interactions[section_index]);
        };

        $scope.actionTodoForMyTracks = function() {
            var myLearningTracks = [];
            myLearningTracks =  $scope.user_tracks.slice();

            return actionsTodoPresent(
                myLearningTracks,
                'trackActionTodoForMentee'
            );
        };

        $scope.actionTodoForMyMenteeTracks = function() {
            var myMenteesTracks = [];
            myMenteesTracks =  $scope.user_mentee_tracks.slice()

            return actionsTodoPresent(
                myMenteesTracks,
                'trackActionTodoForMentor'
            );
        };

        $scope.notificationForNewMenteeRequests = function() {
            if ($scope.mentor_requests.length > 0) {
                return true;
            }
        }

        var actionsTodoPresent = function(array, statusFunc) {
            var ret = [];

            array.forEach(function(element) {
                ret.push($scope[statusFunc](element));
            });

            return (ret.indexOf(true) != -1);
        };

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
        };

        /* Does mentor has to act on anything for a sectionInteraction */
        $scope.sectionInteractionActionTodoForMentor = function(sectionInteraction) {
            var notify_mentor = false;
            var todosStatus = todoStatusHelper(sectionInteraction);
            if ((todosStatus.to_review > 0 || todosStatus.completed == sectionInteraction.todos.length) && (sectionInteraction.state != 'section_completed' && sectionInteraction.state != 'new' && sectionInteraction.state != 'feedback_captured')) {
                notify_mentor = true;
            }
            return notify_mentor;
        };

        /* Does mentee has to act on anything for a sectionInteraction */
        $scope.sectionInteractionActionTodoForMentee = function(sectionInteraction) {
            var notify_mentee = false;
            var todosStatus = todoStatusHelper(sectionInteraction);
            if ((todosStatus.incomplete > 0) && (sectionInteraction.state != 'section_completed' && sectionInteraction.state != 'new')) {
                notify_mentee = true;
            }
            return notify_mentee;
        };

        init();

    }
]);
