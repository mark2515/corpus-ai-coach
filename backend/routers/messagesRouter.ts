import express from 'express';
import { getMessages, addNewMessage } from '../controllers/messagesController';

const router = express.Router()

router.route('/').get(getMessages).post(addNewMessage);

export default router