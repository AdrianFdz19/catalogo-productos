import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/databaseConfig.js';
import { env } from '../config/config.js';

const JWT_SECRET = env.jwtSecret || 'supersecretkey';
const JWT_EXPIRES_IN = '1d';

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

    const user = result.rows[0];
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
    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM users WHERE username=$1 OR email=$2',
      [usernameOrEmail, usernameOrEmail]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Enviar cookie HTTP-only
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: 'Inicio de sesión exitoso',
        user: { id: user.id, username: user.username, role: user.role },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// =======================================
// Cerrar sesión
// =======================================
export const signOut = (_req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: env.NODE_ENV === 'production',
    })
    .json({ message: 'Sesión cerrada' });
};
