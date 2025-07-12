import { config } from 'dotenv';
import pkg from 'pg'
const { Pool } = pkg;
config();

export let pool;

if (process.env.NODE_ENV === 'production') {
    pool = null
} else {
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });
};

