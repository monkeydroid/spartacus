// public/core.js
var app = angular.module('administration', []);

var DEBUG = false;

app.factory('session', ['$rootScope', '$window', '$http', function($rootScope, $window, $http) {
    var session = {};

    session.refreshList = function(data) {
        //$rootScope.companies
        $rootScope.users = data;
    };

    session.createUser = function(data) {
        $http.post('/api/createUser', data)
            .success(function(data) {
                $rootScope.formUser = {}; // clear the form so our user is ready to enter another

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

    session.updateUser = function(userDataUpdated) {

        $http.post('/api/updateUser', userDataUpdated)
            .success(function(userDataUpdated) {
                // $rootScope.formUser = {}; // clear the form so our user is ready to enter another

                $rootScope.users = userDataUpdated;
                session.users = userDataUpdated;
                console.log("success" + userDataUpdated);
            })
            .error(function(userDataUpdated) {
                console.log('Error in controller update: ' + JSON.stringify(userDataUpdated, null, 4));
                if (userDataUpdated != null && userDataUpdated.code === 11000) {
                    //if we edit a user and the new is equal to another one
                    $rootScope.duplicate = true;
                }
            });
    };

    session.sendGuide = function(user) {
        //user on gdrive: headappdrive 
        //  console.log("sendguide in administrationController.js lanciata: telegramChatId " + user.telegramChatId);
        $http.get(
            "https://api.telegram.org/bot348581435:AAEpNO6NnVI2w7T8KalIvzl9fl7zS9SRjAU/sendmessage?" +
            //"text=<a href='https://drive.google.com/file/d/0By88O3F3hpTRTDEwNXdaS3FWSW8/view?usp=sharing'>Eye4Task User Guide</a>" +
            "text=<a href='https://www.dropbox.com/s/c8cg991eesopp94/Eye4Task_User_Guide_standard.pdf?dl=0'>Eye4Task User Guide</a>" +
            "&parse_mode=html" +
            "&chat_id=" + user.telegramChatId);
    };

    session.sendCheclist = function(user) {
        console.log("check in administrationController.js lanciata: telegramChatId " + user.telegramChatId);
        $http.get(
            "https://api.telegram.org/bot348581435:AAEpNO6NnVI2w7T8KalIvzl9fl7zS9SRjAU/sendmessage?" +
            "text=<a href='https://webclient.moreapp.com/%23/form/592d564ff1396c76c260d19b'>Checklist Example</a>" +
            "&parse_mode=html" +
            "&chat_id=" + user.telegramChatId);
    };

    return session;
}]);

app.controller('AdministrationController', ['$scope', '$http', 'session', function($scope, $http, session) {

    var user = {};
    var users = {};
    var bck = this;

    $scope.init = function(_user) {
        console.log('administrationController - user logged with company data is _user : ' + JSON.stringify(_user, null, 4));

        $scope.user = _user;

        $http.get('/api/getusersbycompany/' + $scope.user.company_id)
            .success(function(data) {
                session.refreshList(data);
                if (DEBUG) console.log("chiamata by company ok" + JSON.stringify(data, null, 4));
            })
            .error(function(data) {
                console.log('Error by company: ' + JSON.stringify(data, null, 4));
            });

    };

    //Update Existing User
    bck.updateUser = function(user) {
        console.log('user in update: ' + JSON.stringify(user, null, 4));
        session.updateUser(user);
    }; //end updateUser

    //Delete existing user
    bck.deleteUser = function(user) {
        console.log('user in eliminazione: ' + JSON.stringify(user, null, 4));

        $http.post('/api/removeUser', user)
            .success(function(data) {
                session.refreshList(data);
                console.log(data);
            })
            .error(function(err, data) {
                console.log('Error: ' + err);
            });
    };

    //Create New User
    $scope.createUser = function() {
        //using the infos of the logged user, creates the new user
        $scope.newUser = {};
        $scope.newUser.id_company = $scope.user.id_company;
        $scope.newUser.username = $scope.username;
        $scope.newUser.password = $scope.password;
        $scope.newUser.firstName = $scope.firstName;
        $scope.newUser.lastName = $scope.lastName;
        $scope.newUser.phoneNumber = $scope.phoneNumber;
        $scope.newUser.location = $scope.location;
        //image
        $scope.newUser.id_access_level = $scope.id_access_level;

        console.log('createUser: ' + JSON.stringify($scope.newUser, null, 4));

        session.createUser($scope.newUser);
    };

    //Change user action to 0
    bck.standby = function(user) {
        console.log('user in update: ' + JSON.stringify(user, null, 4));
        user.action = 0;
        session.updateUser(user);
    };

    //Change user action to 1
    bck.liveData = function(user) {
        console.log('user in update: ' + JSON.stringify(user, null, 4));
        user.action = 1;
        session.updateUser(user);
    };

    //Change user action to 2
    bck.getLive = function(user) {
        console.log('user in update: ' + JSON.stringify(user, null, 4));
        user.action = 2;
        session.updateUser(user);
    };

    //Change user action to 3
    bck.checklist = function(user) {
        console.log('user in update: ' + JSON.stringify(user, null, 4));
        //user.action = 3;
        session.sendCheclist(user);
        //session.updateUser(user);
    };

    //Send guide
    bck.sendGuide = function(user) {
        console.log('user in update: ' + JSON.stringify(user, null, 4));
        if (user.telegramChatId) {
            session.sendGuide(user);
        } else {
            console.log("Errore: l'utente non ha un telegramChatId.");
            //implement something like a popup that warns the user for the error.
        }
    };

}]);

app.controller('CreateFormCtrl', ['$scope', '$http', 'session', function($scope, $http, session) {

    //creates new user
    $scope.createUser = function() {
        //using the infos of the logged user, creates the new user
        $scope.newUser = {};
        $scope.newUser.id_company = $scope.user.id_company;
        $scope.newUser.username = $scope.username;
        $scope.newUser.password = $scope.password;
        $scope.newUser.firstName = $scope.firstName;
        $scope.newUser.lastName = $scope.lastName;
        $scope.newUser.location = $scope.location;
        //image
        $scope.newUser.id_access_level = $scope.id_access_level;

        console.log('createUser: ' + JSON.stringify($scope.newUser, null, 4));

        session.createUser($scope.newUser);
    };

}]);