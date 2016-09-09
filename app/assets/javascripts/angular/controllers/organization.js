angular.module("mentorhub.organization", [])

  .factory('OrganizationServices', ["$http", function ($http) {
      return {
          putOrganizationData: function (payload) {
              return $http.put('/organizations/' + payload.id, payload);
          },
          sendInvitationData: function (payload) {
              return $http.post('/organization/invite', payload);
          }
      };
  }])


  .controller("OrganizationController", ['OrganizationServices', '$scope', '$window', function(OrganizationServices, $scope, $window){
    var init = function(){
      $scope.current_user = OrganizationConfig.current_user;
      $scope.organization = OrganizationConfig.organization;
      $scope.users = OrganizationConfig.users;
      $scope.contacts = OrganizationConfig.contacts;
      $scope.update = true;
      angular.forEach($scope.contacts, function(contact, index){
         for (var i = 0; i < $scope.users.length; i++){
           if (contact.primaryEmail == $scope.users[i].email) {
            $scope.contacts.splice(index,1);
            break;
          }
        }
      })
    }

    $scope.updateOrganization = function(){
      OrganizationServices.putOrganizationData($scope.organization)
        .success(function(response){
          $window.location.href = "/organization/invites";
        })
    }
    $scope.send_invite = function(contact){
      OrganizationServices.sendInvitationData({contact: contact});
      contact.invited = true;
    }
    init();
  }]);
