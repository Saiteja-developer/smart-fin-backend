const Goal = require('../models/Goal');

exports.list = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const goal = await Goal.create(payload);
    res.status(201).json(goal);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Deleted', id: goal._id });
  } catch (e) { next(e); }
};
