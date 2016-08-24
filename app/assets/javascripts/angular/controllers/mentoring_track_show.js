angular.module("mentorhub.mentoring_track_show", [])
    .directive('sectionInteractions', function () {
        return {
            templateUrl: '/templates/section-interaction-template.html'
        };
    })
    .factory('MentoringTrackServices', ["$http", "ApiUrls", "Utils", function ($http, ApiUrls, Utils) {
        return {
            postSectionData: function (route_params, payload) {
                return $http.post(Utils.multi_replace(ApiUrls.create_section_interaction, route_params), {section_interaction: payload});
            },
            putSectionData: function (route_params, payload) {
                return $http.put(Utils.multi_replace(ApiUrls.update_section_interaction, route_params), {section_interaction: payload});
            }
        };
    }])
    .controller('MentoringTrackShowController', ["$scope", "MentoringTrackServices", "SectionInteractionServices",
        function ($scope, MentoringTrackServices, SectionInteractionServices) {
            $scope.sectionInteractionServices = SectionInteractionServices;
            var new_section, temp_sections = [];

            var defaultSectionAttributes = function (section) {
                temp_sections.push(angular.copy(section));
                section.newRecord = section.editable = false;
            };

            var init = function () {
                $scope.track = MentoringTrackShowConfig.track;
                $scope.track.show_track = true;
                $scope.track.sections = MentoringTrackShowConfig.sections;
                new_section = MentoringTrackShowConfig.section;
                angular.forEach($scope.track.sections, function (section, index) {
                    defaultSectionAttributes(section);
                });
            };

            var setRouteParams = function(track, section){
                 var routeParams = {
                     '{track_id}': track.id,
                     '{section_id}': section.id
                 };
                 return routeParams;
             };

            $scope.add_exercise = function () {
                var section = angular.extend({}, new_section, {editable: true, newRecord: true, enabled: true});
                $scope.track.sections.push(section);
            };

            $scope.create_section = function (track, section) {
                MentoringTrackServices.postSectionData({'{track_id}': track.id}, section)
                    .success(function (response) {
                        section.editable = section.newRecord = false;
                        angular.merge(section, response.section_interaction);
                        temp_sections.push(angular.copy(section));
                    });
            };

            $scope.cancel_section = function (section, index) {
                if (section.id) {
                    section.editable = false;
                    var section_index = temp_sections.map(function (e) {
                        return e.id;
                    }).indexOf(section.id);
                    angular.merge(section, temp_sections[section_index]);
                }
                else {
                    $scope.track.sections.splice(index, 1);
                }
            };

            $scope.update_section = function (track, section) {
                var routeParams = setRouteParams(track, section);

                MentoringTrackServices.putSectionData(routeParams, section)
                    .success(function (response) {
                        section.editable = false;
                        var section_index = temp_sections.map(function (e) {
                            return e.id;
                        }).indexOf(section.id);
                        angular.merge(temp_sections[section_index], section);
                    });
            };

            $scope.addResource = function (index) {
                if (!($scope.track.sections[index].resources)) {
                    $scope.track.sections[index].resources = [];
                }
                $scope.track.sections[index].resources.push({});
            };

            $scope.checkBox = function (event, section) {
                section.enabled = event.target.checked;
                var routeParams = setRouteParams($scope.track, section);
                MentoringTrackServices.putSectionData(routeParams, section);
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
