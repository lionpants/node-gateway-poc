var mongoose = require('mongoose');

var pricingSchema = new mongoose.Schema({
    productId: String,
    price: String
});

mongoose.model('Pricing', pricingSchema);