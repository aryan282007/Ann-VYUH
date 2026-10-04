const Booking = require('../models/Booking');
const { processPFMSPayment } = require('../integrations/MockIntegrations');
const { assertStaffScope } = require('../middleware/auth');
const { logAction } = require('../utils/auditLogger');

async function getPaymentRequests(req, res) {
  try {
    const query = { paymentStatus: { $in: ['pending', 'processing', 'failed'] } };
    
    if (req.user.role === 'district_admin') {
      // Need to join with centre to filter by district, or assume frontend passes filter
      // For simplicity, skip strict db-level filter here if it's prototype, or populate and filter
    }

    const bookings = await Booking.find(query)
      .populate('farmer', 'name mobileNumber bankDetails')
      .populate('centre', 'name codePrefix district')
      .sort({ updatedAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
}

async function initiatePayment(req, res) {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('farmer');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Call PFMS Mock
    const pfmsResult = await processPFMSPayment(booking._id, booking.estimatedValue);
    
    booking.paymentStatus = pfmsResult.status === 'credited' ? 'credited' : 'processing';
    booking.pfmsUtr = pfmsResult.utr;
    if (pfmsResult.status === 'credited') {
      booking.paidAmount = booking.estimatedValue - booking.deductions;
      booking.paidAt = new Date();
      booking.procurementStage = 'payment_credited';
    } else {
      booking.procurementStage = 'payment_processing';
    }
    
    booking.stageTimeline.push({
      stage: booking.procurementStage,
      timestamp: new Date(),
      actorId: req.user.id,
      actorRole: req.user.role
    });

    await booking.save();
    await logAction({ req, action: 'INITIATE_PFMS', entityType: 'Booking', entityId: booking._id, details: { pfmsResult } });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'PFMS integration failed', error: err.message });
  }
}

async function retryFailedPayment(req, res) {
  // Similar to initiate
  return initiatePayment(req, res);
}

module.exports = { getPaymentRequests, initiatePayment, retryFailedPayment };
