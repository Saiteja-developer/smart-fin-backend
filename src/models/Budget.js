const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  used: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 },
  status: { type: String, enum: ['On Track', 'Exceeded'], default: 'On Track' }
}, { timestamps: true });


module.exports = mongoose.model('Budget', budgetSchema);
