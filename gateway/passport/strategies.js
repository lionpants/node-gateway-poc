var newerror = require('newerror');
var LocalStrategy = require('passport-local').Strategy;

var DuplicateUserError = newerror('DuplicateUserError');
var LoginFailedError = newerror('DuplicateUserError');

module.exports = function(app, passport, needle) {
    passport.use('register', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            var registerNewUser = needle.postAsync('http://localhost:4844/register', {
                username: username,
                password: password
            });

            registerNewUser
                .then(function(registerResponse) {
                    if (registerResponse.statusCode == 409) {
                        throw new DuplicateUserError('User already exists for that username!');
                    }

                    var newUser = registerResponse.body;
                    return done(null, newUser);
                })
                .catch(DuplicateUserError, function(err) {
                    return done(null, false, err);
                })
                .catch(function(err) {
                    return done(null, false, 'Failed to register user.');
                });
        }));

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            var loginUser = needle.postAsync('http://localhost:4844/login', {
                username: username,
                password: password
            });

            loginUser
                .then(function(loginResponse) {
                    if (loginResponse.body.id) {
                        return done(null, loginResponse.body);
                    } else {
                        return done(null, false, 'Login failed.');
                    }
                })
                .catch(function(err) {
                    return done(null, false, 'Login failed.');
                });
        }));
};