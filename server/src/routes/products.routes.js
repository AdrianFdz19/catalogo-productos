import express from 'express'
import { getAllProducts, getFeaturedProducts, getUserFavorites, getPaginatedProducts, getProductById, addToFavorites, removeFromFavorites, getFeaturedProductsServer } from '../controllers/products.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const products = express.Router();

products.get('/', verifyToken, getAllProducts);

products.get('/featured', verifyToken, getFeaturedProducts);

products.get('/featured-server' , getFeaturedProductsServer);

products.get('/paginated', verifyToken, getPaginatedProducts);

products.get('/favorites', verifyToken , getUserFavorites);

products.post('/add-favorites', verifyToken , addToFavorites);

products.post('/remove-favorites', verifyToken , removeFromFavorites);

products.get('/:id', getProductById);

export default products;