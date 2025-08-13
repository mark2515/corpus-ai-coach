import express from 'express';
import { getSessions, addSession, updateSession, deleteSession } from '../controllers/sessionsController';

const router = express.Router();

router.route('/').get(getSessions).post(addSession);
router.route('/:id').put(updateSession).delete(deleteSession);

export default router