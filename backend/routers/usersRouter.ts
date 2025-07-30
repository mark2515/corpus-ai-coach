import express from 'express';
import { getUsers, addGoogleUser } from '../controllers/usersController';

const router = express.Router();

router.route('/').get(getUsers);

router.route('/google-login').post(addGoogleUser);

export default router;