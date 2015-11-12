var mongoose = require('mongoose');

var pricingSchema = new mongoose.Schema({
    productId: String,
    price: String
});

module.exports = mongoose.model('Pricing', pricingSchema);