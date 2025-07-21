import express from 'express'
import asyncHandler from 'express-async-handler'
import WordLists from '../models/wordListsModel'

const router = express.Router()

//@desc     get all words
//@route    GET /api/wordLists
//@access   public
router.get('/', asyncHandler(async (req, res) => {
    const wordLists = await WordLists.find({});
    res.json(wordLists);
}))

// @desc    add a new word
// @route   POST /api/wordLists
// @access  public
router.post('/', asyncHandler(async (req, res) => {
  const { rank, word } = req.body;
  const newWord = await WordLists.create({ rank, word });
  res.status(201).json(newWord);
}));

export default router