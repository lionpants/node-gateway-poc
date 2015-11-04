// Init/Connect to DB

var mongoose = require('mongoose');

require('./models/pricing');

mongoose.connect('mongodb://localhost/gateway-pricing');

// Init App/Plugins

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var app = express();

app.set('port', process.env.PORT || 3333);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger('dev'));
app.use(cookieParser());

// Init API

var prices = require('./api/prices');

app.use('/prices', prices);

// Start app

app.listen(app.get('port'), function() {
    console.log('Product Pricing API server listening on port ' + app.get('port'));
});