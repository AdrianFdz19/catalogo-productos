import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/databaseConfig.js';
import { env } from '../config/config.js';
import { 
  createGuestUser, 
  createUser, 
  findUser, 
  findUserByUsernameOrEmail, 
  findUserByUsernameOrEmailSignIn 
} from '../models/auth.model.js';
import { v4 as uuidv4 } from "uuid";

const JWT_EXPIRES_IN = '1d';

export const getAuthUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    let decoded = null;
    let user = null;

    if (token) {
      try {
        decoded = jwt.verify(token, env.secret);
        user = await findUser(decoded);
      } catch (err) {
        // Token inválido o expirado, user permanece null
      }
    }

    if (user) {
      // Caso A: Usuario (registrado o invitado anterior) con token válido
      return res.status(200).json({
        success: true,
        user,
      });
    }
    
    // Caso B: No hay usuario válido. Creamos uno nuevo como invitado.

    // 1. Crear el usuario invitado en la Base de Datos
    const newGuestUsername = `guest_${uuidv4().slice(0, 8)}`;
    const newGuest = await createGuestUser(newGuestUsername); 

    // 2. Generar un nuevo JWT para el invitado
    const guestPayload = { id: newGuest.id, role: 'guest' };
    const guestToken = jwt.sign(guestPayload, env.secret, { expiresIn: JWT_EXPIRES_IN });

    // 3. Establecer la cookie HttpOnly en la respuesta
    res.cookie('token', guestToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
    });

    // 4. Enviar los datos del nuevo invitado al frontend
    res.status(200).json({
      success: true,
      user: {
        id: newGuest.id,
        username: newGuest.username,
        role: 'guest',
      },
    });

  } catch (err) {
    next(err);
  }
};

// =======================================
// Registro de usuario (SignUp)
// =======================================
export const signUp = async (req, res, next) => {
  const { username, email, full_name, password } = req.body;

  try {
    // 1. Verificar si usuario o email ya existen
    const existingUser = await findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario o correo ya existe' });
    }

    // 2. Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear usuario
    const newUser = await createUser(username, email, full_name, hashedPassword);

    // 4. Crear token
    const tokenPayload = { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role };
    const token = jwt.sign(tokenPayload, env.secret, { expiresIn: JWT_EXPIRES_IN });

    // 5. Enviar token en cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000,
    });

    res.status(201).json({ message: 'Usuario creado', user: tokenPayload });
  } catch (err) {
    next(err);
  }
};

// =======================================
// Inicio de sesión (SignIn)
// =======================================
export const signIn = async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await findUserByUsernameOrEmailSignIn(usernameOrEmail);

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      env.secret,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    }).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// =======================================
// Cerrar sesión
// =======================================
export const signOut = (req, res, next) => {
  console.log('el usuario desea desloguearse');

  res.clearCookie('token', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
  });
  res.json({ success: true });
};


// Crear cuenta para invitado
export const createGuest = async (req, res) => {
  try {

    const guestId = uuidv4();

    // Guarda opcionalmente el guest en base de datos
    const queryUser = await pool.query(
      "INSERT INTO users (username, role, guest_id, email, hashed_password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [`guest_${guestId.slice(0, 6)}`, "guest", guestId, `guest_${guestId.slice(0, 6)}@mail.com`, guestId]
    );

    const guestData = queryUser.rows[0];

    const guestInfo = { id: guestData.id, username: guestData.username, role: "guest", email: guestData.email };

    const token = jwt.sign(
      guestInfo,
      env.secret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
    });

    res.json({
      success: true,
      token,
      message: 'Guest created',
      user: guestInfo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creando invitado" });
  }
};

// Obtener info del guest existente
export const getGuestById = async (req, res) => {
  try {
    const { guestId } = req.params;

    const query = await pool.query(
      "SELECT id, username, email, role FROM users WHERE guest_id = $1 AND role = 'guest'",
      [guestId]
    );

    if (query.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Guest not found' });
    }

    const user = query.rows[0];
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener guest' });
  }
};