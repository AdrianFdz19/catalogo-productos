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