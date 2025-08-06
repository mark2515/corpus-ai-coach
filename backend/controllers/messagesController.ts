import asyncHandler from 'express-async-handler';
import Messages from '../models/messagesModel';

//@desc     get all messages from the login user
//@route    GET /api/messages
//@access   public
const getMessages = asyncHandler(async (req, res) => {
})

// @desc    add a new message
// @route   POST /api/messages
// @access  public
const addNewMessage = asyncHandler(async (req, res) => {
  const { user, role, content } = req.body;
  const newMessage = await Messages.create({ user, role, content });
  res.status(201).json(newMessage);
})

export { getMessages, addNewMessage };