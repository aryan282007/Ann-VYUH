const express = require('express');
const { updateStage, recordQuantity } = require('../controllers/procurementController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const roles = ['centre_admin', 'district_admin', 'state_admin', 'system_admin'];

router.post('/:bookingId/stage', requireAuth(roles), updateStage);
router.post('/:bookingId/quantity', requireAuth(roles), recordQuantity);

module.exports = router;
