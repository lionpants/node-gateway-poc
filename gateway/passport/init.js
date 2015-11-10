var Session = require('../models/session');

module.exports = function(app, passport) {
    passport.serializeUser(function(session, done) {
        console.log('serialize!');
        done(null, session);
    });

    passport.deserializeUser(function(id, done) {
        console.log('deserialize!');
        done(null, id);
        // Session.findById(id, function(err, session) {
        //     done(err, session);
        // });
    });
};