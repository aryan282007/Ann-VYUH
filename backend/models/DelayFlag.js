const mongoose = require('mongoose');

const delayFlagSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    centreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true },
    stage: { type: String, required: true }, // The stage that was delayed
    expectedSlaMinutes: { type: Number, required: true },
    actualMinutes: { type: Number, required: true },
    escalationLevel: { type: String, enum: ['centre', 'district', 'state'], default: 'centre' },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    resolvedAt: { type: Date, default: null },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
    resolutionRemarks: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DelayFlag', delayFlagSchema);
