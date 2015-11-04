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
                console.log('response from details microservice');
                var products = JSON.parse(productData);
                var request = http.request(pricingOptions, function(response) {
                    var pricingData = '';

                    response.on('data', function(chunk) {
                        pricingData += chunk;
                    });

                    response.on('end', function() {
                        console.log('response from pricing microservice');
                        var pricings = JSON.parse(pricingData);
                        __.forEach(products, function(product) {
                            var pricing = __.find(pricings, function(pricing) {
                                return pricing.productId == product._id;
                            });
                            if (pricing) {
                                product.price = pricing.price;
                            }
                        });
                        console.log(products);
                        res.send(products);
                    });
                });

                request.on('error', function(e) {
                    console.log('failed to connect to pricing: ' + e);
                    console.log(products);
                    res.send(products);
                });

                request.end();
            });
        }).end();
    });