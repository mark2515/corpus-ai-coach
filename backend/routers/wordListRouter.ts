import express from 'express'
import asyncHandler from 'express-async-handler'
import WordLists from '../models/wordListsModel'

const router = express.Router()

//@desc     request all words
//@route    GET/api/wordLists
//@access   public
router.get('/', asyncHandler(async (req, res) => {
    const wordLists = await WordLists.find({});
    res.json(wordLists);
}))

// @desc    add a new word
// @route   POST /api/wordLists
// @access  Public
router.post('/', (req, res) => {
  const { rank, word } = req.body;
  res.status(201).json({ message: 'Word added!', rank, word });
});

export default router