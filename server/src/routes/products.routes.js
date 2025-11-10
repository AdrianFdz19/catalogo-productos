import express from 'express';
import { 
 
    getUserFavorites, 
    getProductById, 
    addToFavorites, 
    removeFromFavorites, 
    addProduct, 
    editProduct, 
    deleteProduct, 
    getCategories,
    createNewCategory,
    getProducts
} from '../controllers/products.controller.js';

// Asegúrate de que importas los 3 middlewares: authenticate, authorize, y optionalAuth
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const products = express.Router();


products.post('/', authenticate, authorize(['admin']), addProduct);
products.put('/:id', authenticate, authorize(['admin']), editProduct);
products.delete('/:id', authenticate, authorize(['admin']), deleteProduct);
products.post('/categories', authenticate, authorize(['admin']), createNewCategory);


products.get('/', authenticate, getProducts);

products.get('/categories', authenticate, getCategories);
products.get('/favorites', authenticate, authorize(['user']), getUserFavorites);
products.post('/add-favorites', authenticate, authorize(['user']), addToFavorites);
products.post('/remove-favorites', authenticate, authorize(['user']), removeFromFavorites);

products.get('/:id', authenticate, getProductById);




export default products;