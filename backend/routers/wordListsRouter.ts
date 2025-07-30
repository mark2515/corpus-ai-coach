import express from 'express';
import { getWordLists, addNewWord } from '../controllers/wordListsController';

const router = express.Router()

router.route('/').get(getWordLists).post(addNewWord);

export default router