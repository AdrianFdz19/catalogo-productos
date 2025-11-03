import { pool } from '../config/databaseConfig.js';
import { addFavorite, createProduct, findAllProducts, findFeaturedProducts, findPaginatedProducts, findProductById, findUserFavorites, removeFavorite } from '../models/products.models.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    console.log(`${role}`);

    const products = await findAllProducts(userId, role);
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
    const { id: userId, role } = req.user;
    const data = await findPaginatedProducts({ page, limit, category, userId, role });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const userId = req.user?.id; // id del usuario autenticado, si existe

    const data = await findFeaturedProducts(userId);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos destacados' });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user?.id;

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
    const userId = req.user?.id;
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
    const userId = req.user?.id;
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

// Editar un producto
export const editProduct = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'No tienes permisos de administrador' });

    const { id } = req.params;
    const { name, description, price, category, stock, featured, imageUrls } = req.body;

    if (!name || !description || price == null || !category || stock == null || !imageUrls?.length) {
      return res.status(400).json({ message: 'Faltan campos obligatorios o imágenes.' });
    }

    await client.query('BEGIN');

    await client.query(
      `UPDATE products
       SET name=$1, description=$2, price=$3, category=$4, stock=$5, featured=$6
       WHERE id=$7`,
      [name, description, price, category, stock, featured, id]
    );

    await client.query('DELETE FROM media_urls WHERE product_id = $1', [id]);

    const insertPromises = imageUrls.map(img =>
      client.query(
        'INSERT INTO media_urls (product_id, url, media_type) VALUES($1, $2, $3)',
        [id, img, typeof img === 'string' ? 'image' : 'file']
      )
    );
    await Promise.all(insertPromises);

    await client.query('COMMIT');

    res.status(200).json({ message: 'Producto actualizado con éxito', id });

  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};
