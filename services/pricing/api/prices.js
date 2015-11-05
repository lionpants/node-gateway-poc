var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pricing = mongoose.model('Pricing');

module.exports = router;

router.route('/')
    .get(function(req, res, next) {
        Pricing.find().exec(function(err, prices) {
            if (err) return next(err);
            res.send(prices);
        });
    })
    .post(function(req, res, next) {
        var pricing = new Pricing(req.body);
        pricing.save(function(err, pricing) {
            if (err) return next(err);
            res.json(pricing);
        });
    });