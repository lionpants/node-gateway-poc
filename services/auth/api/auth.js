var User = require('../models/user');

module.exports = function(app) {
    app.post('/register', function(req, res, next) {
        var newUser = new User(req.body);

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
                return res.json({
                    id: user._id,
                    username: user.username
                });
            } else {
                return res.status(403).send('Invalid password.');
            }
        });
    });
};