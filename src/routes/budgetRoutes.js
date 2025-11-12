const express = require('express');
const auth = require('../middleware/auth');
const { getOrCreate, setOrUpdate } = require('../controllers/budgetController');
const router = express.Router();

router.use(auth);
router.get('/', getOrCreate);      // ?month=YYYY-MM  (&amount=number if creating first time)
router.post('/', setOrUpdate);     // { month, amount }

module.exports = router;
