const express = require('express');
const {
  getFarmer,
  getAllFarmers,
  updateLocation,
  updatePersonalDetails,
  submitAadhaarEKYC,
  submitLandRecords,
  acceptPolicy,
  updatePreferredCentres,
  updateBankDetails,
} = require('../controllers/farmerController');
const { requireAuth } = require('../middleware/auth');
const { handleLeaseDocumentUpload } = require('../middleware/upload');

const router = express.Router();

const roles = ['farmer', 'centre_admin', 'district_admin', 'state_admin', 'system_admin'];

router.get('/', requireAuth(['centre_admin', 'district_admin', 'state_admin', 'system_admin']), getAllFarmers);
router.get('/:id', requireAuth(roles), getFarmer);
router.put('/:id/location', requireAuth(roles), updateLocation);
router.put('/:id/personal', requireAuth(roles), updatePersonalDetails);
router.put('/:id/aadhaar', requireAuth(roles), submitAadhaarEKYC);
router.put('/:id/land-records', requireAuth(roles), handleLeaseDocumentUpload, submitLandRecords);
router.put('/:id/policy', requireAuth(roles), acceptPolicy);
router.put('/:id/preferred-centres', requireAuth(roles), updatePreferredCentres);
router.put('/:id/bank-details', requireAuth(roles), updateBankDetails);

module.exports = router;

