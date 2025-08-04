import asyncHandler from 'express-async-handler';
import User from '../models/usersModel';

//@desc     get all users
//@route    GET /api/users
//@access   public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
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

    const userWithGuestFlag = {
        ...user.toObject(),
        isGuest: false,
    };

    res.status(200).json(userWithGuestFlag);
})

export { getUsers, addGoogleUser };

