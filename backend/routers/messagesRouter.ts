import express from 'express';
import { getMessages, getMessagesBySession, addMessage, deleteMessage, deleteMessagesBySession } from '../controllers/messagesController';

const router = express.Router()

router.route('/').get(getMessages).post(addMessage);
router.route('/session/:sessionId').get(getMessagesBySession).delete(deleteMessagesBySession);
router.route('/:id').delete(deleteMessage);

export default router