// passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = function(passport) {
    passport.use(new LocalStrategy(async function(username, password, done) {
        try {
      
            const user = await User.findOne({ username: username });
       
            if (!user) {
                return done(null, false, { message: 'Invalid username or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {

                return done(null, false, { message: 'Invalid username or password' });
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
