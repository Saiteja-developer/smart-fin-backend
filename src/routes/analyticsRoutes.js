const express = require('express');
const auth = require('../middleware/auth');
const { getHealthScore, getPrediction } = require('../controllers/analyticsController');
const router = express.Router();

router.use(auth);
router.get('/health', getHealthScore);
router.get('/predict', getPrediction);

module.exports = router;
