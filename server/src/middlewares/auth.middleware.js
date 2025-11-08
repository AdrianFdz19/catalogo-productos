import jwt from 'jsonwebtoken';
import { env } from '../config/config.js';
import { findUser } from '../models/auth.model.js';

/* let claveSecreta = env.secret || 'rb200219secretkeyfs'; */

export const authToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

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

export const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log(`Un invitado desea ver los productos`);
    req.user = { id: 0, role: 'guest' };
    return next();
  }

  console.log(`Un usuario real desea ver los productos`);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.user = { id: 0, role: 'guest' };
    } else {
      req.user = user;
    }
    next();
  });
};

