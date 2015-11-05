module.exports = {
    checkAuth: function(req, res, next) {
        console.log('Authenticating...');

        if (1 == 1) { // Auth check
            console.log('Authentication success!');
            next();
        } else {
            console.log('Authentication failed...');
            res.sendStatus(403);
        }
    }
}