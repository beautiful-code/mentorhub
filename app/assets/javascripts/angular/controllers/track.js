angular.module('mentorhub.track', [])

    .directive('track', function () {
        return {
            templateUrl: '/templates/track.html'
        };
    })

    .directive('newExercise', function () {
        return {
            templateUrl: '/templates/section-template.html'
        };
    })

    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('change', function () {
                    $parse(attrs.fileModel).assign(scope, element[0].files[0]);
                });
            }
        };
    }])

    .factory('TrackServices', ["$http", "ApiUrls", "Utils",
        function ($http, ApiUrls, Utils) {
            return {
                postTrackData: function (payload) {
                    return $http.post(ApiUrls.create_track, payload, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    });
                },
                putTrackData: function (route_params, payload) {
                    return $http.put(Utils.multi_replace(ApiUrls.update_track, route_params), payload, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    });
                },
                deleteTrackData: function (route_params, payload) {
                    return $http.delete(Utils.multi_replace(ApiUrls.delete_track, route_params), payload);
                },
                postSectionData: function (route_params, payload) {
                    return $http.post(Utils.multi_replace(ApiUrls.create_section, route_params), {section_template: payload});
                },
                putSectionData: function (route_params, payload) {
                    return $http.put(Utils.multi_replace(ApiUrls.update_section, route_params), {section_template: payload});
                },
                deleteSection: function (route_params, payload) {
                    return $http.delete(Utils.multi_replace(ApiUrls.delete_section, route_params), {section_template: payload});
                }
            };
        }])

    .controller('TrackController', ["$window", "$scope", "TrackServices",
        function ($window, $scope, TrackServices) {

            var init = function () {
                $scope.track = PageConfig.track;
            };

            $scope.addResource = function (index) {
                if (!($scope.track.sections[index].resources)) {
                    $scope.track.sections[index].resources = [];
                }
                $scope.track.sections[index].resources.push({});
            };

            $scope.create_track = function (track) {
                var file = $scope.imageFile;
                var trackParams = setTrackParams(track, file);
                TrackServices.postTrackData(trackParams)
                    .success(function (response) {
                        track.editable = track.newRecord = false;
                        $window.location.href = '/track_templates/' + response.track_template.id;
                    });
            };

            $scope.edit_track = function (track) {
                track.editable = true;
                $scope.temp_track = angular.copy(track);
            };

            $scope.cancel_track = function (track) {
                if ($scope.temp_track) {
                    angular.merge(track, $scope.temp_track);
                    track.editable = false;
                }
                else {
                    track.name = track.desc = null;
                }
            };

            $scope.update_track = function (track) {
                var file = $scope.imageFile;
                var trackParams = setTrackParams(track, file);
                TrackServices.putTrackData({'{track_id}': track.id}, trackParams)
                    .success(function (response) {
                        track.image.image.url = response.track_template.image.image.url;
                        track.editable = false;
                    });
            };

            var setTrackParams = function(track, file){
                var trackParams = new FormData();
                trackParams.append('track_template[name]', track.name);
                trackParams.append('track_template[desc]', track.desc);
                trackParams.append('track_template[image]', file);
                return trackParams;
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
                    $scope.track.sections.splice(index, 1);
                }
            };

            $scope.create_section = function (track, section) {
                TrackServices.postSectionData({'{track_id}': track.id}, section)
                    .success(function (response) {
                        section.id = response.section.id;
                        section.editable = section.newRecord = false;
                    });
            };

            $scope.update_section = function (track, section) {
                var routeParams = {
                    '{track_id}': track.id,
                    '{section_id}': section.id
                };

                TrackServices.putSectionData(routeParams, section)
                    .success(function (response) {
                        section.editable = false;
                    });
            };

            $scope.delete_section = function (index, track, section) {
                var routeParams = {
                    '{track_id}': track.id,
                    '{section_id}': section.id
                };
                if (confirm("Delete section")) {
                    $scope.track.sections.splice(index, 1);
                    TrackServices.deleteSection(routeParams, section);
                }
            };

            var setFileData = function ($image) {
                var file = null;
                if ($image && $image.files) {
                    file = $image.files[0];
                }
                return file;
            };

            init();
        }]);
