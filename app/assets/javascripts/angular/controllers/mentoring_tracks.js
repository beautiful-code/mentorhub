angular.module("mentorhub.mentoring_tracks", [])

    .controller("MentoringTracksController", ["$scope", function ($scope) {
        var init = function () {
            $scope.tracks = MentoringTracksConfig.tracks;
        };
        init();
    }]);
