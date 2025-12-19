const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET /products
router.get('/', async (req, res) => {
    try {
        let { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        let filter = {};
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        res.render('products', {
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            query: req.query,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Show add form
router.get('/new', (req, res) => {
    res.render('new');
});

// Add product
router.post('/', async (req, res) => {
    try {
        const { name, category, price, image } = req.body;
        const product = new Product({ name, category, price, image });
        await product.save();
        res.redirect('/products');
    } catch (err) {
        res.status(500).send('Error adding product: ' + err.message);
    }
});

// Export at the very end
module.exports = router;
