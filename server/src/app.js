import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { pool } from './config/databaseConfig.js';
import products from './routes/products.routes.js';
import uploadRoute from './routes/upload.routes.js';
import auth from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/products', products);
app.use('/api', uploadRoute);
app.use('/auth', auth);

app.get('/', (req,res) => res.send('Server is online'));

app.get('/testdb', async(req, res) => {
    try {
        const query = 'SELECT * FROM NOW()';
        const response = await pool.query(query);
        const result = response.rows[0].now;
        res.json(result);
    } catch(err) {
        console.error(err);
    }
})

app.get('/database/info', async(req, res) => {
    try {
        const query = 'SELECT * FROM database_info';
        const response = await pool.query(query);
        const result = response.rows[0].info;
        res.json(result);
    } catch(err) {
        console.error(err);
    }
});

export default app;