angular.module('mentorhub.tracks', [])

    .factory('TracksServices', ["$http", "ApiUrls", "Utils", function ($http, ApiUrls, Utils) {
        return {
          deleteTrack: function (route_params, payload) {
              return $http.delete(
                Utils.multi_replace(ApiUrls.delete_track, route_params),
                payload
              );
            }
        };
    }])

    .controller('TracksController', ["$scope", "$window", "TracksServices", function ($scope, $window, TracksServices) {
        $scope.trackTemplates = PageConfig.trackTemplates;
        $scope.current_user= PageConfig.current_user;
        $scope.track_ids= PageConfig.track_ids;

        $scope.deleteTrack = function(index, track, event){
          event.preventDefault();
          event.stopPropagation();
          var routeParams = {
            '{track_id}': track.id
          };
          if (confirm("Delete Track")) {
            $scope.trackTemplates.splice(index, 1);
            TracksServices.deleteTrack(routeParams, track);
          }
        }

        $scope.show_delete = function(trackTemplate){
          if((trackTemplate.user_id == $scope.current_user.id)&&($scope.track_ids.indexOf(trackTemplate.id) === -1 )){
            return true;
          }
        }

        $scope.selectTrack = function(trackTemplate){
          $window.location.href = "/track_templates/" + trackTemplate.id;
        }
    }]);

