var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    category: String
});

module.exports = mongoose.model('Product', productSchema);