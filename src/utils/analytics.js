const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const mongoose = require('mongoose');

exports.calculateHealthScore = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;

  const tx = await Transaction.aggregate([
    { $match: { userId: uid } },
    { $group: { _id: { month: { $substr: ['$date', 0, 7] }, type: '$type' }, total: { $sum: '$amount' } } }
  ]);

  // Extract monthly totals
  const months = {};
  tx.forEach(t => {
    const m = t._id.month;
    if (!months[m]) months[m] = { income: 0, expense: 0 };
    months[m][t._id.type] = t.total;
  });

  // Calculate averages and metrics
  const allMonths = Object.keys(months);
  const totalIncome = allMonths.reduce((s, m) => s + months[m].income, 0);
  const totalExpense = allMonths.reduce((s, m) => s + months[m].expense, 0);
  const avgSaving = (totalIncome - totalExpense) / allMonths.length || 0;

  // savings ratio
  const savingsRatio = totalIncome ? (avgSaving / (totalIncome / allMonths.length)) : 0;

  // consistency (lower std deviation = higher score)
  const expenses = allMonths.map(m => months[m].expense);
  const mean = expenses.reduce((a,b)=>a+b,0)/(expenses.length||1);
  const variance = expenses.reduce((a,b)=>a+Math.pow(b-mean,2),0)/(expenses.length||1);
  const consistency = 1 - Math.min(Math.sqrt(variance)/(mean||1),1);

  // budget discipline
  const budget = await Budget.findOne({ userId, month: currentMonth });
  let budgetDiscipline = 1;
  if (budget) {
    const usedRatio = budget.used / budget.amount;
    budgetDiscipline = usedRatio <= 1 ? 1 : Math.max(0, 2 - usedRatio);
  }

  const score = Math.round((savingsRatio*0.4 + consistency*0.3 + budgetDiscipline*0.3) * 100);
  let level = 'Critical';
  if (score >= 80) level = 'Excellent';
  else if (score >= 50) level = 'Moderate';

  return { score, level, details: { savingsRatio, consistency, budgetDiscipline } };
};

exports.predictNextMonthExpenses = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);
  const tx = await Transaction.aggregate([
    { $match: { userId: uid, type: 'expense' } },
    { $group: { _id: { month: { $substr: ['$date', 0, 7] } }, total: { $sum: '$amount' } } },
    { $sort: { '_id.month': 1 } }
  ]);

  const totals = tx.map(t => t.total);
  if (totals.length === 0) return { prediction: 0, confidence: 0 };

  const avg = totals.slice(-3).reduce((a,b)=>a+b,0) / Math.min(3, totals.length);
  const last = totals[totals.length-1];
  const trend = last ? (avg - last) / last : 0;
  const prediction = Math.max(0, avg * (1 + trend * 0.5));
  const confidence = Math.min(1, totals.length / 6); // more months = more confidence

  return { prediction: Math.round(prediction), confidence };
};
