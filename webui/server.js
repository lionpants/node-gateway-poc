// Init App/Plugins

var express = require('express');
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cors());
app.set('port', process.env.PORT || 8888);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Start app

app.listen(app.get('port'), function() {
    console.log('Web UI server listening on port ' + app.get('port'));
});