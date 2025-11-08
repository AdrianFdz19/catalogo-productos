import express from 'express'
import { signUp, signIn, signOut, getAuthUser, createGuest, getGuestById } from '../controllers/auth.controller.js';

const auth = express.Router();

auth.get('/', (req, res) => res.send('Auth Router is online...'));
auth.post('/signup', signUp);
auth.post('/signin', signIn);
auth.post('/signout', signOut);
auth.get('/verify', getAuthUser);
auth.post('/guest', createGuest); // crear cuenta para invitado
auth.get('/guest/:guestId', getGuestById);

export default auth;



