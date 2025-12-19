const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/agroDB')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

    
    require('./db'); // 🔹 MongoDB connection
    const Product = require('./models/product');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public')); // for images, css, etc.

// Correct route mounting
const productRoutes = require('./routes/products');
app.use('/products', productRoutes); // <-- use plural

app.get('/dashboard', async (req, res) => {
    const products = await Product.find(); // FETCH FROM MONGODB
    res.render('admin/dashboard', { products });
});

app.get('/productedit', async (req, res) => {
    const products = await Product.find(); // FETCH FROM MONGODB
    res.render('admin/productedit', { products });
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
