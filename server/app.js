import dotenv from 'dotenv/config';
import express from 'express';
import cors from 'cors';

import connectToDatabase from './database/mongodb.js';
import productsRouter from './routes/products.route.js';
import cartRouter from './routes/cart.route.js';
import checkoutRouter from './routes/checkout.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors( {origin: 'http://localhost:5173'} ));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the E-Commerce Cart API.' });
})

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/checkout', checkoutRouter);

app.listen(PORT, async () => {
    console.log(`Server is up and running 🏃 on port ${PORT}`);
    await connectToDatabase();
});