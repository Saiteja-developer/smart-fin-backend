const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getOrCreate = async (req, res, next) => {
  try {
    const { month, amount } = req.query; // can also use req.body
    const key = month || new Date().toISOString().slice(0, 7); // YYYY-MM

    let doc = await Budget.findOne({ userId: req.user.id, month: key });

    // Create new budget if not found and amount provided
    if (!doc && amount) {
      doc = await Budget.create({
        userId: req.user.id,
        month: key,
        amount: Number(amount),
      });
    }

    if (!doc) {
      return res.status(404).json({ message: 'No budget set for this month' });
    }

    // Recompute used and remaining from transactions
    const start = new Date(key + '-01');
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    const spentAgg = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          type: 'expense',
          date: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const used = spentAgg[0]?.total || 0;
    doc.used = used;
    doc.remaining = doc.amount - doc.used;
    if (isNaN(doc.remaining)) doc.remaining = 0;
    doc.status = doc.remaining > 0 ? 'On Track' : 'Exceeded';

    await doc.save();
    res.json(doc);
  } catch (e) {
    next(e);
  }
};

exports.setOrUpdate = async (req, res, next) => {
  try {
    const { month, amount } = req.body;
    if (!month || !amount) {
      return res
        .status(400)
        .json({ message: 'month and amount are required' });
    }

    const doc = await Budget.findOneAndUpdate(
      { userId: req.user.id, month },
      { amount: Number(amount) },
      { new: true, upsert: true }
    );

    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
};
