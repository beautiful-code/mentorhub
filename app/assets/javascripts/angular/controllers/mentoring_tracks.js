angular.module("mentorhub.mentoring_tracks", [])

  .factory('MentoringTracksServices', ["$http", "ApiUrls", "Utils",
    function ($http, ApiUrls, Utils) {
      return {
        putRequest: function(id, payload) {
          return $http.put('/requests/' + id, {mentoring_request: payload});
        }
      };
    }])

      .controller("MentoringTracksController", ["$rootScope", "$scope", "$window", "MentoringTracksServices", function ($rootScope, $scope, $window, MentoringTracksServices) {
        var init = function () {
          $scope.data = [];
          $scope.mentoringTracks = MentoringTracksConfig.mentoringTracks;
          $scope.learningTracks = MentoringTracksConfig.learningTracks;
          $scope.mentorRequests = MentoringTracksConfig.mentorRequests;
          $scope.tracks = MentoringTracksConfig.tracks;
          $scope.users = MentoringTracksConfig.users;

          angular.forEach($scope.mentorRequests, function(mentorRequest, key) {
            var mentee_index = $scope.users.map(function (e) {
              return e.id;
            }).indexOf(mentorRequest.mentee_id);
            var mentee = $scope.users[mentee_index];

            var track_index = $scope.tracks.map(function (e) {
              return e.id;
            }).indexOf(mentorRequest.track_template_id);
            var track = $scope.tracks[track_index];

            $scope.data.push({mentorRequest: mentorRequest, mentee: mentee, track: track});
          });
        };

        $scope.self_track = function(val){
          $window.sessionStorage.setItem('self_track', val);
        };

        $scope.request = function(result, index){
          if(result == 'accepted'){
            mentoring_request = {
              track_template_id: $scope.mentorRequests[index].track_template_id,
              mentee_id: $scope.mentorRequests[index].mentee_id,
              mentor_id: $scope.mentorRequests[index].mentor_id
            }
            $window.localStorage.clear();
            $window.sessionStorage.clear();
            $window.sessionStorage.mentoring_request = JSON.stringify(mentoring_request);
            $window.location.href = '/mentoring_tracks/new';
          }else{
            MentoringTracksServices.putRequest($scope.mentorRequests[index].id, {state: result})
              .success(function (response) {
                $scope.mentorRequests[index].state = response.mentoring_request.state;
                $scope.data[index].mentorRequest.state = response.mentoring_request.state;
              });
          }
        }
        init();

      }]);
