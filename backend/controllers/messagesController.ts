import asyncHandler from 'express-async-handler';
import Messages from '../models/messagesModel';

//@desc     get all messages from the login user
//@route    GET /api/messages
//@access   public
const getMessages = asyncHandler(async (req, res) => {
  const { userId, sessionId } = req.query;
  
  let filter: any = {};
  
  if (userId) {
    filter.user = userId;
  }
  
  if (sessionId) {
    filter.session = sessionId;
  }
  
  const messages = await Messages.find(filter)
    .populate('user', 'name email')
    .populate('session', 'name')
    .sort({ createdAt: 1 });
    
  res.status(200).json(messages);
});

// @desc    get messages by session
// @route   GET /api/messages/session/:sessionId
// @access  public
const getMessagesBySession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  
  const messages = await Messages.find({ session: sessionId })
    .populate('user', 'name email')
    .populate('session', 'name')
    .sort({ createdAt: 1 });
    
  res.status(200).json(messages);
});

// @desc    add a new message
// @route   POST /api/messages
// @access  public
const addMessage = asyncHandler(async (req, res) => {
  const { user, session, role, content } = req.body;
  
  if (!user || !session || !role || !content) {
    res.status(400);
    throw new Error('Missing required fields: user, session, role, content');
  }
  
  const newMessage = await Messages.create({ user, session, role, content });
  
  const populatedMessage = await Messages.findById(newMessage._id)
    .populate('user', 'name email')
    .populate('session', 'name');
    
  res.status(201).json(populatedMessage);
});

// @desc    delete a message
// @route   DELETE /api/messages/:id
// @access  public
const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const message = await Messages.findById(id);
  
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  
  await Messages.findByIdAndDelete(id);
  res.status(200).json({ message: 'Message deleted successfully' });
});

// @desc    delete all messages by session
// @route   DELETE /api/messages/session/:sessionId
// @access  public
const deleteMessagesBySession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  
  const result = await Messages.deleteMany({ session: sessionId });
  
  res.status(200).json({ 
    message: `Successfully deleted ${result.deletedCount} messages from session`,
    deletedCount: result.deletedCount 
  });
});

export { getMessages, getMessagesBySession, addMessage, deleteMessage, deleteMessagesBySession };