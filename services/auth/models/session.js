var mongoose = require('mongoose');
var uuid = require('node-uuid');

var sessionSchema = new mongoose.Schema({
    userId: String,
    token: String
});

sessionSchema.methods.generateToken = function() {
    return uuid.v1();
};

module.exports = mongoose.model('Session', sessionSchema);