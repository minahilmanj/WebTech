const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1:27017/agroDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const products = [
  {
    name: 'AGRO Smart P200',
    price: 500,
    category: 'Machines',
    image: '/images/home_agro_product1s.jpg',
    description: 'Smart agricultural machine'
  },
  {
    name: 'AGRO Monster 2300',
    price: 900,
    category: 'Machines',
    image: '/images/home_agro_product2s.jpg',
    description: 'Heavy duty agro machine'
  },
  {
    name: 'AGRO Plow 22/100',
    price: 300,
    category: 'Tools',
    image: '/images/home_agro_product3s.jpg',
    description: 'High quality plow'
  }
];

async function seedDB() {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Products Seeded');
  mongoose.connection.close();
}

seedDB();
