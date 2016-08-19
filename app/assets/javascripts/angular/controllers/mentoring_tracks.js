angular.module("mentorhub.mentoring_tracks", [])

    .controller("MentoringTracksController", ["$rootScope", "$scope", "$window", function ($rootScope, $scope, $window) {
        var init = function () {
            $scope.tracks = MentoringTracksConfig.tracks;
        };
        init();

        $scope.self_track = function(val){
          $window.sessionStorage.setItem('self_track', val);
        }
    }]);
