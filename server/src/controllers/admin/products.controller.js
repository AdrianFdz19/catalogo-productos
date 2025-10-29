import { pool } from "../../config/databaseConfig.js";
import { createProduct, findAllProductsAdmin, findPaginatedProducts } from "../../models/admin/products.models.js";

// Agregar un producto
export const addProduct = async (req, res, next) => {

    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            featured,
            imageUrls, // array de strings ya subidas a Cloudinary
        } = req.body;

        if (!name || !description || !price || !category || !stock || !imageUrls?.length) {
            return res.status(400).json({ message: 'Faltan campos obligatorios o imágenes.' });
        }

        const productId = await createProduct({
            name,
            description,
            price,
            category,
            stock,
            featured,
            imageUrls,
        });

        res.status(201).json({ message: 'Producto creado con éxito', productId });
    } catch (err) {
        console.error('Error al crear producto:', err);
        next(err);
    }
};

// Obtener productos paginados PARA ADMIN
export const getPaginatedAdminProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category = null } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = '';
        const values = [];

        if (category && category !== 'Todos') {
            if (category === 'Destacados') {
                whereClause = ' WHERE p.featured = true';
            } else {
                whereClause = ' WHERE p.category = $1';
                values.push(category);
            }
        }

        // 🔹 Consulta principal (sin favoritos)
        const query = `
      SELECT 
        p.*, 
        COALESCE(json_agg(mu) FILTER (WHERE mu.id IS NOT NULL), '[]') AS images
      FROM products p
      LEFT JOIN media_urls mu ON p.id = mu.product_id
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.id DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

        values.push(limit, offset);

        const response = await pool.query(query, values);

        // 🔹 Conteo total
        let countQuery = 'SELECT COUNT(*) FROM products p';
        const countValues = [];
        if (whereClause) {
            countQuery += whereClause;
            if (category && category !== 'Destacados') countValues.push(category);
        }

        const totalRes = await pool.query(countQuery, countValues);
        const total = parseInt(totalRes.rows[0].count);

        // 🔹 Mapear productos con sus imágenes
        const products = response.rows.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            category: p.category,
            stock: p.stock,
            featured: p.featured,
            price: Number(p.price),
            imageUrls: p.images.map((img) => img.url),
            createdAt: p.created_at,
            updatedAt: p.updated_at,
        }));

        res.status(200).json({ success: true, products, total, page: Number(page), limit: Number(limit) });
    } catch (err) {
        console.error('Error al obtener productos (admin):', err);
        res.status(500).json({ success: false, message: 'Error al obtener productos del administrador' });
    }
};

export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await findAllProductsAdmin(); // sin userId, modo admin
    res.json(products);
  } catch (err) {
    next(err);
  }
};