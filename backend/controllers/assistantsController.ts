import asyncHandler from 'express-async-handler';
import Assistants from '../models/assistantsModel';

// @desc    get assistants (optionally by user)
// @route   GET /api/assistants?user=:userId
// @access  public
const getAssistants = asyncHandler(async (req, res) => {
  const { user } = req.query as { user?: string };
  const query = user ? { user } : {};
  const list = await Assistants.find(query).sort({ createdAt: -1 });
  res.json(list);
});

// @desc    create assistant
// @route   POST /api/assistants
// @access  public
const addAssistant = asyncHandler(async (req, res) => {
  const { user, name, model, description, prompt, temperature, top_p, max_log, max_tokens } = req.body;
  if (!user || !name || !prompt) {
    res.status(400);
    throw new Error('user, name, prompt are required');
  }
  const created = await Assistants.create({
    user, name, model, description, prompt, temperature, top_p, max_log, max_tokens,
  });
  res.status(201).json(created);
});

// @desc    update assistant
// @route   PUT /api/assistants/:id
// @access  public
const updateAssistant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  const updated = await Assistants.findByIdAndUpdate(id, update, { new: true });
  if (!updated) {
    res.status(404);
    throw new Error('Assistant not found');
  }
  res.json(updated);
});

// @desc    delete assistant
// @route   DELETE /api/assistants/:id
// @access  public
const deleteAssistant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Assistants.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404);
    throw new Error('Assistant not found');
  }
  res.json({ success: true });
});

export { getAssistants, addAssistant, updateAssistant, deleteAssistant };