import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    picture: String,
}, { timestamps: true });

const User = mongoose.model('User', usersSchema)

export default User