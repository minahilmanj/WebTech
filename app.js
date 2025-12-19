const express = require('express');
const path = require('path');
const app = express();

require('./db'); // 🔹 MongoDB connection
const Product = require('./models/product');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const checkoutRoutes = require('./lab-final/routes/checkout');
app.use('/checkout', checkoutRoutes);



// 🔹 Landing page with products
app.get('/', async (req, res) => {
    const products = await Product.find(); // FETCH FROM MONGODB
    res.render('pages/LandingPage', { products });
});

app.get('/products', async (req, res) => {
    const products = await Product.find(); // FETCH FROM MONGODB
    res.render('admin/products', { products });
});

app.get('/checkout', (req, res) => 
    res.render('pages/BootstrapCheckout')
);

app.get('/add-product', (req, res) => 
    res.render('admin/add-product')
);
app.listen(3000, () =>
    console.log('Server running on http://localhost:3000')
);


// Correct route mounting
const productRoutes = require('./routes/products');
app.use('/products', productRoutes); // <-- use plural

app.get('/dashboard', async (req, res) => {
    const products = await Product.find(); // FETCH FROM MONGODB
    const count = products.length;
    res.render('admin/dashboard', { count });
});

app.get('/productedit', async (req, res) => {
    const products = await Product.find(); // FETCH FROM MONGODB
    res.render('admin/productedit', { products });
});



app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});