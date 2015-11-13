var needle = require('needle');
var newerror = require('newerror');

var DuplicateUserError = newerror('DuplicateUserError');
var MisingRegistrationFieldsError = newerror('MisingRegistrationFieldsError');

module.exports = function(app) {
    app.post('/login', function(req, res, next) {
        var loginUser = needle.postAsync('http://localhost:4844/login', {
            username: req.body.username,
            password: req.body.password
        });

        loginUser
            .then(function(loginResponse) {
                var session = loginResponse.body;
                if (session.token) {
                    return res.status(200).send(session.token);
                } else {
                    return res.status(403).send('Login failed.');
                }
            })
            .catch(function(err) {
                return res.status(500).send('Login failed.');
            });
    });

    app.post('/logout', function(req, res, next) {
        var logoutUser = needle.postAsync('http://localhost:4844/logout', {
            token: req.body.token
        });

        logoutUser
            .then(function(registerResponse) {
                return res.sendStatus(200);
            })
            .catch(function(err) {
                return res.status(500).send('Failed to logout user.');
            });
    });

    app.post('/register', function(req, res, next) {
        var registerNewUser = needle.postAsync('http://localhost:4844/register', {
            username: req.body.username,
            password: req.body.password
        });

        registerNewUser
            .then(function(registerResponse) {
                if (registerResponse.statusCode == 409) {
                    throw new DuplicateUserError('User already exists for that username!');
                } else if (registerResponse.statusCode == 400) {
                    throw new MisingRegistrationFieldsError(registerResponse.body);
                }

                return res.sendStatus(200);
            })
            .catch(MisingRegistrationFieldsError, function(err) {
                return res.status(400).send(err);
            })
            .catch(DuplicateUserError, function(err) {
                return res.status(409).send(err);
            })
            .catch(function(err) {
                return res.status(500).send('Failed to register user.');
            });
    });

    this.checkAuth = function(req, res, next) {
        var authHeader = req.headers['authorization'];

        if (!authHeader) {
            console.log('Authentication header missing...');
            return res.sendStatus(403);
        }

        var token = authHeader.split(' ')[1];

        if (!token) {
            console.log('Token missing...');
            return res.sendStatus(403);
        }

        console.log('Authenticating...');
        console.log('Auth Header: ' + authHeader);
        console.log('Token: ' + token);

        var checkAuth = needle.postAsync('http://localhost:4844/auth', {
            token: token
        });

        checkAuth
            .then(function(authResponse) {
                if (registerResponse.statusCode == 200) {
                    console.log('Authentication success!');
                    return next();
                } else {
                    console.log('Authentication failed: ' + authResponse.body);
                    return res.sendStatus(403);
                }
            })
            .catch(function(err) {
                console.log('Failed to communicate with auth server...')
                return res.sendStatus(403);
            });
    }
};