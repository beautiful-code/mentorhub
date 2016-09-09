angular.module('mentorhub.tracks', [])

    .controller('TracksController', ["$scope", function ($scope) {
        $scope.trackTemplates = PageConfig.trackTemplates;
    }]);

