module.exports = {
    checkAuth: function(req, res, next) {
        console.log('Authenticating...');
        console.log('Authentication success!');
        next();
    }
}