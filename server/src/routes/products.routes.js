import express from 'express'
import { getAllProducts, getFeaturedProducts, getUserFavorites, getPaginatedProducts, getProductById, addToFavorites, removeFromFavorites, addProduct, editProduct, deleteProduct } from '../controllers/products.controller.js';
import { authToken, optionalAuth } from '../middlewares/auth.middleware.js';
const products = express.Router();

products.post('/', authToken, addProduct);

products.get('/', optionalAuth, getAllProducts);

products.get('/featured', optionalAuth, getFeaturedProducts);

products.get('/paginated', optionalAuth, getPaginatedProducts);

products.get('/favorites', authToken, getUserFavorites);

products.post('/add-favorites', authToken, addToFavorites);

products.post('/remove-favorites', authToken, removeFromFavorites);

products.get('/:id', optionalAuth, getProductById);

products.put('/:id', authToken, editProduct);

products.delete('/:id', authToken, deleteProduct);

export default products;