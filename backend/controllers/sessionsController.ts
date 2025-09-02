import asyncHandler from 'express-async-handler';
import Sessions from '../models/sessionsModel';
import Messages from '../models/messagesModel';

// @desc    get sessions (optionally by user)
// @route   GET /api/sessions?user=:userId
// @access  public
const getSessions = asyncHandler(async (req, res) => {
  const { user } = req.query as { user?: string };
  const query = user ? { user } : {};
  const list = await Sessions.find(query).sort({ createdAt: -1 });
  res.json(list);
});

// @desc    create session
// @route   POST /api/sessions
// @access  public
const addSession = asyncHandler(async (req, res) => {
  const { user, name, assistant } = req.body;
  if (!user || !name || !assistant) {
    res.status(400);
    throw new Error('user, name, assistant are required');
  }
  const created = await Sessions.create({ user, name, assistant });
  res.status(201).json(created);
});

// @desc    update session
// @route   PUT /api/sessions/:id
// @access  public
const updateSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  const updated = await Sessions.findByIdAndUpdate(id, update, { new: true });
  if (!updated) {
    res.status(404);
    throw new Error('Session not found');
  }
  res.json(updated);
});

// @desc    delete session
// @route   DELETE /api/sessions/:id
// @access  public
const deleteSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Messages.deleteMany({ session: id });
  const deleted = await Sessions.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404);
    throw new Error('Session not found');
  }
  res.json({ success: true });
});

export { getSessions, addSession, updateSession, deleteSession };