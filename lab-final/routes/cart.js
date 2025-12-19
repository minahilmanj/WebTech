// Example: lab-final/routes/cart.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.post('/add-to-cart/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) return res.send('Product not found.');

    let cart = req.session.cart || [];

    // Check for duplicate
    const existingItem = cart.find(item => item._id == product._id);
    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity
    } else {
        cart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    req.session.cart = cart;
    res.redirect('/'); // Or wherever you want to redirect
});

module.exports = router;
