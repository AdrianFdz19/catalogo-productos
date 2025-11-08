import jwt from 'jsonwebtoken';
import { env } from '../config/config.js';
import { findUser } from '../models/auth.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      // Si no hay token, el usuario NO está autenticado para esta RUTA protegida.
      return res.status(401).json({ message: 'Autenticación requerida. Inicie sesión.' });
    }

    const decoded = jwt.verify(token, env.secret);

    // Buscar usuario en DB para asegurarnos de que el usuario existe y está activo
    const user = await findUser(decoded);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado o token inválido.' });
    }

    // Adjuntar el objeto user al request para que los siguientes middlewares y controladores puedan usarlo
    req.user = user; 
    
    next(); // Pasar al siguiente middleware o controlador

  } catch (err) {
    // Manejar errores de JWT (ej. token expirado o corrupto)
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

// authorize toma un array de roles permitidos (ej. ['user', 'admin'])
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Asumimos que el middleware 'authenticate' ya se ejecutó y adjuntó req.user
    const userRole = req.user?.role; // Accedemos al rol del usuario adjunto

    if (!userRole || !allowedRoles.includes(userRole)) {
      // El rol del usuario no está en la lista de permitidos
      return res.status(403).json({ message: 'Permisos insuficientes. Acceso denegado.' });
    }

    // El usuario tiene el rol adecuado, permitir acceso
    next();
  };
};

