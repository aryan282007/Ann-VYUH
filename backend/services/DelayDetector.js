const Booking = require('../models/Booking');
const DelayFlag = require('../models/DelayFlag');

const SLA_THRESHOLDS_MINUTES = {
  'arrived': 60, // Max wait time for weighing after check-in
  'weighing': 30, // Max time for weighing process
  'quality_check': 30, // Max time for QC
  'receipt_generated': 120, // Max time to assign transport
  'transport_assigned': 240, // Max time to confirm warehouse
  'payment_processing': 2880, // 48 hours for PFMS to clear
};

class DelayDetector {
  static async checkDelays() {
    console.log('[DelayDetector] Running background SLA check...');
    
    // Find all incomplete bookings
    const bookings = await Booking.find({ queueStatus: { $in: ['waiting', 'processing'] } });
    
    for (const booking of bookings) {
      const currentStage = booking.procurementStage;
      const threshold = SLA_THRESHOLDS_MINUTES[currentStage];
      
      if (!threshold) continue;

      // Find when they entered this stage
      const stageEntry = booking.stageTimeline.slice().reverse().find(s => s.stage === currentStage);
      if (!stageEntry) continue;

      const minutesInStage = (new Date() - new Date(stageEntry.timestamp)) / 60000;
      
      if (minutesInStage > threshold) {
        // Create or escalate a DelayFlag
        let flag = await DelayFlag.findOne({ bookingId: booking._id, stage: currentStage, status: 'open' });
        
        if (!flag) {
          flag = await DelayFlag.create({
            bookingId: booking._id,
            centreId: booking.centre,
            stage: currentStage,
            expectedSlaMinutes: threshold,
            actualMinutes: minutesInStage,
            escalationLevel: 'centre'
          });
          console.log(`[DelayDetector] Created DelayFlag for Booking ${booking.token} at ${currentStage}`);
        } else {
          // Update actual minutes
          flag.actualMinutes = minutesInStage;
          
          // Escalate logic
          if (minutesInStage > threshold * 3 && flag.escalationLevel === 'centre') {
            flag.escalationLevel = 'district';
            console.log(`[DelayDetector] Escalated to District for Booking ${booking.token}`);
          } else if (minutesInStage > threshold * 6 && flag.escalationLevel === 'district') {
            flag.escalationLevel = 'state';
            console.log(`[DelayDetector] Escalated to State for Booking ${booking.token}`);
          }
          await flag.save();
        }
      }
    }
  }
}

module.exports = DelayDetector;
