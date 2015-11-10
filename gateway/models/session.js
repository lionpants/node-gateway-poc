var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    userId: String,
    username: String
});

module.exports = mongoose.model('Session', sessionSchema);