const express = require('express');
const { getDistricts, getTaluks, getVillages } = require('../controllers/geoController');

const router = express.Router();

router.get('/districts', getDistricts);
router.get('/taluks', getTaluks);
router.get('/villages', getVillages);

module.exports = router;

