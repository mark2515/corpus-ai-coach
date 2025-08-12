import express from 'express';
import { getAssistants, addAssistant, updateAssistant, deleteAssistant } from '../controllers/assistantsController';

const router = express.Router();

router.route('/').get(getAssistants).post(addAssistant);
router.route('/:id').put(updateAssistant).delete(deleteAssistant);

export default router;