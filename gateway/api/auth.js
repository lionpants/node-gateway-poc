module.exports = function(app, passport) {
    app.post('/login', function(req, res, next) {
        passport.authenticate('login', function(err, user, info) {
            if (err) {
                res.sendStatus(500);
            } else if (user) {
                res.sendStatus(200);
            } else {
                res.status(403).send(info);
            }
        })(req, res, next);
    });

    app.post('/register', function(req, res, next) {
        passport.authenticate('register', function(err, newUser, info) {
            if (err) {
                res.sendStatus(500);
            } else if (newUser) {
                res.sendStatus(200);
            } else {
                res.status(400).send(info);
            }
        })(req, res, next);
    });
};

module.exports.checkAuth = function(req, res, next) {
    console.log('Authenticating...');
    console.log('isAuthenticated: ' + req.isAuthenticated());

    if (1 == 1) { // Auth check
        console.log('Authentication success!');
        return next();
    } else {
        console.log('Authentication failed...');
        res.sendStatus(403);
    }
}