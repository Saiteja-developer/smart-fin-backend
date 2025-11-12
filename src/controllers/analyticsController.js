const { calculateHealthScore, predictNextMonthExpenses } = require('../utils/analytics');

exports.getHealthScore = async (req, res, next) => {
  try {
    const result = await calculateHealthScore(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};


exports.getPrediction = async (req, res, next) => {
  try {
    const result = await predictNextMonthExpenses(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

