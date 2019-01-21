// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// var localStorage = require('localStorage');

// load up the user model
var Company = require('./../../models/companies');
var User = require('./../../models/users');

//DEBUG
var DEBUG = false;

// expose this function to our app using module.exports
module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(dataPassed, done) {
    //if (DEBUG) console.log('serialize: company and user is '+JSON.stringify(companyAndUser,null,4));
    done(null, dataPassed);
  });

  // used to deserialize the user
  passport.deserializeUser(function(dataPassed, done) {
    ///if (DEBUG) console.log('deserialize: company and user is '+JSON.stringify(companyAndUser,null,4));
    // Company.findOne({
    //     '_id': dataPassed.company_id , 'users._id' : dataPassed.user._id
    // },
    ///{ 'users.$' : 1 } , //what to return: { 'users.$' : 1 } means the 1 result of what found in 'users' array
    // function(err, dataPassed) {
      if (DEBUG) console.log('dataPassed before done of deserialize: ' + JSON.stringify(dataPassed,null,4));
      done(null, dataPassed);
    // });
  });

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with user and password from our form
      // find a user whose username is the same as the form
      // we are checking to see if the user trying to login already exists

      if (DEBUG) {
        console.log('company shortname: '+req.body.company_shortname);
        console.log('username '+ username);
        console.log('password '+ password +'\n\n');
      }

      //find the company with this name that contains this user...
      Company.findOne(
        {    'shortname': req.body.company_shortname , 'users.username' : username
        },
        //{ 'users.$' : 1 } ,
      function(err, companyAndUsers) {
        // console.log('company+users restituita dalla query: '+ JSON.stringify( companyAndUsers,null,4) +'\n\n' );

        //...then find the user in the company found before, whose username is the one specified.
        if (companyAndUsers) {

          var userFound = companyAndUsers.users.filter(
            function(user) {
              return user.username === username;
            }
          ).pop();

          var currentCompany = new Company(companyAndUsers);
          var currentUser = new User(userFound);
          //creating an object with user,company shortname and company _id
          var dataPassed = {};
          dataPassed.company_shortname = req.body.company_shortname;
          dataPassed.company_id = companyAndUsers._id;
          dataPassed.user = currentUser;
          if (DEBUG) {
            console.log('currentCompany is' + JSON.stringify(currentCompany,null,4));
            console.log('currentUser is' + JSON.stringify(currentUser,null,4));
          }
        }



        // if there are any errors, return the error before anything else
        if (err)
          return done(err);

        // if no user is found, return the message
        if (!dataPassed) {
          console.log('No company or user found');
          return done(null, false); // req.flash is the way to set flashdata using connect-flash
        }

        // if the user is found but the password is wrong
        if (!dataPassed.user.validPassword(password)) {
          console.log('wrong password for the username ' + JSON.stringify(dataPassed.user.username,null,4));
          return done(null, false ); // create the loginMessage and save it to session as flashdata
        }
        // all is well, return successful company AND user
        console.log('login success');
        ///currentCompany.loggeduser = currentUser;
        ///console.log('currentCompany:' + JSON.stringify(currentCompany,null,4));
        ///console.log('currentCompany.loggeduser:' + JSON.stringify(currentCompany.loggeduser,null,4));
        return done(null, dataPassed);
      }); //end of Company.findOne

    })); //end of passport.use

} //end of module.exports
