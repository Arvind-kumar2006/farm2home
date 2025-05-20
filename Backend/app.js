const express = require('express');
require('dotenv').config();
const connectDB = require('./Connection/connectDB');
const userRoutes = require('./Router/User');
const productRoutes = require('./Router/Product');
const orderRoutes = require('./Router/Order');
const cors = require('cors');

const app = express();

connectDB();

app.use(express.json());
app.use(cors()); 

app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes); 

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});