import { pool } from '../config/databaseConfig.js';
import { addFavorite, findAllProducts, findFeaturedProducts, findPaginatedProducts, findProductById, findUserFavorites, removeFavorite } from '../models/products.models.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const products = await findAllProducts(userId);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getPaginatedProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;
    const userId = req.user?.id || null;

    const data = await findPaginatedProducts({ page, limit, category, userId });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const userId = req.userId; // id del usuario autenticado, si existe

    const data = await findFeaturedProducts(userId);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos destacados' });
  }
};

export const getFeaturedProductsServer = async (req, res) => {
  try {
    const userId = 15;

    const query = `
      SELECT 
        p.*, 
        COALESCE(
          JSON_AGG(JSON_BUILD_OBJECT('url', m.url)) 
          FILTER (WHERE m.id IS NOT NULL), '[]'
        ) AS image_urls,
        CASE 
          WHEN f.user_id IS NOT NULL THEN true
          ELSE false
        END AS "isFavorite"
      FROM products p
      LEFT JOIN media_urls m ON p.id = m.product_id
      LEFT JOIN favorites f 
        ON p.id = f.product_id AND f.user_id = $1
      WHERE p.featured = true
      GROUP BY p.id, f.user_id
      ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    const featuredProducts = result.rows.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      stock: p.stock,
      featured: p.featured,
      price: Number(p.price),
      imageUrls: p.image_urls.map((img) => img.url),
      isFavorite: p.isFavorite, // true o false
      createdAt: p.created_at,
      updatedAt: p.updated_at
    }));

    res.json(featuredProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos destacados' });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.userId;

    const favorites = await findUserFavorites(userId);

    res.status(200).json({
      success: true,
      favorites
    });

  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ success: false, message: 'Error fetching favorites' });
  }
};


// Agregar a favoritos
export const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: 'Usuario no autenticado' });

    const { alreadyExists, favorite } = await addFavorite(userId, productId);

    if (alreadyExists) {
      return res.status(400).json({ success: false, message: 'Producto ya está en favoritos' });
    }

    res.status(200).json({ success: true, data: favorite });
  } catch (err) {
    next(err);
  }
};

// Quitar de favoritos
export const removeFromFavorites = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: 'Usuario no autenticado' });

    const deleted = await removeFavorite(userId, productId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado en favoritos' });
    }

    res.status(200).json({ success: true, message: 'Producto eliminado de favoritos' });
  } catch (err) {
    next(err);
  }
};

// Obtener producto por ID
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await findProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};