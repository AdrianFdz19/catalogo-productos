import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/databaseConfig.js';
import { env } from '../config/config.js';

const JWT_EXPIRES_IN = '1d';

export const getAuthUser = async (req, res) => {
  try {
    // Intentar obtener token desde cookie o header
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verificar token
    const decoded = jwt.verify(token, 'secretkey');

    // Buscar usuario en DB
    const result = await pool.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id=$1',
      [decoded.id]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Enviar usuario al frontend
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// =======================================
// Registro de usuario (SignUp)
// =======================================
export const signUp = async (req, res) => {
  const { username, email, full_name, password } = req.body;

  try {
    // Verificar si ya existe el usuario o email
    const existing = await pool.query(
      'SELECT id FROM users WHERE username=$1 OR email=$2',
      [username, email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Usuario o correo ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en la DB
    const result = await pool.query(
      `INSERT INTO users (username, email, full_name, hashed_password) 
       VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name, role, created_at`,
      [username, email, full_name, hashedPassword]
    );

    const userResult = result.rows[0];
    const user = { id: userResult.id, username: userResult.username, email: userResult.email, role: userResult.role }

    // Crear la token de sesion
    const token = jwt.sign(user, 'secretkey', { expiresIn: JWT_EXPIRES_IN });

    // Enviar el token en una cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production', // solo HTTPS en producción
      sameSite: 'lax', // importante para proteger CSRF
      maxAge: 3600 * 1000, // 1 hora
    });

    res.status(201).json({ message: 'Usuario creado', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

// =======================================
// Inicio de sesión (SignIn)
// =======================================
export const signIn = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username=$1 OR email=$2',
      [usernameOrEmail, usernameOrEmail]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      'secretkey',
      { expiresIn: JWT_EXPIRES_IN }
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// =======================================
// Cerrar sesión
// =======================================
export const signOut = (req, res) => {
  console.log('el usuario desea desloguearse');
  
  res.clearCookie('token', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
  });
  res.json({ success: true });
};
