// Init/Connect to DB

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gateway-session');

// Init App/Plugins

var express = require('express');
var session = require('express-session');
var cors = require('cors');
var passport = require('passport');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.set('port', process.env.PORT || 1111);
app.use(cors());
app.use(session({
    secret: 'breadsticks',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger('dev'));

// Passport

var Promise = require('bluebird');
var needle = require('needle');

Promise.promisifyAll(needle);

require('./passport/init')(app, passport);
require('./passport/strategies')(app, passport, needle);

// Init API

var auth = require('./api/auth');
auth(app, passport);
app.use(auth.checkAuth);

require('./api/products')(app, needle);

// Start app

app.listen(app.get('port'), function() {
    console.log('Gateway API server listening on port ' + app.get('port'));
});