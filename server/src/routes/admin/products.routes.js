import express from 'express'
import { addProduct, getAllProductsAdmin, getPaginatedAdminProducts } from '../../controllers/admin/products.controller.js';
import { isAdmin } from '../../middlewares/authMiddleware.js';
const adminProducts = express.Router();

adminProducts.post('/', isAdmin, addProduct);
/* adminProducts.get('/paginated', isAdmin, getPaginatedProducts); */
adminProducts.get('/paginated', isAdmin, getPaginatedAdminProducts);

adminProducts.get('/', isAdmin, getAllProductsAdmin);

export default adminProducts;