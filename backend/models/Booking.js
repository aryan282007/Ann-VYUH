const mongoose = require('mongoose');

const PROCUREMENT_STAGES = [
  'slot_booked',
  'arrived',
  'weighing',
  'quality_check',
  'accepted',
  'rejected',
  'receipt_generated',
  'transport_assigned',
  'warehouse_confirmed',
  'payment_processing',
  'payment_credited',
];

const bookingSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true }, // e.g. "TNJ-014-20260908-PADDY-S3-Q05"
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    channel: { type: String, enum: ['web', 'ivr'], default: 'web' },

    queueStatus: {
      type: String,
      enum: ['waiting', 'processing', 'completed', 'absent', 'cancelled', 'waitlisted'],
      default: 'waiting',
    },

    procurementStage: {
      type: String,
      enum: PROCUREMENT_STAGES,
      default: 'slot_booked',
    },

    // GoWaitRescheduleAdvisor states
    advisorState: {
      type: String,
      enum: ['GO', 'WAIT', 'RESCHEDULE', 'NORMAL'],
      default: 'NORMAL',
    },
    advisorReason: { type: String, default: null }, // Hindi explanation

    crop: { type: String, trim: true },
    unit: { type: String, trim: true, default: null },
    variety: { type: String, trim: true, default: null },
    
    plannedQuantity: { type: Number, default: null },
    numberOfBags: { type: Number, default: null },
    harvestDate: { type: Date, default: null },
    
    quantity: { type: Number, default: null },
    officialRatePerUnit: { type: Number, default: null },
    estimatedValue: { type: Number, default: null },

    rejectionReason: { type: String, default: null },
    
    // Receipt/transport
    receiptNumber: { type: String, default: null },
    transporterName: { type: String, default: null },
    warehouseName: { type: String, default: null },

    dailyQueueNumber: { type: Number, default: null },

    bankSnapshot: {
      accountHolderName: { type: String, trim: true, default: null },
      bankName: { type: String, trim: true, default: null },
      accountNumberLast4: { type: String, trim: true, default: null },
      ifscCode: { type: String, trim: true, default: null },
    },

    paymentStatus: {
      type: String,
      enum: ['not_applicable', 'pending', 'processing', 'failed', 'credited'],
      default: 'not_applicable',
    },
    paymentRequestedAt: { type: Date, default: null },
    paidAmount: { type: Number, default: null },
    deductions: { type: Number, default: 0 },
    pfmsUtr: { type: String, default: null },
    paidAt: { type: Date, default: null },

    // Auditing
    stageTimeline: [
      {
        _id: false,
        stage: { type: String, enum: PROCUREMENT_STAGES },
        timestamp: { type: Date, default: Date.now },
        actorId: { type: mongoose.Schema.Types.ObjectId },
        actorRole: { type: String },
      }
    ],

    calledAt: { type: Date, default: null },
    checkedInAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

bookingSchema.statics.PROCUREMENT_STAGES = PROCUREMENT_STAGES;

bookingSchema.index(
  { centre: 1, date: 1, dailyQueueNumber: 1 },
  { unique: true, partialFilterExpression: { dailyQueueNumber: { $type: 'number' } } }
);

module.exports = mongoose.model('Booking', bookingSchema);

