const express = require('express');
const { requireAuth, assertStaffScope } = require('../middleware/auth');
const FastestCentreRecommender = require('../services/FastestCentreRecommender');
const { CongestionReductionEngine, SmartForecast } = require('../services/SmartForecast');
const DelayFlag = require('../models/DelayFlag');

const router = express.Router();

// Used by farmers in booking flow
router.get('/recommend-fastest', requireAuth(['farmer']), async (req, res) => {
  try {
    const { lat, lon, crop, quantity } = req.query;
    const recs = await FastestCentreRecommender.getRecommendations(parseFloat(lat), parseFloat(lon), crop, parseInt(quantity));
    res.json(recs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin dashboard actions
router.get('/centre/:centreId/forecast', requireAuth(['centre_admin', 'district_admin', 'state_admin', 'system_admin']), async (req, res) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const forecast = await SmartForecast.generateForecast(req.params.centreId, date);
    const proposal = await CongestionReductionEngine.proposeRedistribution(req.params.centreId, date);
    res.json({ forecast, proposal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/centre/:centreId/forecast/approve', requireAuth(['centre_admin', 'district_admin', 'state_admin', 'system_admin']), async (req, res) => {
  try {
    const { actionPayload } = req.body;
    await SmartForecast.approveAction(req.params.centreId, actionPayload);
    // Also recompute slot capacities
    const CapacityEngine = require('../services/CapacityEngine');
    await CapacityEngine.applyDynamicCapacityToSlots(req.params.centreId, new Date().toISOString().split('T')[0]);
    res.json({ message: 'Action approved and capacities recalculated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/centre/:centreId/redistribute', requireAuth(['district_admin', 'state_admin', 'system_admin']), async (req, res) => {
  try {
    const { targetCentreId } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const count = await CongestionReductionEngine.executeRedistribution(req.params.centreId, targetCentreId, null, date, req.app.get('io'));
    res.json({ message: `Notified ${count} farmers to switch.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/delay-flags', requireAuth(['district_admin', 'state_admin', 'system_admin']), async (req, res) => {
  try {
    const flags = await DelayFlag.find({ status: 'open' }).populate('centreId', 'name district').populate('bookingId', 'token');
    res.json(flags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
