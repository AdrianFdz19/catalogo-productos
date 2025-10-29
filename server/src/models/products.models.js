import { pool } from "../config/databaseConfig.js";

export const findAllProducts = async (userId = null) => {
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
    GROUP BY p.id, f.user_id
    ORDER BY p.created_at DESC
  `;

    const { rows } = await pool.query(query, [userId]);

    return rows.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        stock: p.stock,
        featured: p.featured,
        price: Number(p.price),
        imageUrls: p.image_urls.map(img => img.url),
        isFavorite: p.isFavorite,
        createdAt: p.created_at,
        updatedAt: p.updated_at
    }));
};

export const findPaginatedProducts = async ({ page = 1, limit = 10, category = null, userId = null }) => {
    const offset = (page - 1) * limit;
    let whereClause = '';
    const values = [userId]; // $1 será userId
    let countValues = [];

    if (category && category !== 'Todos') {
        if (category === 'Destacados') {
            whereClause = ' WHERE p.featured = true';
        } else {
            whereClause = ' WHERE p.category = $2';
            values.push(category);
            countValues.push(category);
        }
    }

    // Consulta principal con paginación
    const query = `
    SELECT 
      p.*, 
      COALESCE(json_agg(mu) FILTER (WHERE mu.id IS NOT NULL), '[]') AS images,
      CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS "isFavorite"
    FROM products p
    LEFT JOIN media_urls mu ON p.id = mu.product_id
    LEFT JOIN favorites f ON p.id = f.product_id AND f.user_id = $1
    ${whereClause}
    GROUP BY p.id, f.user_id
    ORDER BY p.id DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

    values.push(limit, offset);

    const response = await pool.query(query, values);

    // Consulta total
    let countQuery = 'SELECT COUNT(*) FROM products';
    if (whereClause) countQuery += whereClause;
    const totalRes = await pool.query(countQuery, countValues);
    const total = parseInt(totalRes.rows[0].count);

    const products = response.rows.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        stock: p.stock,
        featured: p.featured,
        price: Number(p.price),
        imageUrls: p.images.map(img => img.url),
        isFavorite: p.isFavorite,
        createdAt: p.created_at,
        updatedAt: p.updated_at
    }));

    return { products, total, page, limit };
};

export const findFeaturedProducts = async (userId) => {

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

    return featuredProducts;

};

export const findUserFavorites = async (userId) => {
    const { rows } = await pool.query(
        `
      SELECT 
        p.*,
        COALESCE(
          JSON_AGG(m.url) FILTER (WHERE m.id IS NOT NULL),
          '[]'
        ) AS "imageUrls",
        TRUE AS "isFavorite"
      FROM favorites f
      JOIN products p ON p.id = f.product_id
      LEFT JOIN media_urls m ON p.id = m.product_id
      WHERE f.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `,
        [userId]
    );

    return rows;
};

export const addFavorite = async (userId, productId) => {
  // Verificar si ya existe
  const exists = await pool.query(
    'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  if (exists.rows.length > 0) {
    return { alreadyExists: true };
  }

  const result = await pool.query(
    'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *',
    [userId, productId]
  );

  return { alreadyExists: false, favorite: result.rows[0] };
};

export const removeFavorite = async (userId, productId) => {
  const result = await pool.query(
    'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *',
    [userId, productId]
  );
  return result.rows[0]; // devuelve el registro eliminado si existía
};

export const findProductById = async (productId) => {
  const query = `
    SELECT p.*,
      COALESCE(
        json_agg(mu) FILTER (WHERE mu.id IS NOT NULL),
        '[]'
      ) AS images
    FROM products p
    LEFT JOIN media_urls mu ON p.id = mu.product_id
    WHERE p.id = $1
    GROUP BY p.id
  `;

  const result = await pool.query(query, [productId]);

  if (result.rows.length === 0) {
    return null;
  }

  const product = result.rows[0];

  // Transformar images: solo extraer el campo 'url'
  product.images = product.images.map(img => img.url);

  return product;
};
