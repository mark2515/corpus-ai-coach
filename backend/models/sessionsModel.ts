import mongoose from 'mongoose'

const sessionsSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: { type: String, required: true },
    assistant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assistant'
    },
}, { timestamps: true })

const Sessions = mongoose.model('Session', sessionsSchema)

export default Sessions