import jwt from 'jsonwebtoken';
import { env } from '../config/config.js';
import { findUser } from '../models/auth.model.js';

/* let claveSecreta = env.secret || 'rb200219secretkeyfs'; */

export const authToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // verificar token
    const decoded = jwt.verify(token, env.secret);

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Buscar usuario en DB
    const user = await findUser(decoded);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;

    next();

  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

