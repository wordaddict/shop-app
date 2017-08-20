const passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
       done(err, user);
    });
  });
};

passport.use('login', new LocalStrategy(
  (email, password, done) => {
    user.findOne({
      email: email
    }, (err, user) => {
      if (err) {
        return done(err);
      } if (!user) {
        return done(null, false,
        {
          message: "No user has that email!"
        });
      }
      user.checkPassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        } if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false,
            {
              message: "Invalid password."
            });
        }
      });
    });
  }));
