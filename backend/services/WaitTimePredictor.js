const Booking = require('../models/Booking');
const Centre = require('../models/Centre');

class WaitTimePredictor {
  /**
   * Predicts wait time for a specific booking.
   */
  static async predictForBooking(booking) {
    if (['completed', 'cancelled', 'absent', 'waitlisted'].includes(booking.queueStatus)) {
      return { waitMinutes: 0, confidence: 100 };
    }

    const centre = await Centre.findById(booking.centre);
    const counters = centre.activeWeighingCounters || 1;
    const avgServiceTime = centre.averageServiceTimeMinutes || 15;
    
    // Farmers ahead in the queue
    let aheadCount = 0;
    if (booking.procurementStage === 'slot_booked') {
      aheadCount = await Booking.countDocuments({
        slot: booking.slot,
        queueStatus: 'waiting',
        procurementStage: { $ne: 'slot_booked' },
      });
    } else {
      aheadCount = await Booking.countDocuments({
        slot: booking.slot,
        queueStatus: 'waiting',
        procurementStage: { $ne: 'slot_booked' },
        checkedInAt: { $lt: booking.checkedInAt },
      });
    }

    const waitMinutes = Math.round((aheadCount * avgServiceTime) / counters);
    
    // Confidence is higher if queue is shorter and labour is sufficient
    let confidence = 90;
    if (aheadCount > 20) confidence -= 10;
    if (centre.labourOnDuty < (counters * 3)) confidence -= 15;

    return {
      waitMinutes,
      confidence: Math.max(50, confidence),
      aheadCount
    };
  }

  static async predictForCentre(centreId) {
    const centre = await Centre.findById(centreId);
    const waitingCount = await Booking.countDocuments({
      centre: centreId,
      queueStatus: 'waiting',
      procurementStage: { $ne: 'slot_booked' },
    });
    const counters = centre.activeWeighingCounters || 1;
    return Math.round((waitingCount * (centre.averageServiceTimeMinutes || 15)) / counters);
  }
}

module.exports = WaitTimePredictor;
