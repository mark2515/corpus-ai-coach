import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';

const router = express.Router();

//@desc     get all users
//@route    GET /api/users
//@access   public
router.get('/', asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
}));

//@desc     create or update a Google user
//@route    POST /api/users/google-login
//@access   public
router.post('/google-login', asyncHandler(async (req, res) => {
    const { sub, name, email, picture } = req.body;
    if (!sub || !email) {
      res.status(400);
      throw new Error('Missing required Google user info');
    }
    const user = await User.findOneAndUpdate(
      { sub },
      { name, email, picture },
      { new: true, upsert: true }
    );
    res.status(200).json(user);
  })
);

export default router;