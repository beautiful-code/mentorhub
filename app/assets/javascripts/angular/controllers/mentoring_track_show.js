angular.module("mentorhub.mentoring_track_show", [])
    .directive('sectionInteractions', function () {
        return {
            templateUrl: '/templates/section-interaction-template.html'
        }
    })
    .factory('MentoringTrackServices', ["$http", "ApiUrls", "Utils", function ($http, ApiUrls, Utils) {
        return {
            postSectionData: function (route_params, payload) {
                return $http.post(Utils.multi_replace(ApiUrls.create_section_interaction, route_params), {section_interaction: payload})
            },
            putSectionData: function (route_params, payload) {
                return $http.put(Utils.multi_replace(ApiUrls.update_section_interaction, route_params), {section_interaction: payload})
            }
        }
    }])
    .controller('MentoringTrackShowController', ["$scope", "MentoringTrackServices", "SectionInteractionServices",
        function ($scope, MentoringTrackServices, SectionInteractionServices) {
            $scope.sectionInteractionServices = SectionInteractionServices;

            var init = function () {
                $scope.track = MentoringTrackShowConfig.track;
                $scope.track.show_track = true;
                $scope.track.sections = MentoringTrackShowConfig.sections;
                $scope.section_new = MentoringTrackShowConfig.section_new;
                angular.forEach($scope.track.sections, function (section, index) {
                    section.editable = false;
                    section.newRecord = false;
                })
            };

            $scope.add_exercise = function () {
                section_new = angular.extend({}, $scope.section_new, {editable: true, newRecord: true, enabled: true});
                $scope.track.sections.push(section_new);
            };

            $scope.create_section = function (track, section) {
                MentoringTrackServices.postSectionData({'{track_id}': track.id}, section)
                    .success(function (response) {
                        console.log(response);
                        angular.merge(section, response.section_interaction);
                        section.editable = section.newRecord = false;
                    })
            };

            $scope.edit_section = function (section) {
                section.editable = true;
                $scope.temp_section = angular.copy(section);
            };

            $scope.cancel_section = function (section, index) {
                if ($scope.temp_section) {
                    angular.merge(section, $scope.temp_section);
                    section.editable = false;
                }
                else {
                    $scope.track.sections.splice(index, 1)
                }
            };

            $scope.update_section = function (track, section) {
                var routeParams = {
                    '{track_id}': track.id,
                    '{section_id}': section.id
                };

                MentoringTrackServices.putSectionData(routeParams, section)
                    .success(function (response) {
                        section.editable = false;
                    })
            };

            $scope.addResource = function (index) {
                if (!($scope.track.sections[index].resources)) {
                    $scope.track.sections[index].resources = [];
                }
                $scope.track.sections[index].resources.push({});
            };

            $scope.checkBox = function (event, section) {
                section.enabled = event.target.checked;

                var routeParams = {
                    '{track_id}': $scope.track.id,
                    '{section_id}': section.id
                };

                MentoringTrackServices.putSectionData(routeParams, section)
            };

            $scope.sectionStatus = function (track, section) {
                if (section.state != "new" && todoStatusHelper(section) == section.todos.length) {
                    SectionInteractionServices.updateSectionInteractionState(section, 'section_completed');
                }
            };

            var todoStatusHelper = function (section) {
                var todos = section.todos;
                var counter = 0;
                for (var i = 0; i < todos.length; ++i) {
                    if (todos[i].state == 'completed') {
                        counter++;
                    }
                }
                return counter;
            };

            init();
        }]);
