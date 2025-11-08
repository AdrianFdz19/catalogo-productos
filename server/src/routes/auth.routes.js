import express from 'express';
import { 
    signUp, 
    signIn, 
    signOut, 
    getAuthUser
} from '../controllers/auth.controller.js';

const auth = express.Router();

// Ruta de "salud" (health check) para verificar que el router funciona
auth.get('/', (req, res) => res.status(200).json({ status: 'online', router: 'auth' }));

// Rutas principales de gestión de identidad
auth.post('/signup', signUp);   // Crear un nuevo usuario registrado
auth.post('/signin', signIn);   // Iniciar sesión con credenciales
auth.post('/signout', signOut); // Cerrar sesión (limpia la cookie)

// Ruta de verificación de estado de autenticación
auth.get('/verify', getAuthUser); 

export default auth;