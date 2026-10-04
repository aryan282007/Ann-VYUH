const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Centre = require('../models/Centre');
const Slot = require('../models/Slot');
const { assertStaffScope } = require('../middleware/auth');
const GoWaitRescheduleAdvisor = require('../services/GoWaitRescheduleAdvisor');
const { logAction } = require('../utils/auditLogger');
const { ensureSlotsForDate } = require('../utils/slotGenerator');

async function getCentreQueue(req, res) {
  try {
    const { centreId, date } = req.params;
    assertStaffScope(req, centreId);

    const bookings = await Booking.find({ centre: centreId, date })
      .populate('farmer', 'name mobileNumber')
      .sort({ startTime: 1, createdAt: 1 });

    const centre = await Centre.findById(centreId);
    const slots = centre ? await ensureSlotsForDate(centre, date) : [];
    const totalCapacityToday = slots.reduce((sum, s) => sum + s.capacity, 0);

    const completed = bookings.filter((b) => b.queueStatus === 'completed').length;
    const cancelledOrAbsent = bookings.filter((b) => ['cancelled', 'absent'].includes(b.queueStatus)).length;

    const summary = {
      totalBooked: bookings.length,
      checkedIn: bookings.filter((b) => b.procurementStage !== 'slot_booked').length,
      completed,
      waiting: bookings.filter((b) => b.queueStatus === 'waiting').length,
      waitlisted: bookings.filter((b) => b.queueStatus === 'waitlisted').length,
      remainingToday: Math.max(totalCapacityToday - completed - cancelledOrAbsent, 0),
    };

    res.json({ bookings, summary });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Error', error: err.message });
  }
}

async function checkIn(req, res) {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    assertStaffScope(req, booking.centre);

    booking.checkedInAt = new Date();
    booking.procurementStage = 'arrived';
    
    booking.stageTimeline.push({
      stage: 'arrived',
      timestamp: new Date(),
      actorId: req.user.id,
      actorRole: req.user.role
    });
    
    await booking.save();
    await logAction({ req, action: 'CHECK_IN', entityType: 'Booking', entityId: booking._id });

    const io = req.app.get('io');
    io.to(`centre:${booking.centre}`).emit('queue:update', { bookingId: booking._id, status: 'checked_in', stage: 'arrived' });
    
    // Evaluate Advisor for all waitlisted and waiting in slot
    await GoWaitRescheduleAdvisor.evaluateSlot(booking.slot, io);

    res.json(booking);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Check-in failed' });
  }
}

async function callNext(req, res) {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    assertStaffScope(req, booking.centre);

    await Booking.updateMany(
      { slot: booking.slot, queueStatus: 'processing' },
      { queueStatus: 'completed', completedAt: new Date() }
    );

    booking.queueStatus = 'processing';
    booking.calledAt = new Date();
    booking.procurementStage = 'weighing'; // Moving to weighing area
    booking.stageTimeline.push({
      stage: 'weighing',
      timestamp: new Date(),
      actorId: req.user.id,
      actorRole: req.user.role
    });
    await booking.save();

    await logAction({ req, action: 'CALL_NEXT', entityType: 'Booking', entityId: booking._id });

    const io = req.app.get('io');
    io.to(`centre:${booking.centre}`).emit('queue:update', { bookingId: booking._id, status: 'processing', stage: 'weighing' });
    
    await GoWaitRescheduleAdvisor.evaluateSlot(booking.slot, io);

    res.json(booking);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Could not advance queue' });
  }
}

async function markAbsent(req, res) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const booking = await Booking.findById(req.params.bookingId).session(session);
      if (!booking) throw Object.assign(new Error('Booking not found'), { status: 404 });
      assertStaffScope(req, booking.centre);

      const slot = await Slot.findById(booking.slot).session(session);
      if (slot) {
        if (booking.queueStatus === 'waitlisted') {
          slot.waitlistCount = Math.max(0, slot.waitlistCount - 1);
        } else {
          slot.bookedCount = Math.max(0, slot.bookedCount - 1);
        }
        await slot.save({ session });
      }

      booking.queueStatus = 'absent';
      await booking.save({ session });
      result = booking;
    });

    const io = req.app.get('io');
    io.to(`centre:${result.centre}`).emit('queue:update', { bookingId: result._id, status: 'absent' });
    
    await GoWaitRescheduleAdvisor.evaluateSlot(result.slot, io);

    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Failed' });
  } finally {
    session.endSession();
  }
}

module.exports = { getCentreQueue, checkIn, callNext, markAbsent };
