import express from 'express'
import { addProduct, getAllProducts, getFeaturedProducts, getPaginatedProducts, getProductById } from '../controllers/products.controller.js';
const products = express.Router();

products.get('/', getAllProducts);

products.get('/featured', getFeaturedProducts);

products.get('/paginated', getPaginatedProducts);

products.get('/:id', getProductById);

products.post('/', addProduct);

export default products;