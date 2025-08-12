import mongoose from 'mongoose'

const assistantsSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: { type: String, required: true },
    model: { type: String },
    description: { type: String },
    prompt: { type: String, required: true },
    temperature: { type: Number, default: 0.7 },
    top_p: { type: Number, default: 0.9 },
    max_log: { type: Number, default: 4 },
    max_tokens: { type: Number, default: 800 },
}, { timestamps: true })

const Assistants = mongoose.model('Assistant', assistantsSchema)

export default Assistants