const Booking = require('../models/Booking');
const CropRate = require('../models/CropRate');
const { assertStaffScope } = require('../middleware/auth');
const { logAction } = require('../utils/auditLogger');

// POST /api/procurement/:bookingId/stage  { stage, rejectionReason, transporterName, warehouseName }
async function updateStage(req, res) {
  try {
    const { stage, rejectionReason, transporterName, warehouseName } = req.body;
    if (!Booking.PROCUREMENT_STAGES.includes(stage)) {
      return res.status(400).json({ message: `stage must be one of: ${Booking.PROCUREMENT_STAGES.join(', ')}` });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    assertStaffScope(req, booking.centre, null); // Assumes we only check centre for now, or state admin

    booking.procurementStage = stage;
    
    // Add to timeline
    booking.stageTimeline.push({
      stage,
      timestamp: new Date(),
      actorId: req.user.id,
      actorRole: req.user.role
    });

    if (stage === 'rejected') {
      booking.rejectionReason = rejectionReason;
      booking.queueStatus = 'completed';
      booking.completedAt = new Date();
    }
    
    if (stage === 'receipt_generated') {
      booking.receiptNumber = `REC-${booking.token.split('-').pop()}-${Date.now().toString().slice(-4)}`;
    }
    
    if (stage === 'transport_assigned') {
      booking.transporterName = transporterName;
    }
    
    if (stage === 'warehouse_confirmed') {
      booking.warehouseName = warehouseName;
      booking.paymentStatus = 'pending';
      booking.completedAt = new Date();
      booking.queueStatus = 'completed';
    }

    await booking.save();
    
    // Log audit action
    await logAction({ req, action: `STAGE_${stage.toUpperCase()}`, entityType: 'Booking', entityId: booking._id, details: { rejectionReason, transporterName, warehouseName } });
    
    // Broadcast via socket
    req.app.get('io').to(`centre:${booking.centre}`).emit('queue:update', { bookingId: booking._id, status: booking.queueStatus, stage });

    res.json(booking);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Could not update stage' });
  }
}

// POST /api/procurement/:bookingId/quantity  { crop, quantity }
async function recordQuantity(req, res) {
  try {
    const { crop, quantity } = req.body;
    if (!crop || quantity == null) {
      return res.status(400).json({ message: 'crop and quantity are required' });
    }

    const rate = await CropRate.findOne({ crop });
    if (!rate) {
      return res.status(404).json({ message: `No official rate configured for crop "${crop}"` });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    assertStaffScope(req, booking.centre, null);

    booking.crop = crop;
    booking.unit = rate.unit;
    booking.quantity = quantity;
    booking.officialRatePerUnit = rate.ratePerUnit;
    booking.estimatedValue = Number((quantity * rate.ratePerUnit).toFixed(2));
    
    // Automatically advance stage to weighing completed (quality_check next)
    if (booking.procurementStage === 'weighing') {
      booking.procurementStage = 'quality_check';
      booking.stageTimeline.push({
        stage: 'quality_check',
        timestamp: new Date(),
        actorId: req.user.id,
        actorRole: req.user.role
      });
    }

    await booking.save();
    
    await logAction({ req, action: `RECORD_QUANTITY`, entityType: 'Booking', entityId: booking._id, details: { quantity, estimatedValue: booking.estimatedValue } });

    res.json(booking);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Could not record quantity' });
  }
}

module.exports = { updateStage, recordQuantity };
