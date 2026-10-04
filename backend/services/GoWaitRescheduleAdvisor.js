const Booking = require('../models/Booking');
const WaitTimePredictor = require('./WaitTimePredictor');
const { generateHindiExplanation } = require('../integrations/MockIntegrations');
const ZeroNetworkNotifier = require('./ZeroNetworkNotifier');

class GoWaitRescheduleAdvisor {
  /**
   * Recomputes advisor states for all active bookings in a slot when queue changes.
   */
  static async evaluateSlot(slotId, io) {
    const bookings = await Booking.find({ slot: slotId, queueStatus: 'waiting' });
    
    for (const booking of bookings) {
      const oldState = booking.advisorState;
      const { waitMinutes, aheadCount } = await WaitTimePredictor.predictForBooking(booking);
      
      let newState = 'NORMAL';
      let reasonPrompt = '';

      if (booking.procurementStage === 'slot_booked') {
        if (waitMinutes > 120) {
          newState = 'RESCHEDULE';
          reasonPrompt = `The queue is very long (${aheadCount} ahead). You might wait over 2 hours. Consider rescheduling for another day.`;
        } else if (waitMinutes > 60) {
          newState = 'WAIT';
          reasonPrompt = `The centre is crowded (${aheadCount} ahead). Please delay your arrival by about ${waitMinutes} minutes.`;
        } else {
          newState = 'GO';
          reasonPrompt = `Normal queue. Please arrive at your scheduled time.`;
        }
      } else {
        // Already arrived
        if (waitMinutes > 90) {
          newState = 'WAIT';
          reasonPrompt = `Heavy congestion. Your turn is approximately ${waitMinutes} minutes away.`;
        } else {
          newState = 'GO';
          reasonPrompt = `Your turn is approaching (${waitMinutes} mins). Please stay near the weighing area.`;
        }
      }

      if (newState !== oldState) {
        booking.advisorState = newState;
        booking.advisorReason = await generateHindiExplanation(reasonPrompt);
        await booking.save();
        
        // Notify via Websocket
        if (io) {
          io.to(`centre:${booking.centre}`).emit('queue:update', { bookingId: booking._id, status: booking.queueStatus, advisorState: newState });
        }
        
        // Notify farmer via ZeroNetworkNotifier
        await ZeroNetworkNotifier.notifyFarmer(booking.farmer, `ALERT: ${booking.advisorReason}`);
      }
    }
  }
}

module.exports = GoWaitRescheduleAdvisor;
