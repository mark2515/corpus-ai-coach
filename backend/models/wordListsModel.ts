import mongoose from 'mongoose'

const wordListsSchema = new mongoose.Schema(
{
    user: {
        type: String,
        required: true,
    },
    rank: {
        type: String,
        required: true,
    },
    word: {
        type: String,
        required: true,
    }
}, 
)

const WordLists = mongoose.model('Word', wordListsSchema)

export default WordLists