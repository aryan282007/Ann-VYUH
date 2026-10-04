const express = require('express');
const { getPrompt, getAllPrompts, speak } = require('../controllers/ivrController');

const router = express.Router();

router.get('/prompts', getAllPrompts);
router.get('/prompt/:step', getPrompt);
router.post('/speak', speak);

module.exports = router;

