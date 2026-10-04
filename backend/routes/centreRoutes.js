const express = require('express');
const {
  listCentres,
  getCentre,
  createCentre,
  updateCentre,
  setOfficerPassword,
  listStates,
  listDistricts,
  listTaluks,
  listVillages,
  getRecommendations,
} = require('../controllers/centreController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const adminRoles = ['state_admin', 'system_admin', 'district_admin'];
const allStaff = ['centre_admin', 'district_admin', 'state_admin', 'system_admin'];

router.get('/states', listStates);
router.get('/districts', listDistricts);
router.get('/taluks', listTaluks);
router.get('/villages', listVillages);
router.get('/recommendations', getRecommendations);
router.get('/', listCentres);
router.get('/:id', getCentre);
router.post('/', requireAuth(adminRoles), createCentre);
router.put('/:id', requireAuth(allStaff), updateCentre);
router.put('/:id/password', requireAuth(allStaff), setOfficerPassword);

module.exports = router;
