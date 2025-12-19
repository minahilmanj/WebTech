const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { checkCartNotEmpty } = require('../middleware/auth');

// Checkout Page
router.get('/', checkCartNotEmpty, (req, res) => {
    const cart = req.session.cart || [];
    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);
    res.render('lab-final/checkout', { cart, total });
});

// Place Order
router.post('/', checkCartNotEmpty, async (req, res) => {
    const { customerName, email } = req.body;
    const cart = req.session.cart || [];

    let totalAmount = 0;
    const items = cart.map(item => {
        totalAmount += item.price * item.quantity;
        return {
            product: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        };
    });

    const order = new Order({ customerName, email, items, totalAmount });
    await order.save();

    req.session.cart = [];
    res.redirect(`/checkout/confirmation/${order._id}`);
});

// Order Confirmation
router.get('/confirmation/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.render('lab-final/order-confirmation', { order });
});

module.exports = router;
