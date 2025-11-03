import jwt from 'jsonwebtoken'
import { env } from "../../config/config";

export const createAdminToken = (req, res) => {
  try {
    const { name } = req.body;

    // Obtenemos datos del admin que hace la petición
    const admin = req.user?.id; // viene del middleware isAdmin
    if (!admin) {
      return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    // Payload del token
    const payload = {
      id: admin.id,
      role: admin.role,
      name: name || 'Admin token',
      createdAt: new Date(),
    };

    // Generar JWT (ajusta la expiración a tu preferencia)
    const token = jwt.sign(payload, env.secret, { expiresIn: '30d' });

    // Retornamos el token en la respuesta
    return res.status(201).json({ success: true, token, name: payload.name });
  } catch (err) {
    console.error('Error creando token de admin:', err);
    return res.status(500).json({ success: false, message: 'Error creando token' });
  }
};