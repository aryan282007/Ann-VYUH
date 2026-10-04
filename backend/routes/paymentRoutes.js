const express = require('express');
const { getPaymentRequests, initiatePayment, retryFailedPayment } = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const adminRoles = ['state_admin', 'district_admin', 'system_admin'];

router.get('/requests', requireAuth(adminRoles), getPaymentRequests);
router.post('/:bookingId/initiate', requireAuth(adminRoles), initiatePayment);
router.post('/:bookingId/retry', requireAuth(adminRoles), retryFailedPayment);

module.exports = router;
