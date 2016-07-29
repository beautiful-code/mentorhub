'use strict';

angular.module('mentorhub', [
        'mentorhub.board'
    ])

    .run(function ($rootScope) {
        $rootScope.Helper = {
            keys: Object.keys
        }
    })

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
            'board_data': apiBaseUrl + 'board',
            'update_section': apiBaseUrl + 'tracks/{track_id}/section_interactions/{section_id}',
            'create_todo': apiBaseUrl + 'tracks/{track_id}/section_interactions/{section_id}/todos',
            'update_todo': apiBaseUrl + 'tracks/{track_id}/section_interactions/{section_id}/todos/{todo_id}'
        };

        return angular.extend(baseUrls, {});
    })

    .factory('Utils', function () {
        return {
            multi_replace: function (string, map) {
                var re = new RegExp(Object.keys(map).join("|"),"gi");

                return string.replace(re, function(matched){
                    return map[matched.toLowerCase()];
                });
            }
        }
    });