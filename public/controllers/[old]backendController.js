// public/core.js
var app = angular.module('backend', []);

app.factory('session', ['$rootScope', '$window', '$http', function($rootScope, $window, $http) {
      var session = {};

      session.refreshList = function(data) {

        $rootScope.users = data;
      };

      session.createUser = function(data) {

        $http.post('/api/createUser', data)
          .success(function(data) {
            // $rootScope.formUser = {}; // clear the form so our user is ready to enter another

            $rootScope.users = data;
            session.users = data;
            console.log(data);
          })
          .error(function(data) {
            console.log('Error in controller: ' + JSON.stringify(data, null, 4));
            if (data.code === 11000) {
              $rootScope.duplicate = true;
            }
          });
      };
        return session;
}]);

    app.controller('BackendController', ['$scope', '$http', 'session', function($scope, $http, session) {

      var user = {};
      var bck = this;

      $scope.init = function(_user) {
        $scope.user = _user;

        $http.get('/api/getusersbycompany/' + $scope.user.id_company)
          .success(function(data) {
            // $scope.users = data;
            // session.users = data;
            session.refreshList(data);
            console.log("chiamata by company ok" + JSON.stringify(data, null, 4));
          })
          .error(function(data) {
            console.log('Error by company: ' + data);
          });

      };

      var users = {};

      bck.deleteUser = function(user) {

        console.log('user in eliminazione: ' + JSON.stringify(user, null, 4));

        $http.post('/api/removeUser', user)
          .success(function(data) {
            session.refreshList(data);
            console.log(data);
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      };

      $scope.updateUser = function() {
        // console.log('olduser è : ' + JSON.stringify(olduser,null,4));
        // console.log('$scope.user è : ' + JSON.stringify($scope.user,null,4));
        $scope.editUser = {};
        $scope.editUser.password = $scope.user.password;
        $scope.editUser.id_access_level = 2;
        $scope.editUser.name = $scope.user.name;
        $scope.editUser.surname = $scope.user.surname;
        $scope.editUser.location = $scope.user.location;
        $scope.editUser.username = $scope.user.username;
        //image

        console.log("editUser   : " + JSON.stringify($scope.editUser, null, 4));
        console.log("$scope.user: " + JSON.stringify($scope.user, null, 4));

        $http.post('/api/updateUser', $scope.editUser)
          .success(function(data) {
            session.refreshList(data);
            console.log(data);
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      }; //end updateUser

    }]);

    app.controller('FormCtrl', ['$scope', '$http', 'session', function($scope, $http, session) {

      //creates new user
      $scope.createUser = function() {
        //using the infos of the logged user, creates the new user
        $scope.newUser = {};
        $scope.newUser.id_company = $scope.user.id_company;
        $scope.newUser.username = $scope.username;
        $scope.newUser.password = $scope.password;
        $scope.newUser.id_access_level = 2;
        $scope.newUser.firstName = $scope.firstName;
        $scope.newUser.lastName = $scope.lastName;
        $scope.newUser.location = $scope.location;
        //image
        console.log("createUser: \n");
        console.log(JSON.stringify($scope.newUser, null, 4));

        session.createUser($scope.newUser);

        // $http.post('/api/createuser', $scope.newUser)
        //   .success(function(data) {
        //     session.refreshList(data);
        //     console.log(data);
        //   })
        //   .error(function(data) {
        //     console.log('Error: ' + data);
        //   });
      };

      //edit existing user
      $scope.updateUser = function() {
        // console.log('olduser è : ' + JSON.stringify(olduser,null,4));
        // console.log('$scope.user è : ' + JSON.stringify($scope.user,null,4));
        $scope.editUser = {};
        $scope.editUser.password = $scope.user.password;
        $scope.editUser.id_access_level = 2;
        $scope.editUser.name = $scope.user.name;
        $scope.editUser.surname = $scope.user.surname;
        $scope.editUser.location = $scope.user.location;
        $scope.editUser.username = $scope.user.username;
        //image

        console.log("editUser   : " + JSON.stringify($scope.editUser, null, 4));
        console.log("$scope.user: " + JSON.stringify($scope.user, null, 4));

        $http.post('/api/updateUser', $scope.editUser)
          .success(function(data) {
            session.refreshList(data);
            console.log(data);
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      }; //end updateUser
    }]);
