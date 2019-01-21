var ctrlPanelApp = angular.module('ctrlPanel', []);

var DEBUG = false;

/*Useful functions here*/

ctrlPanelApp.controller('MainCtrl', ['$scope','$http',function($scope, $http) {

  var cpnl = this;

  //retrieve the current user data, which is an array of objects filled with 1 object:
  // data { [<user data: id,operator,password,etc>] }
  //and saves in a scope variable an array of objects,
  //each of these containing the couple key:value:
  //$scope.result { [_id:3] , [operator:headapp] , [password:...] , ...etc }
  $http.get('/api/getLocalUserInfo').success(function(data) {

    //save object in variable
    $scope.user = data;
    $scope.result = [];
    //create an array of strings containing the keys of the object:
    //keys { "_id", "operator", "password",...}
    var keys = Object.keys($scope.user);
    if (DEBUG) console.log('keys = '+keys);
    var i=0;
    //for each property in my user
    for ( var prop in $scope.user) {
      //select which property not to show
      if (  keys[i].localeCompare("_id"             ) != 0  &
            keys[i].localeCompare("password"        ) != 0  &
            keys[i].localeCompare("id_access_level"    ) != 0  &
            keys[i].localeCompare("lastModified"    ) != 0
          ) {
        //save the i-th key of keys
        var stringkey = keys[i];
        if (DEBUG) console.log('current key: '+stringkey);
        //create the object with key+property
        var obj = { [stringkey] : $scope.user[prop] };
        $scope.result.push(obj);
      }
      i++;
    }
    if (DEBUG) console.log('$scope.result = ' + JSON.stringify($scope.result));
  })
  .error(function(data) {
    console.log('MainCtrl Error in rtcCtrlPanel: ' + data);
  });




}]);
