const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userSchema');

// Configure local strategy for user authentication
const local = new LocalStrategy({ usernameField: 'email' }, function (
  email,
  password,
  done
) {
  // Find the user in the database by email
  User.findOne({ email }, function (error, user) {
    if (error) {
      console.log(`Error in finding user: ${error}`);
      return done(error);
    }

    // If the user is not found or password is incorrect
    if (!user || !user.isPasswordCorrect(password)) {
      console.log('Invalid Username/Password');
      return done(null, false);
    }
    return done(null, user); // User authenticated successfully
  });
});

passport.use('local', local);

// Serialize user for session storage
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log('Error in finding user--> Passport');
      return done(err);
    }
    return done(null, user);
  });
});

// Middleware to check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/users/signin');
};

// Middleware to set authenticated user for views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};
