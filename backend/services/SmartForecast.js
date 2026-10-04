const Centre = require('../models/Centre');
const Booking = require('../models/Booking');
const WaitTimePredictor = require('./WaitTimePredictor');
const ZeroNetworkNotifier = require('./ZeroNetworkNotifier');
const { generateHindiExplanation } = require('../integrations/MockIntegrations');

class CongestionReductionEngine {
  /**
   * Analyzes an overloaded centre and proposes moving farmers to a nearby under-used centre.
   */
  static async proposeRedistribution(overloadedCentreId, date) {
    const overloadedWait = await WaitTimePredictor.predictForCentre(overloadedCentreId);
    if (overloadedWait < 120) return null; // Not congested enough

    const centre = await Centre.findById(overloadedCentreId);
    
    // Find nearby under-used centres in same district
    const nearby = await Centre.find({ district: centre.district, _id: { $ne: centre._id }, status: 'Open' });
    let bestAlternative = null;
    let lowestWait = 999;

    for (const alt of nearby) {
      const wait = await WaitTimePredictor.predictForCentre(alt._id);
      if (wait < lowestWait && wait < 60) {
        lowestWait = wait;
        bestAlternative = alt;
      }
    }

    if (!bestAlternative) return null;

    // Propose moving the last 10 waitlisted/waiting bookings
    const movableBookings = await Booking.find({ 
      centre: overloadedCentreId, 
      date, 
      queueStatus: { $in: ['waiting', 'waitlisted'] },
      procurementStage: 'slot_booked'
    }).sort({ createdAt: -1 }).limit(10);

    if (movableBookings.length === 0) return null;

    return {
      type: 'REDISTRIBUTION',
      sourceCentre: centre.name,
      targetCentre: bestAlternative.name,
      targetCentreId: bestAlternative._id,
      bookingsAffected: movableBookings.length,
      estimatedWaitReduction: overloadedWait - lowestWait,
      description: `Move ${movableBookings.length} farmers from ${centre.name} (Wait: ${overloadedWait}m) to ${bestAlternative.name} (Wait: ${lowestWait}m).`
    };
  }

  static async executeRedistribution(sourceCentreId, targetCentreId, targetSlotId, date, io) {
    // In a full app, we'd move specific bookings and rebuild tokens.
    // For prototype, we simulate sending a switch offer to them.
    const movableBookings = await Booking.find({ 
      centre: sourceCentreId, 
      date, 
      queueStatus: 'waiting',
      procurementStage: 'slot_booked'
    }).sort({ createdAt: -1 }).limit(10);

    const targetCentre = await Centre.findById(targetCentreId);
    
    const reasonPrompt = `To avoid a long wait, you can switch your booking to ${targetCentre.name} which has no queue right now. Reply YES to accept.`;
    const hindiReason = await generateHindiExplanation(reasonPrompt);

    for (const b of movableBookings) {
      await ZeroNetworkNotifier.notifyFarmer(b.farmer, hindiReason);
      b.advisorState = 'RESCHEDULE';
      b.advisorReason = hindiReason;
      await b.save();
      
      if (io) {
        io.to(`centre:${b.centre}`).emit('queue:update', { bookingId: b._id, advisorState: 'RESCHEDULE' });
      }
    }

    return movableBookings.length;
  }
}

class SmartForecast {
  /**
   * Forecasts crowd for the next 60 minutes based on active slots and suggests action.
   */
  static async generateForecast(centreId, date) {
    const centre = await Centre.findById(centreId);
    
    const incomingBookings = await Booking.countDocuments({
      centre: centreId,
      date,
      procurementStage: 'slot_booked',
      queueStatus: { $in: ['waiting', 'waitlisted'] }
    });

    const currentCapacity = (60 / (centre.averageServiceTimeMinutes || 15)) * (centre.activeWeighingCounters || 1);
    
    if (incomingBookings > currentCapacity * 1.5) {
      return {
        level: 'High Congestion Expected',
        expectedArrivals: incomingBookings,
        capacityNextHour: Math.round(currentCapacity),
        recommendedAction: 'Activate 1 extra weighing counter',
        actionPayload: { action: 'INC_COUNTER', value: 1 }
      };
    } else {
      return {
        level: 'Normal',
        expectedArrivals: incomingBookings,
        capacityNextHour: Math.round(currentCapacity),
        recommendedAction: 'No action needed',
        actionPayload: null
      };
    }
  }

  static async approveAction(centreId, payload) {
    if (!payload) return;
    const centre = await Centre.findById(centreId);
    if (payload.action === 'INC_COUNTER') {
      centre.activeWeighingCounters += payload.value;
      await centre.save();
    }
  }
}

module.exports = { CongestionReductionEngine, SmartForecast };
