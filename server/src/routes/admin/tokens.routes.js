import express from 'express'
import { authToken } from '../../middlewares/auth.middleware.js';
const adminTokens = express.Router();

// Listar todos los tokens del admin
adminTokens.get('/', (req, res) => res.send('Listar admin tokens...'));

// Generar un nuevo token (solo admin autenticado)
adminTokens.post('/', authToken, (req, res) => res.send('Generar nuevo token ...'));

// Revocar un token
adminTokens.delete('/', (req, res) => res.send('Revocar un token ...'));

export default adminTokens;