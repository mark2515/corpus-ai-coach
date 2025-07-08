import express from 'express'
import asyncHandler from 'express-async-handler'
import WordLists from '../models/wordListsModel'

const router = express.Router()

//@desc     request all words
//@route    GET/api/wordLists
//@access   public
router.get('/', asyncHandler(async (req, res) => {
    const wordLists = await WordLists.find({})
    res.json(wordLists)
}))

//@desc     request a single word
//@route    GET/api/wordLists/:id
//@access   public
router.get('/:id', asyncHandler(async (req, res) => {
    const wordLists = await WordLists.findById(req.params.id)
    if(wordLists) {
        res.json(wordLists)
    } else {
        res.status(404).json({ message: 'The wordLists cannot be found!'})
    }
}))

export default router