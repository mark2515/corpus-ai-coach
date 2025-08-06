import mongoose from 'mongoose'

const messagesSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const Messages = mongoose.model('Message', messagesSchema)

export default Messages