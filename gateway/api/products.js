var __ = require('lodash');
var http = require('http');
var express = require('express');
var router = express.Router();

module.exports = router;

router.route('/')
    .get(function(req, res, next) {
        var productOptions = {
            host: 'localhost',
            port: '2222',
            path: '/product-details'
        };

        var pricingOptions = {
            host: 'localhost',
            port: '3333',
            path: '/prices'
        };

        http.request(productOptions, function(response) {
            var productData = '';

            response.on('data', function(chunk) {
                productData += chunk;
            });

            response.on('end', function() {
                var products = JSON.parse(productData);
                var request = http.request(pricingOptions, function(response) {
                    var pricingData = '';

                    response.on('data', function(chunk) {
                        pricingData += chunk;
                    });

                    response.on('end', function() {
                        var pricings = JSON.parse(pricingData);
                        __.forEach(products, function(product) {
                            var pricing = __.find(pricings, function(pricing) {
                                return pricing.productId == product._id;
                            });
                            if (pricing) {
                                product.price = pricing.price;
                            }
                        });
                        res.send(products);
                    });
                });

                request.on('error', function(e) {
                    console.log('failed to connect to pricing: ' + e);
                    console.log(products);
                    __.forEach(products, function(product) {
                        product.price = 'Pricing not available :(';
                    });
                    res.send(products);
                });

                request.end();
            });
        }).end();
    })
    .post(function(req, res, next) {
        var postData = JSON.stringify(req.body);

        var productOptions = {
            host: 'localhost',
            port: '2222',
            path: '/product-details',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        var detailPost = http.request(productOptions, function(r) {
            r.setEncoding('utf8');
            r.on('data', function(chunk) {
                var savedProduct = JSON.parse(chunk);
                var pricingData = JSON.stringify({
                    productId: savedProduct._id,
                    price: req.body.price
                });

                var pricingOptions = {
                    host: 'localhost',
                    port: '3333',
                    path: '/prices',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(pricingData)
                    }
                };

                var pricePost = http.request(pricingOptions, function(r) {
                    r.setEncoding('utf8');
                    r.on('data', function(chunk) {
                        res.sendStatus(200);
                    });
                });

                pricePost.on('error', function(e) {
                    res.sendStatus(500);
                });

                pricePost.write(pricingData);
                pricePost.end();
            });
        });

        detailPost.on('error', function(e) {
            res.sendStatus(500);
        });

        detailPost.write(postData);
        detailPost.end();
    });