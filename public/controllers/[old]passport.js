// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// var localStorage = require('localStorage');


// load up the user model
var Company = require('./../../models/companies');

// expose this function to our app using module.exports
module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
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
      console.log('username '+ username);
      User.findOne({
        'username': username
      }, function(err, user) {
        console.log('utenteeeeeee'+JSON.stringify(user,null,4));
        // if there are any errors, return the error before anything else
        if (err)
          return done(err);

        // if no user is found, return the message
        if (!user) {
          console.log(user + ': no user found');
          return done(null, false); // req.flash is the way to set flashdata using connect-flash
        }
        // if the user is found but the password is wrong
        if (!user.validPassword(password)) {
          console.log('wrong password');
          return done(null, false ); // create the loginMessage and save it to session as flashdata
        }
        // all is well, return successful user
        console.log('login success');
        return done(null, user);
      });

    }));

}
