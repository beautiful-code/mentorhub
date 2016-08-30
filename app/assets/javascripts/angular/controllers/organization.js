angular.module("mentorhub.organization", [])

  .factory('OrganizationServices', ["$http", function ($http) {
      return {
          putOrganizationData: function (payload) {
              return $http.put('/organizations/' + payload.id, payload);
          }
      };
  }])


  .controller("OrganizationController", ['OrganizationServices', '$scope', '$window', function(OrganizationServices, $scope, $window){
    var init = function(){
      $scope.current_user = OrganizationConfig.current_user;
      $scope.organization = OrganizationConfig.organization;
      $scope.update = true;
    }

    $scope.updateOrganization = function(){
      OrganizationServices.putOrganizationData($scope.organization)
        .success(function(response){
          $scope.update = false;
        })
    }
    init();
  }]);
