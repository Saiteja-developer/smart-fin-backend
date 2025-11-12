const express = require('express');
const auth = require('../middleware/auth');
const { list, create, update, remove, summary } = require('../controllers/transactionController');
const router = express.Router();

router.use(auth);
router.get('/', list);
router.get('/summary', summary);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
