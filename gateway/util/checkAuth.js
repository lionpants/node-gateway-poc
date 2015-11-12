module.exports = function(needle) {
    return function(req, res, next) {
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
                if (authResponse.statusCode == 200) {
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
}