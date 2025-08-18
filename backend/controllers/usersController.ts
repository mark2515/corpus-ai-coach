import asyncHandler from 'express-async-handler';
import User from '../models/usersModel';
import Assistants from '../models/assistantsModel';

//@desc     get all users
//@route    GET /api/users
//@access   public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
})

//@desc     create a guest user
//@route    POST /api/users/guest-login
//@access   public
const addGuestUser = asyncHandler(async (req, res) => {
    const { name, email, picture } = req.body;
    const isGuest = true;
    res.status(200).json({ name, email, picture, isGuest });
})

//@desc     create or update a Google user
//@route    POST /api/users/google-login
//@access   public
const addGoogleUser = asyncHandler(async (req, res) => {
    const { name, email, picture } = req.body;
    if (!email) {
        res.status(400);
        throw new Error('Missing required Google user info');
    }
    const user = await User.findOneAndUpdate(
        { email },
        { name, picture },
        { new: true, upsert: true }
    );

    const hasAssistant = await Assistants.exists({ user: user._id });
    if (!hasAssistant) {
      await Assistants.create({
        user: user._id,
        name: "Chatbot No.1",
        model: "gpt-3.5-turbo",
        prompt: "You are a language-learn chatbot. Your task is to communicate with users using appropriate and natural English.",
        temperature: 0.7,
        top_p: 0.9,
        max_log: 4,
        max_tokens: 800,
      });
    }

    const userWithGuestFlag = {
        ...user.toObject(),
        isGuest: false,
    };

    res.status(200).json(userWithGuestFlag);
})

export { getUsers, addGuestUser, addGoogleUser };

