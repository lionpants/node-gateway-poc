// Init App/Plugins

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.use(cors());
app.set('port', process.env.PORT || 1111);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger('dev'));

// Init API

var auth = require('./api/auth');
var products = require('./api/products');

app.use(auth.checkAuth);
app.use('/products', products);

// Start app

app.listen(app.get('port'), function() {
    console.log('Gateway API server listening on port ' + app.get('port'));
});