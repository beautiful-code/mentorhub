angular.module("mentorhub.mentoring_track_new", [])

    .directive('sectionInteractionsNew', function () {
        return {
            templateUrl: '/templates/section-interaction-template.html'
        };
    })

    .factory('MentoringTrackNewServices', ["$http", "ApiUrls", "Utils", function ($http, ApiUrls, Utils) {
        return {
            getSectionsData: function (route_params) {
                return $http.get(Utils.multi_replace(ApiUrls.get_sections, route_params));
            },
            postTrackData: function (payload) {
                return $http.post(ApiUrls.create_mentee_track, payload);
            },
            postSectionInteractionData: function (route_params, payload) {
                return $http.post(Utils.multi_replace(ApiUrls.create_section_interaction, route_params), payload);
            },
            putRequest: function(id, payload) {
              return $http.put('/requests/' + id, {mentoring_request: payload});
            }
        };
    }])


    .controller('MentoringTrackNew', ['$rootScope','$scope', '$window', 'MentoringTrackNewServices', function ($rootScope, $scope, $window, MentoringTrackNewServices ) {
        var temp_sections = [];

        var defaultSectionAttributes = function (section) {
            temp_sections.push(angular.copy(section));
            section.newSectionInteraction = !(section.newRecord = section.editable = false);
        };

        var init = function () {
            $scope.self_track = JSON.parse($window.sessionStorage.getItem('self_track'));
            $scope.deadline = new Date();
            $scope.users = MentoringTrackConfig.users;
            $scope.tracks = MentoringTrackConfig.tracks;
            $scope.mentor_requests = MentoringTrackConfig.mentor_requests;
            if ($window.localStorage.getItem('SelectedTrack')) {
                $scope.selectTrack = JSON.parse($window.localStorage.getItem('SelectedTrack'));
                $scope.showButtons = true;
                $scope.selectMentee = $scope.selectTrack.mentee;
                $scope.deadline = new Date($scope.selectTrack.deadline);

                angular.forEach($scope.selectTrack.sections, function (section, index) {
                    defaultSectionAttributes(section);
                });
            }
            else if($window.sessionStorage.getItem('mentoring_request')){
              mentoring_request = JSON.parse($window.sessionStorage.getItem('mentoring_request'));
              var indexOfTrack = $scope.tracks.map(function (e) {
                return e.id;
              }).indexOf(mentoring_request.track_template_id);
              $scope.selectTrack = $scope.tracks[indexOfTrack];
              $scope.deadline = new Date(mentoring_request.deadline);
              if (mentoring_request.mentee_id){
                var indexOfMentee = $scope.users.map(function (e) {
                  return e.id;
                }).indexOf(mentoring_request.mentee_id);
                $scope.selectMentee = $scope.users[indexOfMentee];
              }
              $scope.update_mentee_track();
              $scope.update_mentee_track_deadline();
              $scope.showButtons = true;
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
            MentoringTrackNewServices.getSectionsData({'{track_id}': $scope.selectTrack.id})
                .success(function (response) {
                    $scope.selectTrack.sections = angular.copy(response.sections);
                    angular.forEach($scope.selectTrack.sections, function (section, index) {
                        defaultSectionAttributes(section);
                    });
                    if ($scope.self_track) {
                        $scope.selectMentee = MentoringTrackConfig.current_user;
                    }
                    $scope.selectTrack.mentee = $scope.selectMentee;
                    updateLocalStorage($scope.selectTrack);
                });
        };

        $scope.update_mentee_track_deadline = function () {
            $scope.selectTrack.deadline = $scope.deadline = new Date($scope.deadline);
            updateLocalStorage($scope.selectTrack);
        };

        $scope.add_section = function () {
            $scope.selectTrack.sections.push({
                editable: true, newRecord: true, enabled: true, newSectionInteraction: true
            });
        };

        $scope.create_section = function (section) {
          section.newRecord = section.editable = false;
            temp_sections.push(section);
            updateLocalStorage($scope.selectTrack);
        };

        $scope.update_section = function (section) {
            var section_index = temp_sections.map(function (e) {
                return e.id;
            }).indexOf(section.id);
            angular.merge(temp_sections[section_index], section);
            section.editable = false;
            updateLocalStorage($scope.selectTrack);
        };

        $scope.cancel_section = function (section, index) {
            if (section.id) {
                var section_index = temp_sections.map(function (e) {
                    return e.id;
                }).indexOf(section.id);
                angular.merge(section, temp_sections[section_index]);
                section.editable = false;
            }
            else {
                $scope.selectTrack.sections.splice(index, 1);
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
            $window.sessionStorage.removeItem("mentoring_request");
            $scope.selectTrack = $scope.selectMentee = undefined;
            $scope.showButtons = false;
        };

        $scope.confirm_mentee_track = function () {
          if (confirm("Create mentee track")) {
            $scope.selectTrack.track_id = $scope.selectTrack.id;
            MentoringTrackNewServices.postTrackData($scope.selectTrack)
              .success(function (response) {
                $scope.track = response.track;
                angular.forEach($scope.mentor_requests, function (mentor_request, index) {
                  if(($scope.track.mentee_id == mentor_request.mentee_id)
                    && ($scope.track.mentor_id == mentor_request.mentor_id)
                    && ($scope.track.track_template_id == mentor_request.track_template_id)
                  ){
                    MentoringTrackNewServices.putRequest(mentor_request.id, {state: 'accepted'})
                      .success(function (response) {
                        $scope.mentor_request.state = response.mentoring_request.state;
                      });
                  }
                });
                $window.localStorage.clear();
                $window.sessionStorage.clear();
                $window.location.href = "/mentoring_tracks";
              });
          }
        };

        init();
    }]);
