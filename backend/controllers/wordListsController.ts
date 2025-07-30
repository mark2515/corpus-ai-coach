import asyncHandler from 'express-async-handler';
import WordLists from '../models/wordListsModel';

//@desc     get all words
//@route    GET /api/wordLists
//@access   public
const getWordLists = asyncHandler(async (req, res) => {
    const wordLists = await WordLists.find({});
    res.json(wordLists);
})

// @desc    add a new word
// @route   POST /api/wordLists
// @access  public
const addNewWord = asyncHandler(async (req, res) => {
  const { user, rank, word } = req.body;
  const newWord = await WordLists.create({ user, rank, word });
  res.status(201).json(newWord);
})

export { getWordLists, addNewWord };