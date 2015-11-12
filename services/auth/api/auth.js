var User = require('../models/user');
var Session = require('../models/session');

module.exports = function(app) {
    app.post('/auth', function(req, res, next) {
        var token = req.body.token;

        if (!token) {
            return res.status(400).send('Invalid token.');
        }

        // Check if the token is valid
        Session.findOne({
            'token': token
        }, function(err, session) {
            if (err) return next(err);

            if (!session) {
                return res.status(403).send('Session not found!');
            }

            return res.status(200).send();
        });
    });

    app.post('/register', function(req, res, next) {
        var newUser = new User(req.body);

        if (!newUser.username || !newUser.password) {
            return res.status(400).send('Username and password are required.');
        }

        // Check for duplicate username
        User.findOne({
            'username': newUser.username
        }, function(err, user) {
            if (err) return next(err);

            if (user) {
                return res.sendStatus(409);
            }

            newUser.password = newUser.generateHash(newUser.password);
            newUser.save(function(err, user) {
                if (err) return next(err);
                res.json(user);
            });
        });
    });

    app.post('/login', function(req, res, next) {
        var loginParams = req.body;

        User.findOne({
            'username': loginParams.username
        }, function(err, user) {
            if (err) return next(err);

            if (!user) {
                return res.status(404).send('User not found.');
            }

            if (user.validPassword(loginParams.password)) {
                // Use existing session if it exists
                Session.findOne({
                    'userId': user._id
                }, function(err, session) {
                    if (err) return next(err);
                    if (!session) {
                        session = new Session();
                    }

                    session.userId = user._id;
                    session.token = session.generateToken();

                    session.save(function(err, session) {
                        if (err) return next(err);
                        return res.json({
                            token: session.token
                        });
                    })
                });
            } else {
                return res.status(403).send('Invalid password.');
            }
        });
    });

    app.post('/logout', function(req, res, next) {
        var logoutParams = req.body;

        Session.findOne({
            'token': logoutParams.token
        }, function(err, session) {
            if (err) return next(err);

            if (!session) {
                return res.status(404).send('Session not found.');
            }

            session.remove(function(err) {
                if (err) return next(err);
                return res.sendStatus(200);
            })
        });
    });
};