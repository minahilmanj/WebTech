const express = require('express');
const router = express.Router();
const Product = require('../models/products');

// Admin Dashboard
router.get('/', async (req, res) => {
    const count = await Product.countDocuments();
    res.render('admin/dashboard', { count, layout: 'layouts/admin' });
});

/* =====================
   PRODUCT CRUD
===================== */

// READ – list products
router.get('/products', async (req, res) => {
    const products = await Product.find();
    res.render('admin/products', { products, layout: 'layouts/admin' });
});

// CREATE – form
router.get('/products/add', (req, res) => {
    res.render('admin/add-product', { layout: 'layouts/admin' });
});

// CREATE – save
router.post('/products/add', async (req, res) => {
    await Product.create(req.body);
    res.redirect('/admin/products');
});

// UPDATE – form
router.get('/products/edit/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('admin/edit-product', { product, layout: 'layouts/admin' });
});

// UPDATE – save
router.post('/products/edit/:id', async (req, res) => {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/products');
});

// DELETE
router.post('/products/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
});

module.exports = router;
