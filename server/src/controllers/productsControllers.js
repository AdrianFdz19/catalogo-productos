import { pool } from '../config/databaseConfig.js';

export const getAllProducts = async (req, res) => {
    try {
        const query = `
			SELECT 
				p.*, 
				COALESCE(
					JSON_AGG(
						JSON_BUILD_OBJECT('url', m.url)
					) FILTER (WHERE m.id IS NOT NULL), 
					'[]'
				) AS image_urls
			FROM products p
			LEFT JOIN media_urls m ON p.id = m.product_id
			GROUP BY p.id
			ORDER BY p.created_at DESC
		`;

        const result = await pool.query(query);
        const products = result.rows.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            category: p.category,
            stock: p.stock,
            featured: p.featured,
            price: Number(p.price),
            imageUrls: p.image_urls.map((img) => img.url),
            createdAt: p.created_at,
            updatedAt: p.updated_at
        }));

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

export const getPaginatedProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const category = req.query.category;

  try {
    let query = `
      SELECT p.*, 
        COALESCE(
          json_agg(mu) FILTER (WHERE mu.id IS NOT NULL), 
          '[]'
        ) AS images
      FROM products p
      LEFT JOIN media_urls mu ON p.id = mu.product_id
    `;

    let countQuery = 'SELECT COUNT(*) FROM products';
    let whereClause = '';
    let values = [];
    let countValues = [];

    if (category && category !== 'Todos') {
      if (category === 'Destacados') {
        whereClause = ' WHERE p.featured = true';
        countQuery += ' WHERE featured = true';
      } else {
        whereClause = ' WHERE p.category = $1';
        values.push(category);
        countQuery += ' WHERE category = $1';
        countValues.push(category);
      }
    }

    query += whereClause;
    query += ' GROUP BY p.id ORDER BY p.id DESC';

    // Agregamos LIMIT y OFFSET correctamente
    if (values.length > 0) {
      values.push(limit);
      values.push(offset);
      query += ` LIMIT $2 OFFSET $3`;
    } else {
      values = [limit, offset];
      query += ` LIMIT $1 OFFSET $2`;
    }

    const response = await pool.query(query, values);
    const totalRes = await pool.query(countQuery, countValues);
    const total = parseInt(totalRes.rows[0].count);

    res.json({
      products: response.rows,
      total,
    });
  } catch (err) {
    console.error('Error al obtener productos paginados:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const getFeaturedProducts = async (req, res) => {
	try {
		const query = `
			SELECT 
				p.*, 
				COALESCE(
					JSON_AGG(
						JSON_BUILD_OBJECT('url', m.url)
					) FILTER (WHERE m.id IS NOT NULL), 
					'[]'
				) AS image_urls
			FROM products p
			LEFT JOIN media_urls m ON p.id = m.product_id
			WHERE p.featured = true
			GROUP BY p.id
			ORDER BY p.created_at DESC
		`;

		const result = await pool.query(query);
		const featuredProducts = result.rows.map(p => ({
			id: p.id,
			name: p.name,
			description: p.description,
			category: p.category,
			stock: p.stock,
			featured: p.featured,
			price: Number(p.price),
			imageUrls: p.image_urls.map((img) => img.url),
			createdAt: p.created_at,
			updatedAt: p.updated_at
		}));

		res.json(featuredProducts);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error al obtener productos destacados' });
	}
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
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

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const product = result.rows[0];

    // Transformar images: solo extraer el campo 'url'
    product.images = product.images.map(img => img.url);
    console.log(product);
    res.json(product);
  } catch (err) {
    console.error('❌ Error al obtener producto por ID:', err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

export const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            featured,
            tags, // opcional
            imageUrls, // array de strings ya subidas a Cloudinary
        } = req.body;

        console.log(req.body);

        if (!name || !description || !price || !category || !stock || !imageUrls?.length) {
            return res.status(400).json({ message: 'Faltan campos obligatorios o imágenes.' });
        }

        // 1. Insertar producto
        const productResult = await pool.query(
            `INSERT INTO products (name, description, price, category, stock, featured)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [name, description, price, category, stock, featured]
        );

        const productId = productResult.rows[0].id;

        // 2. Insertar media urls asociadas
        const insertPromises = imageUrls.map((url) =>
            pool.query(
                `INSERT INTO media_urls (product_id, url, media_type)
         VALUES ($1, $2, $3)`,
                [productId, url, 'image']
            )
        );

        await Promise.all(insertPromises);

        res.status(201).json({ message: 'Producto creado con éxito', productId });
    } catch (err) {
        console.error('Error al crear producto:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};