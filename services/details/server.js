// Init/Connect to DB

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gateway-products');

// Init App/Plugins

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.set('port', process.env.PORT || 2222);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger('dev'));

// Init API

require('./api/product-details')(app);

// Start app

app.listen(app.get('port'), function() {
    console.log('Product Detail API server listening on port ' + app.get('port'));
});