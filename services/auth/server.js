// Init/Connect to DB

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gateway-auth');

// Init App/Plugins

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.set('port', process.env.PORT || 4844);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger('dev'));

// Init API

require('./api/auth')(app);

// Start app

app.listen(app.get('port'), function() {
    console.log('Auth server listening on port ' + app.get('port'));
});