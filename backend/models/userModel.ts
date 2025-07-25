import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    sub: { type: String, unique: true },
    name: String,
    email: { type: String, unique: true },
    picture: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema)

export default User