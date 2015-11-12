// Init App/Plugins

var express = require('express');
var cors = require('cors');
var passport = require('passport');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.set('port', process.env.PORT || 1111);

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Needle

var Promise = require('bluebird');
var needle = require('needle');

Promise.promisifyAll(needle);

// Init API

require('./api/auth')(app, needle);

// Check auth before any end points below
app.use(require('./util/checkAuth')(needle));

require('./api/products')(app, needle);

// Start app

app.listen(app.get('port'), function() {
    console.log('Gateway API server listening on port ' + app.get('port'));
});