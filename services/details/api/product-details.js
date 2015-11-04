var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');

module.exports = router;

router.route('/')
    .get(function(req, res, next) {
        Product.find().sort({
            name: 'asc'
        }).exec(function(err, products) {
            if (err) return next(err);
            res.send(products);
        });
    });