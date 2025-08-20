import express from 'express';
import { getMessages, getMessagesBySession, addMessage, deleteMessage } from '../controllers/messagesController';

const router = express.Router()

router.route('/').get(getMessages).post(addMessage);
router.route('/session/:sessionId').get(getMessagesBySession);
router.route('/:id').delete(deleteMessage);

export default router