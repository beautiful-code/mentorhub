'use strict';

angular.module('mentorhub.root', [])

    .config(['$routeProvider', '$httpProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/board'});
    }])

    .filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    })

    .filter('date_filter', function () {
        return function (input) {
            return new Date(input)
        }
    })
    
    .factory('ApiUrls', function () {
        var apiBaseUrl = '/';
        var baseUrls = {
            'boards': apiBaseUrl + 'board/mock'
        };

        return angular.extend(baseUrls, {});
    })

    .run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
        $rootScope.header_navigations = {
            selected: '/board',
            options: {
                '/board': {label: 'Your Board'},
                '/my_tracks': {label: 'My Learning Tracks'},
                '/mentees_tracks': {label: 'Mentees Tracks'},
                '/tracks': {label: 'Tracks'}
            }
        };

        $rootScope.$on('$locationChangeStart', function () {
            $window.sessionStorage.setItem('current_location', $location.path());
            $rootScope.header_navigations.selected = $location.path();
        });
    }])

    .controller('RootController', function ($scope) {
        // ToDo: temporary, will require auth
        $scope.login_status = true;
    });
