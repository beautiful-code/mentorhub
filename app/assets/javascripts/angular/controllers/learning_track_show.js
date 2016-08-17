angular.module("mentorhub.learning_track_show", [])
    .directive('learningSectionInteractions', function () {
        return {
            templateUrl: '/templates/learning-section-interaction-template.html'
        }
    })
    .directive('learningTrack',function(){
    return {
      templateUrl: '/templates/learning-track.html'
    }
    })

    .factory('LearningTrackServices', ["$http", "ApiUrls", "Utils", function ($http, ApiUrls, Utils) {
        return {
          update_section: function (route_params, payload) {
                return $http.put(
                    Utils.multi_replace(ApiUrls.update_section_interaction, route_params),
                    payload
                )
            }

        }
    }])
    .controller('LearningTrackShowController', ["$scope","$location", "LearningTrackServices", "SectionInteractionServices",
        function ($scope,$location, LearningTrackServices, SectionInteractionServices) {
            $scope.sectionInteractionServices = SectionInteractionServices;

            var init = function () {
                $scope.track = LearningTrackShowConfig.track;
                $scope.track.sections = LearningTrackShowConfig.sections;
            };


             $scope.add_mentee_notes = function (sectionInteraction, note) {
                var route_params = {
                    '{track_id}': sectionInteraction.track_id,
                    '{section_id}': sectionInteraction.id
                };

                LearningTrackServices.update_section(route_params, {section_interaction: {mentee_notes: note.mentee_notes}})
                    .success(function (response) {
                        sectionInteraction.mentee_notes = note.mentee_notes;
                        note.edit = false;
                        note.mentee_notes = null;
                        window.location = $location.absUrl();
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


            init();
        }]);

