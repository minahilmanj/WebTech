// Middleware to check if cart is not empty
function checkCartNotEmpty(req, res, next) {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        // Prevent checkout
        return res.send('Cart is empty. Cannot proceed to checkout.');
        // Or redirect: return res.redirect('/');
    }
    next();
}

// Middleware to allow only admin
function adminOnly(req, res, next) {
    const userEmail = req.session.userEmail || ''; // Make sure you store admin email in session
    if (userEmail !== 'admin@shop.com') {
        return res.send('Access denied. Admins only.');
        // Or redirect: return res.redirect('/');
    }
    next();
}

module.exports = { checkCartNotEmpty, adminOnly };
