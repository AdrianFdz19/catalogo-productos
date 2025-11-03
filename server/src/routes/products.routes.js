import express from 'express'
import { getAllProducts, getFeaturedProducts, getUserFavorites, getPaginatedProducts, getProductById, addToFavorites, removeFromFavorites, addProduct, editProduct } from '../controllers/products.controller.js';
import { authToken } from '../middlewares/auth.middleware.js';
const products = express.Router();

products.post('/', authToken, addProduct);

products.get('/', authToken, getAllProducts);

products.get('/featured', authToken, getFeaturedProducts);

products.get('/paginated', authToken, getPaginatedProducts);

products.get('/favorites', authToken, getUserFavorites);

products.post('/add-favorites', authToken, addToFavorites);

products.post('/remove-favorites', authToken, removeFromFavorites);

products.get('/:id', getProductById);

products.put('/:id', authToken, editProduct);

export default products;