import express from 'express'
import { signUp, signIn, signOut } from '../controllers/auth.controller.js';

const auth = express.Router();

auth.get('/', (req, res) => res.send('Auth Router is online...'));
auth.post('/signup', signUp);
auth.post('/signin', signIn);
auth.post('/signout', signOut);

export default auth;



