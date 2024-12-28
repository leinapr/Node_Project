const express = require('express');
const sequelize = require('./sequelize');
const Product = require('./models/Product');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (if needed for public assets like images)
app.use(express.static(__dirname + '/public'));

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products); // Send the list of products as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Get a specific product by ID
app.get('/api/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product); // Send the product data as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product details' });
    }
});

// Sync models with the database
sequelize.sync({ alter: true }) // Alter schema without dropping tables
    .then(() => {
        console.log('Database & tables synced!');
    })
    .catch(err => console.error('Error syncing database:', err));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
