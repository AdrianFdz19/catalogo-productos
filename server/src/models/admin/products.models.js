import { pool } from "../../config/databaseConfig.js";

export const createProduct = async ({
  name,
  description,
  price,
  category,
  stock,
  featured,
  imageUrls = [],
}) => {
  // Insertar producto
  const productResult = await pool.query(
    `INSERT INTO products (name, description, price, category, stock, featured)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [name, description, price, category, stock, featured]
  );

  const productId = productResult.rows[0].id;

  // Insertar media urls asociadas
  const insertPromises = imageUrls.map((url) =>
    pool.query(
      `INSERT INTO media_urls (product_id, url, media_type)
       VALUES ($1, $2, $3)`,
      [productId, url, 'image']
    )
  );

  await Promise.all(insertPromises);

  return productId;
};

export const findAllProductsAdmin = async () => {
  const query = `
    SELECT 
      p.*, 
      COALESCE(
        JSON_AGG(JSON_BUILD_OBJECT('url', m.url))
        FILTER (WHERE m.id IS NOT NULL), '[]'
      ) AS image_urls
    FROM products p
    LEFT JOIN media_urls m ON p.id = m.product_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  const { rows } = await pool.query(query);

  return rows.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    stock: p.stock,
    featured: p.featured,
    price: Number(p.price),
    imageUrls: p.image_urls.map(img => img.url),
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