angular.module('mentorhub.tracks', [])

    .controller('TracksController', ["$scope", function ($scope) {
        var init = function () {
            $scope.trackTemplates = PageConfig.trackTemplates;
        };

        init()
    }]);

