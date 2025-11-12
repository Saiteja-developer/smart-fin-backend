const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');
const mongoose = require('mongoose');
const { sendNotification } = require('../utils/notifier');
const User = require('../models/User');

exports.list = async (req, res, next) => {
  try {
    const { from, to, type, category, q } = req.query;
    const filter = { userId: req.user.id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (from || to) filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
    if (q) filter.title = new RegExp(q, 'i');

    const items = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const tx = await Transaction.create(payload);

    // Goal Auto-Update + Email Notification
    if (tx.type === 'income' && tx.category.toLowerCase() === 'savings') {
      const goal = await Goal.findOne({
        userId: req.user.id,
        status: 'Active'
      }).sort({ createdAt: 1 });

      if (goal) {
        goal.savedAmount += tx.amount;

        // When goal reaches target
        if (goal.savedAmount >= goal.targetAmount) {
          goal.status = 'Completed';
          await goal.save();

          const user = await User.findById(req.user.id);
          if (user) {
            await sendNotification(
              user.email,
              'SmartFin Goal Completed!',
              `Hi ${user.name},\n\nCongratulations! You have successfully achieved your savings goal: "${goal.title}".\nKeep saving smart with SmartFin.\n\nBest,\nSmartFin Team`
            );
          }
        } else {
          await goal.save();
        }
      }
    }

    res.status(201).json(tx);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json(tx);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted', id: tx._id });
  } catch (e) {
    next(e);
  }
};

exports.summary = async (req, res, next) => {
  try {
    const { month } = req.query;
    const [y, m] = (month || '').split('-').map(Number);
    const start = month
      ? new Date(y, m - 1, 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = month
      ? new Date(y, m, 1)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

    const agg = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const income = agg.find(a => a._id === 'income')?.total || 0;
    const expense = agg.find(a => a._id === 'expense')?.total || 0;
    res.json({
      month: month || `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
      income,
      expense,
      savings: income - expense
    });
  } catch (e) {
    next(e);
  }
};
