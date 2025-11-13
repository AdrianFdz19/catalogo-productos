import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { pool } from './config/databaseConfig.js';
import products from './routes/products.routes.js';
import uploadRoute from './routes/upload.routes.js';
import auth from './routes/auth.routes.js';
import { handleError } from './middlewares/error.middleware.js';
import adminTokens from './routes/admin/tokens.routes.js';
import { env } from './config/config.js';

const app = express();
console.log(typeof env.secret);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'https://catalogo-fdz.netlify.app/'],
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
 
app.use('/products', products);
app.use('/api', uploadRoute);
app.use('/auth', auth);
app.use('/admin/tokens', adminTokens);

app.get('/', (req, res) => res.send('Server is online'));

app.get('/testdb', async (req, res) => {
    try {
        const query = 'SELECT * FROM NOW()';
        const response = await pool.query(query);
        const result = response.rows[0].now;
        res.json(result);
    } catch (err) {
        console.error(err);
    }
})

app.get('/database/info', async (req, res) => {
    try {
        const query = 'SELECT * FROM database_info';
        const response = await pool.query(query);
        const result = response.rows[0].info;
        res.json(result);
    } catch (err) {
        console.error(err);
    }
});

app.use(handleError);

export default app;