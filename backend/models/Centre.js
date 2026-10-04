const mongoose = require('mongoose');

const centreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    codePrefix: { type: String, unique: true, sparse: true, trim: true, uppercase: true },
    state: { type: String, default: 'Madhya Pradesh', trim: true },
    district: { type: String, required: true, trim: true },
    taluk: { type: String, trim: true },
    village: { type: String, trim: true },
    address: { type: String, trim: true },
    location: {
      latitude: Number,
      longitude: Number,
    },

    // Resources for Capacity Engine
    activeWeighingCounters: { type: Number, default: 2 },
    labourOnDuty: { type: Number, default: 5 },
    storageLeftCapacity: { type: Number, default: 1000 }, // metric tons
    averageServiceTimeMinutes: { type: Number, default: 15 }, // average time per farmer

    openingTime: { type: String, default: '08:00' }, // 24h "HH:mm"
    closingTime: { type: String, default: '17:00' },
    slotDurationMinutes: { type: Number, default: 60 },
    capacityPerSlot: { type: Number, default: 20 },
    workingDays: {
      type: [String],
      enum: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
      default: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
    },

    policyLimits: {
      earliestOpeningTime: { type: String, default: '06:00' },
      latestClosingTime: { type: String, default: '20:00' },
      minSlotDurationMinutes: { type: Number, default: 30 },
      maxSlotDurationMinutes: { type: Number, default: 120 },
      minCapacityPerSlot: { type: Number, default: 5 },
      maxCapacityPerSlot: { type: Number, default: 100 },
    },

    seasonOpeningDate: { type: Date, default: null },
    seasonClosingDate: { type: Date, default: null },
    
    // Status can be used for override
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },

    crops: [
      {
        _id: false,
        name: { type: String, trim: true, required: true },
        maxQuantity: { type: Number, default: null },
      },
    ],
    
    // Legacy fields for centre admin login (deprecated in favor of Staff model with 'centre_admin' role, but keeping if still used by some controllers during migration)
    officerName: { type: String, trim: true },
    officerMobile: { type: String, trim: true },
    officerPasswordHash: { type: String, default: null, select: false },
    mustChangeOfficerPassword: { type: Boolean, default: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

centreSchema.index({ district: 1, taluk: 1 });

centreSchema.virtual('supportedCrops').get(function supportedCrops() {
  return (this.crops || []).map((c) => c.name);
});

centreSchema.set('toJSON', { virtuals: true });
centreSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Centre', centreSchema);
