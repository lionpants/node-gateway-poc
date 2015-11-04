var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    category: String
});

mongoose.model('Product', productSchema);