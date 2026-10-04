const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Centre = require('../models/Centre');
const Slot = require('../models/Slot');
const Farmer = require('../models/Farmer');
const CropRate = require('../models/CropRate');
const { buildToken } = require('../utils/tokenGenerator');

async function computeQueueInfo(booking) {
  if (['completed', 'cancelled', 'absent', 'waitlisted'].includes(booking.queueStatus)) {
    return { aheadCount: 0, estimatedWaitMinutes: 0, currentlyProcessing: null };
  }

  const centre = await Centre.findById(booking.centre);
  const avgServiceTime = centre.averageServiceTimeMinutes || 15;
  const counters = centre.activeWeighingCounters || 1;
  const avgMinutesPerFarmer = avgServiceTime / counters;

  const processing = await Booking.findOne({
    slot: booking.slot,
    queueStatus: 'processing',
  }).select('token');

  if (booking.procurementStage === 'slot_booked') {
    const aheadCheckedIn = await Booking.countDocuments({
      slot: booking.slot,
      queueStatus: 'waiting',
      procurementStage: { $ne: 'slot_booked' },
    });
    return {
      aheadCount: aheadCheckedIn,
      estimatedWaitMinutes: Math.round(aheadCheckedIn * avgMinutesPerFarmer),
      currentlyProcessing: processing ? processing.token : null,
      awaitingCheckIn: true,
    };
  }

  const ahead = await Booking.countDocuments({
    slot: booking.slot,
    queueStatus: 'waiting',
    procurementStage: { $ne: 'slot_booked' },
    checkedInAt: { $lt: booking.checkedInAt },
  });

  return {
    aheadCount: ahead,
    estimatedWaitMinutes: Math.round(ahead * avgMinutesPerFarmer),
    currentlyProcessing: processing ? processing.token : null,
  };
}

function isDuplicateKeyError(err) {
  return err.code === 11000;
}

async function createBooking(req, res) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const { slotId, crop, plannedQuantity, harvestDate, channel, joinWaitlist } = req.body;
      const farmerId = req.user.role === 'farmer' ? req.user.id : req.body.farmerId;
      
      const farmer = await Farmer.findById(farmerId).session(session);
      if (!farmer || farmer.profileStatus !== 'active') {
        throw Object.assign(new Error('Farmer profile not active or incomplete'), { status: 403 });
      }

      const slot = await Slot.findById(slotId).session(session);
      if (!slot) throw Object.assign(new Error('Slot not found'), { status: 404 });
      if (slot.isClosed) throw Object.assign(new Error('Slot is closed'), { status: 400 });
      
      let isWaitlisted = false;
      if (slot.bookedCount >= slot.capacity) {
        if (!joinWaitlist) {
          throw Object.assign(new Error('Slot is full. You can join the waitlist or choose another slot.'), { status: 409 });
        }
        isWaitlisted = true;
      }

      const centre = await Centre.findById(slot.centre).session(session);
      const rateDoc = await CropRate.findOne({ crop }).session(session);
      
      let dailyQueueNumber = null;
      if (!isWaitlisted) {
        const priorBookingsThatDay = await Booking.countDocuments({
          centre: slot.centre,
          date: slot.date,
          queueStatus: { $ne: 'waitlisted' }
        }).session(session);
        dailyQueueNumber = priorBookingsThatDay + 1;
      }

      const token = await buildToken({
        centre,
        date: slot.date,
        crop,
        slotId: slot._id,
        dailyQueueNumber: dailyQueueNumber || 0, // 0 for waitlisted tokens initially
      });

      const bankSnapshot = farmer.bankDetails ? {
        accountHolderName: farmer.bankDetails.accountHolderName,
        bankName: farmer.bankDetails.bankName,
        accountNumberLast4: farmer.bankDetails.accountNumber ? farmer.bankDetails.accountNumber.slice(-4) : null,
        ifscCode: farmer.bankDetails.ifscCode,
      } : {};

      const booking = new Booking({
        token: isWaitlisted ? `${token}-WL` : token,
        farmer: farmer._id,
        centre: centre._id,
        slot: slot._id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        channel: channel || 'web',
        queueStatus: isWaitlisted ? 'waitlisted' : 'waiting',
        procurementStage: 'slot_booked',
        crop,
        unit: rateDoc ? rateDoc.unit : 'unit',
        plannedQuantity,
        numberOfBags: plannedQuantity,
        harvestDate,
        officialRatePerUnit: rateDoc ? rateDoc.ratePerUnit : 0,
        estimatedValue: rateDoc ? rateDoc.ratePerUnit * plannedQuantity : 0,
        dailyQueueNumber: isWaitlisted ? null : dailyQueueNumber,
        bankSnapshot,
        advisorState: 'NORMAL',
        stageTimeline: [
          { stage: 'slot_booked', timestamp: new Date(), actorId: req.user.id, actorRole: req.user.role }
        ]
      });

      await booking.save({ session });
      
      if (isWaitlisted) {
        slot.waitlistCount += 1;
      } else {
        slot.bookedCount += 1;
      }
      await slot.save({ session });
      
      result = booking;
    });
    
    req.app.get('io').emit('slots:capacity_updated', { centre: result.centre, date: result.date });
    res.status(201).json(result);
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return res.status(409).json({ message: 'Concurrency error: Try again.' });
    }
    res.status(err.status || 500).json({ message: err.message || 'Booking failed' });
  } finally {
    session.endSession();
  }
}

async function cancelBooking(req, res) {
  const session = await mongoose.startSession();
  try {
    let result;
    let promotedWaitlistBooking = null;
    await session.withTransaction(async () => {
      const booking = await Booking.findById(req.params.id).session(session);
      if (!booking) throw Object.assign(new Error('Not found'), { status: 404 });
      if (req.user.role === 'farmer' && String(booking.farmer) !== String(req.user.id)) {
        throw Object.assign(new Error('Not yours'), { status: 403 });
      }
      
      if (!['waiting', 'waitlisted'].includes(booking.queueStatus) || booking.procurementStage !== 'slot_booked') {
        throw Object.assign(new Error('Cannot cancel now'), { status: 409 });
      }

      const slot = await Slot.findById(booking.slot).session(session);
      if (slot) {
        if (booking.queueStatus === 'waitlisted') {
          slot.waitlistCount = Math.max(0, slot.waitlistCount - 1);
        } else {
          slot.bookedCount = Math.max(0, slot.bookedCount - 1);
          
          // Auto-promote waitlisted farmer if any
          promotedWaitlistBooking = await Booking.findOne({ slot: slot._id, queueStatus: 'waitlisted' })
            .sort({ createdAt: 1 })
            .session(session);
            
          if (promotedWaitlistBooking) {
            const priorBookingsThatDay = await Booking.countDocuments({
              centre: slot.centre,
              date: slot.date,
              queueStatus: { $ne: 'waitlisted' }
            }).session(session);
            
            promotedWaitlistBooking.queueStatus = 'waiting';
            promotedWaitlistBooking.dailyQueueNumber = priorBookingsThatDay + 1;
            
            const newToken = await buildToken({
              centre: await Centre.findById(slot.centre).session(session),
              date: slot.date,
              crop: promotedWaitlistBooking.crop,
              slotId: slot._id,
              dailyQueueNumber: promotedWaitlistBooking.dailyQueueNumber,
            });
            promotedWaitlistBooking.token = newToken;
            
            await promotedWaitlistBooking.save({ session });
            
            slot.bookedCount += 1;
            slot.waitlistCount = Math.max(0, slot.waitlistCount - 1);
          }
        }
        await slot.save({ session });
      }

      booking.queueStatus = 'cancelled';
      await booking.save({ session });
      result = booking;
    });

    req.app.get('io').to(`centre:${result.centre}`).emit('queue:update', { bookingId: result._id, status: 'cancelled' });
    req.app.get('io').emit('slots:capacity_updated', { centre: result.centre, date: result.date });
    
    // Notify promoted farmer (in a real app, send SMS)
    if (promotedWaitlistBooking) {
      console.log(`[Auto-Promote] Booking ${promotedWaitlistBooking._id} promoted from waitlist!`);
    }
    
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Cancel failed' });
  } finally {
    session.endSession();
  }
}

async function getBookingByToken(req, res) {
  try {
    const booking = await Booking.findOne({ token: req.params.token })
      .populate('centre', 'name district codePrefix status location')
      .populate('farmer', 'name mobileNumber preferredLanguage');
    if (!booking) return res.status(404).json({ message: 'Token not found' });
    
    const queueInfo = await computeQueueInfo(booking);
    res.json({ booking, queue: queueInfo });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
}

async function getBookingsForFarmer(req, res) {
  try {
    if (req.user.role === 'farmer' && String(req.user.id) !== String(req.params.farmerId)) {
      return res.status(403).json({ message: 'Not yours' });
    }
    const bookings = await Booking.find({ farmer: req.params.farmerId })
      .populate('centre', 'name district codePrefix')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
}

async function rescheduleBooking(req, res) {
  // Simplistic reschedule for the GoWaitReschedule logic
  res.status(501).json({ message: 'Not implemented' });
}

module.exports = {
  createBooking,
  cancelBooking,
  getBookingByToken,
  getBookingsForFarmer,
  computeQueueInfo,
  rescheduleBooking
};
