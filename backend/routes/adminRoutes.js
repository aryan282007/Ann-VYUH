const express = require('express');
const {
  listCropRates,
  upsertCropRate,
  updateCropRate,
  createStaff,
  listStaff,
  getStatsOverview,
} = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const adminRoles = ['state_admin', 'system_admin'];

router.get('/crop-rates', listCropRates);
router.post('/crop-rates', requireAuth(adminRoles), upsertCropRate);
router.put('/crop-rates/:id', requireAuth(adminRoles), updateCropRate);
router.post('/staff', requireAuth(adminRoles), createStaff);
router.get('/staff', requireAuth(['district_admin', 'state_admin', 'system_admin']), listStaff);
router.get('/stats-overview', requireAuth(['district_admin', 'state_admin', 'system_admin']), getStatsOverview);

module.exports = router;
