import pkg from 'pg'
const {Pool} = pkg;
import { env } from './config.js';

export let pool;

if (env.nodeEnv === 'production') {
    pool = new Pool({
        connectionString: env.db.url,
    })
} else {
    pool = new Pool({
        user: env.db.user,
        host: env.db.host,
        database: env.db.name,
        password: env.db.password,
        port: Number(env.db.port),
    });
};

