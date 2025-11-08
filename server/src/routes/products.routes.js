import express from 'express';
import { 
    getAllProducts, 
    getFeaturedProducts, 
    getUserFavorites, 
    getPaginatedProducts, 
    getProductById, 
    addToFavorites, 
    removeFromFavorites, 
    addProduct, 
    editProduct, 
    deleteProduct, 
    getCategories,
    createNewCategory
} from '../controllers/products.controller.js';

// Asegúrate de que importas los 3 middlewares: authenticate, authorize, y optionalAuth
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const products = express.Router();

// Rutas de administración (solo admin)
products.post('/', authenticate, authorize(['admin']), addProduct);
products.put('/:id', authenticate, authorize(['admin']), editProduct);
products.delete('/:id', authenticate, authorize(['admin']), deleteProduct);
products.get('/categories', authenticate, authorize(['admin']), getCategories);
products.post('/categories', authenticate, authorize(['admin']), createNewCategory);

// Rutas públicas con autenticación opcional (catálogo para todos)
products.get('/', authenticate, getAllProducts);
products.get('/featured', authenticate, getFeaturedProducts);
products.get('/paginated', authenticate, getPaginatedProducts);
products.get('/:id', authenticate, getProductById);

// Rutas de usuario protegido (solo 'user' o 'admin')
products.get('/favorites', authenticate, authorize(['user']), getUserFavorites);
products.post('/add-favorites', authenticate, authorize(['user']), addToFavorites);
products.post('/remove-favorites', authenticate, authorize(['user']), removeFromFavorites);



export default products;