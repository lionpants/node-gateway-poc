var __ = require('lodash');
var Promise = require('bluebird');

module.exports = function(app, needle) {
    var productURI = 'localhost:2222/product-details';
    var pricingURI = 'localhost:3333/prices';

    app.route('/products')

    // Get all products
    .get(function(req, res, next) {
        var getProducts = needle.getAsync(productURI);
        var getPricing = needle.getAsync(pricingURI).catch(function(err) {
            console.log('Pricing API call failed...');
            return null;
        });

        Promise.join(getProducts, getPricing, function(productsResponse, pricingResponse) {
                var products = productsResponse.body;
                var pricings = pricingResponse ? pricingResponse.body : null;

                __.forEach(products, function(product) {
                    if (pricings) {
                        var pricing = __.find(pricings, function(pricing) {
                            return pricing.productId == product._id;
                        });
                        if (pricing) {
                            product.price = pricing.price;
                        }
                    } else {
                        product.price = "Pricing not available... :(";
                    }
                });

                res.send(products);
            })
            .catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
    })

    // Post a new Product
    .post(function(req, res, next) {
        var productToPost = req.body;
        var postNewProduct = needle.postAsync(productURI, productToPost);

        postNewProduct
            .then(function(productResponse) {
                var newProduct = productResponse.body;
                var pricingData = {
                    productId: newProduct._id,
                    price: productToPost.price
                };

                return needle.postAsync(pricingURI, pricingData);
            })
            .then(function(pricingResponse) {
                res.sendStatus(200);
            })
            .catch(function(err) {
                // Need some sort of cleanup here, depending on which steps failed...
                console.log(err);
                res.sendStatus(500);
            });
    });
};