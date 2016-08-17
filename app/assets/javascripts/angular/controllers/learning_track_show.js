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

    .controller('LearningTrackShowController', ["$scope","$location","BoardServices", "SectionInteractionServices",
        function ($scope,$location, BoardServices, SectionInteractionServices) {
            $scope.sectionInteractionServices = SectionInteractionServices;
            $scope.boardServices = BoardServices;

            var init = function () {
                $scope.track = LearningTrackShowConfig.track;
                $scope.track.sections = LearningTrackShowConfig.sections;
            };


             $scope.add_mentee_notes = function (sectionInteraction, note) {
                var route_params = {
                    '{track_id}': sectionInteraction.track_id,
                    '{section_id}': sectionInteraction.id
                };

                BoardServices.update_section(route_params, {section_interaction: {mentee_notes: note.mentee_notes}})
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

