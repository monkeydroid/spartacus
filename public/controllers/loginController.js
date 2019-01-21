var app = angular.module('loginCtrl', [],
  function($locationProvider) {
    $locationProvider.html5Mode(true);
  }
);

app.controller('LoginController', ['$scope', '$window' , '$location' , function($scope, $window, $location) {

  // $scope.save = function() {
  //   $localStorage.message = "Hello World";
  // }
  //
  // $scope.load = function() {
  //   $scope.data = $localStorage.message;
  // }
  //
  // $scope.loginPressed = function() {
  //   $scope.save();
  //   $localStorage.message = "Hello World";
  //
  //   console.log('ciao+ ' + $localStorage.message);
  //
  //
  // };

  $scope.loginPressed = function() {

    user = {
      name: $scope.user,
      op_ident: "",
      password: $scope.password
    };
    //clear form fields
    // $scope.user = null;
    // $scope.password = null;


    // Check browser support
    if (typeof(Storage) !== "undefined") {
      // Store
      localStorage.setItem( 'local_user' ,JSON.stringify(
        {
          "name" : user.name ,
          "password" : user.password,
          "op.ident" : user.op_ident,
          "location" : "Rome"
        }
      ));

      // Retrieve
      // var stringanag = localStorage.getItem('anag');
      // anagObj = JSON.parse(stringanag);

      //print in a div on LOGIN PAGE
      // document.getElementById("currentUserData")
      // .innerHTML = "<div> <p>"+anagObj.name+"</p> <p>"+anagObj.location+"</p> </div>";
    }
    else {
      document.getElementById("currentUserData").innerHTML = "Sorry, your browser does not support Web Storage...";
    }

    //go to main page
     $window.location.href = '/';
  };


}]);
