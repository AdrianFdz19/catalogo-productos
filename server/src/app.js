import express from 'express'
import cors from 'cors'
import { pool } from './config/databaseConfig.js';
import products from './routes/productsRoutes.js';
import uploadRoute from './routes/uploadRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/products', products);
app.use('/api', uploadRoute);

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

export default app;