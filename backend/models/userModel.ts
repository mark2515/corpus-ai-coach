import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    picture: String,
    sub: { type: String, unique: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema)

export default User