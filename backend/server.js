const express = require('express');
const sequelize = require('./sequelize');
const Product = require('./models/Product');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node Project API',
            version: '1.0.0',
            description: 'API documentation',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local server',
            },
        ],
    },
    apis: ['./server.js', , './models/*.js'], // Points to the file where API documentation is written
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Endpoints

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
app.get('/api/product/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product details' });
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Error creating product
 */
app.post('/products', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.update(req.body);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Database Sync
sequelize.sync({ alter: true })
    .then(() => console.log('Database & tables synced!'))
    .catch(err => console.error('Error syncing database:', err));

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - type
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: The product ID
 *         name:
 *           type: string
 *           description: The name of the product
 *         type:
 *           type: string
 *           description: The type of the product
 *         score:
 *           type: string
 *           description: The product score
 *         status:
 *           type: string
 *           description: The product status
 *         volumes:
 *           type: integer
 *           nullable: true
 *           description: The number of volumes (nullable)
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: List of genres
 *         demographics:
 *           type: array
 *           items:
 *             type: string
 *           description: List of demographics
 *         authors:
 *           type: array
 *           items:
 *             type: string
 *           description: List of authors
 *         description:
 *           type: string
 *           description: The product description
 *         price:
 *           type: string
 *           description: The product price
 *         image:
 *           type: string
 *           description: The product image URL
 *         url:
 *           type: string
 *           description: The product URL
 */
