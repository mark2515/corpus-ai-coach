import express from 'express';
import { getUsers, addGuestUser, addGoogleUser } from '../controllers/usersController';

const router = express.Router();

router.route('/').get(getUsers);

router.route('/guest-login').post(addGuestUser);

router.route('/google-login').post(addGoogleUser);

export default router;