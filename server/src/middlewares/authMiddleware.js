import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token; // obtener cookie del cliente
    /* console.log(token); */

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // verificar token
    const decoded = jwt.verify(token, 'secretkey');
    /* console.log(decoded); */

    // guardar id del usuario en req
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'secretkey');

    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }

    // Guardar info del usuario en req
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

