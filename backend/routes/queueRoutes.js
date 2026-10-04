const express = require('express');
const { getCentreQueue, checkIn, callNext, markAbsent } = require('../controllers/queueController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const staffRoles = ['centre_admin', 'district_admin', 'state_admin', 'system_admin'];

router.get('/centre/:centreId/date/:date', requireAuth(staffRoles), getCentreQueue);
router.post('/:bookingId/check-in', requireAuth(staffRoles), checkIn);
router.post('/:bookingId/call-next', requireAuth(staffRoles), callNext);
router.post('/:bookingId/mark-absent', requireAuth(staffRoles), markAbsent);

module.exports = router;
