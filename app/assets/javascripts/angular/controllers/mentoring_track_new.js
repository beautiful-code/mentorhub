angular.module("mentorhub.mentoring_track_new", [])

    .directive('sectionInteractionsNew', function () {
        return {
            templateUrl: '/templates/section-interaction-template.html'
        }
    })

    .factory('MentoringTrackNewServices', ["$http", "ApiUrls", "Utils", function ($http, ApiUrls, Utils) {
        return {
            getSectionsData: function (route_params) {
                return $http.get(Utils.multi_replace(ApiUrls.get_sections, route_params))
            },
            postTrackData: function (payload) {
                return $http.post(ApiUrls.create_mentee_track, payload)
            },
            postSectionInteractionData: function (route_params, payload) {
                return $http.post(Utils.multi_replace(ApiUrls.create_section_interaction, route_params), payload)
            }
        }
    }])


    .controller('MentoringTrackNew', ['$scope', '$window', 'MentoringTrackNewServices', function ($scope, $window, MentoringTrackNewServices) {
        var count = 1;

        var defaultSectionAttributes = function (section) {
            $scope.temp_sections.push(angular.copy(section));
            section.id = count++;
            section.newRecord = section.editable = false;
            section.newTrackSI = true;
        };

        var init = function () {
            $scope.temp_sections = [];
            $scope.deadline = new Date();
            $scope.users = MentoringTrackConfig.users;
            $scope.tracks = MentoringTrackConfig.tracks;
            if ($window.localStorage.getItem('SelectedTrack')) {
                $scope.selectTrack = JSON.parse($window.localStorage.getItem('SelectedTrack'));
                $scope.showButtons = true;
                $scope.selectMentee = $scope.selectTrack.mentee;
                $scope.deadline = new Date($scope.selectTrack.deadline);

                angular.forEach($scope.selectTrack.sections, function (section, index) {
                    defaultSectionAttributes(section);
                });
            }
        };

        var updateLocalStorage = function (track) {
            $window.localStorage.setItem("SelectedTrack", JSON.stringify(track));
        };

        $scope.update_mentee = function () {
            $scope.selectTrack.mentee = $scope.selectMentee;
            updateLocalStorage($scope.selectTrack);
        };

        $scope.update_mentee_track = function () {
            count = 1;
            MentoringTrackNewServices.getSectionsData({'{track_id}': $scope.selectTrack.id})
                .success(function (response) {
                    $scope.selectTrack.sections = angular.copy(response.sections);
                    angular.forEach($scope.selectTrack.sections, function (section, index) {
                        defaultSectionAttributes(section);
                    });
                    $scope.selectTrack.mentee = $scope.selectMentee;
                    updateLocalStorage($scope.selectTrack);
                });
        };

        $scope.update_mentee_track_deadline = function () {
            $scope.selectTrack.deadline = $scope.deadline = new Date($scope.deadline);
            updateLocalStorage($scope.selectTrack);
        }

        $scope.add_section = function () {
            $scope.selectTrack.sections.push({
                id: count, editable: true, newRecord: true, enabled: true, newTrackSI: true
            });
        };

        $scope.create_section = function (section) {
            section.newRecord = section.editable = false;
            $scope.temp_sections.push(section);
            updateLocalStorage($scope.selectTrack);
        };

        $scope.update_section = function (section) {
            angular.forEach($scope.temp_sections, function (value, _) {
                if (value.id == section.id) {
                    angular.merge(value, section);
                }
            });
            section.editable = false;
            updateLocalStorage($scope.selectTrack, $scope.sections);
        };

        $scope.edit_section = function (section) {
            section.editable = true;
        };

        $scope.cancel_section = function (section, index) {
            if (section.id) {
                angular.forEach($scope.temp_sections, function (value, _) {
                    if (section.id == value.id) {
                        angular.merge(section, value);
                    }
                });
                section.editable = false;
            }
            else {
                $scope.selectTrack.sections.splice(index, 1)
            }
        };

        $scope.addResource = function (index) {
            if (!($scope.selectTrack.sections[index].resources)) {
                $scope.selectTrack.sections[index].resources = [];
            }
            $scope.selectTrack.sections[index].resources.push({});
        };

        $scope.checkBox = function (event, section) {
            section.enabled = event.target.checked;
            updateLocalStorage($scope.selectTrack);
        };

        $scope.reset = function () {
            $window.localStorage.removeItem("SelectedTrack");
            $scope.selectTrack = $scope.selectMentee = undefined;
            $scope.showButtons = false;
        };

        $scope.confirm_mentee_track = function () {
            if (confirm("Create mentee track")) {
                $scope.selectTrack.track_id = $scope.selectTrack.id;
                MentoringTrackNewServices.postTrackData($scope.selectTrack)
                    .success(function (response) {
                        $scope.reset();
                        $window.location.href = "/mentoring_tracks";
                    })
            }
        };

        init();
    }]);