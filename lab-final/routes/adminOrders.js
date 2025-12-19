const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { adminOnly } = require('../middleware/auth');

// Admin Orders Dashboard
router.get('/orders', adminOnly, async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('lab-final/admin-orders', { orders });
});

// Confirm an order
router.post('/orders/:id/confirm', adminOnly, async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: 'Confirmed' });
    res.redirect('/admin/orders');
});

// Cancel an order
router.post('/orders/:id/cancel', adminOnly, async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
    res.redirect('/admin/orders');
});

module.exports = router;
