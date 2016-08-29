'use strict';

angular.module('mentorhub', [
    'mentorhub.board',
    'mentorhub.commons',
    'mentorhub.tracks',
    'mentorhub.track',
    'mentorhub.mentoring_tracks',
    'mentorhub.mentoring_track_show',
    'mentorhub.mentoring_track_new',
    'mentorhub.organization'
])

    .run(['$rootScope', function ($rootScope) {
        $rootScope.Helper = {
            keys: Object.keys
        };
    }])

    .filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    })

    .filter('date_filter', function () {
        return function (input) {
            return new Date(input);
        };
    })

    .factory('ApiUrls', function () {
        var apiBaseUrl = '/';
        var baseUrls = {
            'board_data': apiBaseUrl + 'board',
            'update_section_interaction': apiBaseUrl + 'tracks/{track_id}/section_interactions/{section_id}',
            'create_todo': apiBaseUrl + 'tracks/{track_id}/section_interactions/{section_id}/todos',
            'update_todo': apiBaseUrl + 'tracks/{track_id}/section_interactions/{section_id}/todos/{todo_id}',

            'create_track': apiBaseUrl + 'track_templates',
            'update_track': apiBaseUrl + 'track_templates/{track_id}',
            'delete_track': apiBaseUrl + 'track_templates/{track_id}',

            'get_sections': apiBaseUrl + 'track_templates/{track_id}/section_templates',


            'create_section': apiBaseUrl + 'track_templates/{track_id}/section_templates',
            'update_section': apiBaseUrl + 'track_templates/{track_id}/section_templates/{section_id}',
            'delete_section': apiBaseUrl + 'track_templates/{track_id}/section_templates/{section_id}',

            'create_section_interaction': apiBaseUrl + 'tracks/{track_id}/section_interactions',
            'create_mentee_track': apiBaseUrl + 'mentoring_tracks',

            'update_organization': apiBaseUrl + ''
        };

        return angular.extend(baseUrls, {});
    })

    .factory('Utils', function () {
        return {
            multi_replace: function (string, map) {
                var re = new RegExp(Object.keys(map).join("|"), "gi");
                return string.replace(re, function (matched) {
                    return map[matched.toLowerCase()];
                });
            }
        };
    });
