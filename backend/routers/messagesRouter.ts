import express from 'express';
import { getMessages, addMessage } from '../controllers/messagesController';

const router = express.Router()

router.route('/').get(getMessages).post(addMessage);

export default router