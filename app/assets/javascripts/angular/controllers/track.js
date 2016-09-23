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

    .directive('fileModel', ['$parse','TrackServices', function ($parse,TrackServices) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('change', function () {
                    $parse(attrs.fileModel).assign(scope, element[0].files[0]);
                    if(scope.track.id){
                      var trackParams = new FormData();
                      trackParams.append('track_template[image]', scope.imageFile);
                      TrackServices.putTrackData({'{track_id}': scope.track.id}, trackParams)
                        .success(function (response) {
                          scope.track.image.image.url = response.track_template.image.image.url;
                        });
                    }
                    else{
                      var reader = new FileReader();
                      reader.onload = function (e) {
                        $('#preview_image').attr('src', e.target.result);
                      }
                      reader.readAsDataURL(scope.imageFile);
                    }
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
                },
                postRequest: function(payload) {
                    return $http.post('/requests', {mentoring_request: payload});
                },
                putRequest: function(id, payload) {
                    return $http.put('/requests/' + id, {mentoring_request: payload});
                }
            };
        }])

    .controller('TrackController', ["$window", "$scope", "TrackServices",
        function ($window, $scope, TrackServices) {

            var temp_sections = [];

            var init = function () {
                $scope.track = PageConfig.track;
                $scope.members = PageConfig.members;
                $scope.current_user = PageConfig.current_user;
                $scope.mentor_request = PageConfig.mentor_request;
                angular.forEach($scope.track.sections, function (section, index) {
                    defaultSectionAttributes(section);
                });
            };
            var defaultSectionAttributes = function (section) {
                temp_sections.push(angular.copy(section));
                section.newRecord = section.editable = false;
            };

            $scope.addResource = function (index) {
                if (!($scope.track.sections[index].resources)) {
                    $scope.track.sections[index].resources = [];
                }
                $scope.track.sections[index].resources.push({});
            };

            $scope.create_track = function (track) {
                var trackParams = setTrackParams(track);
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

            $scope.edit_name = function(track){
              $scope.temp_track = angular.copy(track);
              track.name_editable = true;
            }

            $scope.update_name = function (track){
              var trackParams = setTrackParams(track);
              TrackServices.putTrackData({'{track_id}': track.id}, trackParams)
                  .success(function (response) {
                      track.name_editable = false;
                  });
            }

            $scope.cancel_name = function(track){
              track.name = $scope.temp_track.name
              track.name_editable = false;
            }

            $scope.edit_desc = function(track){
              $scope.temp_track = angular.copy(track);
              track.description_editable = true;
            }

            $scope.update_desc = function (track){
              var trackParams = setTrackParams(track);
              TrackServices.putTrackData({'{track_id}': track.id}, trackParams)
                  .success(function (response) {
                      track.description_editable = false;
                  });
            }

            $scope.cancel_desc = function(track){
              track.desc = $scope.temp_track.desc
              track.description_editable = false;
            }

            var setTrackParams = function(track){
                var trackParams = new FormData();
                trackParams.append('track_template[name]', track.name);
                trackParams.append('track_template[desc]', track.desc);
                trackParams.append('track_template[image]', $scope.imageFile);
                return trackParams;
            };

            $scope.edit_section = function (section) {
                section.editable = true;
                $scope.temp_section = angular.copy(section);
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

            $scope.create_section = function (track, section, event) {
              section_element = $(event.target).parents().eq(2);
              section_element.find("#title, #content").removeClass("error");
                TrackServices.postSectionData({'{track_id}': track.id}, section)
                    .success(function (response) {
                        section.id = response.section.id;
                        section.editable = section.newRecord = false;
                        temp_sections.push(angular.copy(section));
                    })
                    .error(function(response){
                      Object.keys(response.errors).forEach(function(id){
                        section_element.find('#'+id).addClass("error")
                      })
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

            $scope.uploadFile = function(){
              $('#imageUpload').trigger('click');
            };

            $scope.newFileUpload = function(){
              $('#track__logo').trigger('click');
            };

            $scope.onSubmit = function(type, track_template_id, deadline, person){
              if(type == 'self-track'){
                mentoring_request = {
                  track_template_id: track_template_id,
                  deadline: deadline,
                  mentee_id: $scope.current_user.id,
                  mentor_id: $scope.current_user.id
                }
                $window.sessionStorage.self_track = true;
                $window.sessionStorage.mentoring_request = JSON.stringify(mentoring_request);
                $window.localStorage.clear();
                $window.location.href = '/mentoring_tracks/new';
              }
              else if(type == 'mentor'){
                person = JSON.parse(person);
                mentoring_request = {
                  track_template_id: track_template_id,
                  deadline: deadline,
                  mentee_id: person.id,
                  mentor_id: $scope.current_user.id
                }
                $window.localStorage.clear();
                $window.sessionStorage.clear();
                $window.sessionStorage.mentoring_request = JSON.stringify(mentoring_request);
                $window.location.href = '/mentoring_tracks/new';
              }
              else if(type == 'mentee'){
                person = JSON.parse(person);
                mentoring_request = {
                  track_template_id: track_template_id,
                  mentee_id: $scope.current_user.id,
                  mentor_id: person.id
                }
                TrackServices.postRequest(mentoring_request)
                      .success(function (response) {
                        $('.modal').modal('hide');
                      });
              }
            }

            $scope.request = function(result){
              TrackServices.putRequest()
                      .success(function (response) {
                        $('.modal').modal('hide');
                      });
              debugger;
            }

            $scope.request = function(result){
              if(result == 'accepted'){
                mentoring_request = {
                  track_template_id: $scope.mentor_request.track_template_id,
                  mentee_id: $scope.mentor_request.mentee_id,
                  mentor_id: $scope.mentor_request.mentor_id
                }
                $window.localStorage.clear();
                $window.sessionStorage.clear();
                $window.sessionStorage.mentoring_request = JSON.stringify(mentoring_request);
                $window.location.href = '/mentoring_tracks/new';
              }else{
                 TrackServices.putRequest($scope.mentor_request.id, {state: result})
                  .success(function (response) {
                    $scope.mentor_request.state = response.mentoring_request.state;
                  });

              }
            }

            init();
        }]);
