angular.module("mentorhub.learning_tracks", [])

    .controller("LearningTracksController", ["$scope", function ($scope) {
        var init = function () {
            $scope.tracks = LearningTracksConfig.tracks;
        };
        init();
    }]);

