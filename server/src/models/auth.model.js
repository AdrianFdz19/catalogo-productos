import { pool } from "../config/databaseConfig.js";

export const findUser = async (decoded) => {
  const result = await pool.query(
    'SELECT id, username, email, role, created_at FROM users WHERE id=$1',
    [decoded.id]
  );
  
  const user = result.rows[0]; // aquí sí es correcto
  return user;
};

export const findUserByUsernameOrEmail = async (username, email) => {
  const result = await pool.query(
    'SELECT id, username, email FROM users WHERE username=$1 OR email=$2',
    [username, email]
  );
  return result.rows[0]; // devuelve usuario o undefined
};

export const findUserByUsernameOrEmailSignIn = async (usernameOrEmail) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE username=$1 OR email=$2',
    [usernameOrEmail, usernameOrEmail]
  );
  return result.rows[0]; // devuelve undefined si no existe
};

export const createUser = async (username, email, role = 'user', full_name, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, role, full_name, hashed_password) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, username, email, full_name, role, created_at`,
    [username, email, role, full_name, hashedPassword]
  );
  return result.rows[0];
};

export const createGuestUser = async (username) => {
  const result = await pool.query(
    `INSERT INTO users (username, role) 
     VALUES ($1, 'guest') 
     RETURNING id, username, email, full_name, role, created_at`,
    [username]
    // Asume que email, full_name, hashed_password son NULLABLE en tu DB
  );
  return result.rows[0];
};
