const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true }, // e.g. "UPDATE_CENTRE_CAPACITY", "APPROVE_LAND_RECORD", "OVERRIDE_ADVISOR"
    entityType: { type: String, required: true }, // e.g. "Centre", "Farmer", "Booking"
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: null },
  },
  { timestamps: true }
);

auditLogSchema.index({ actorId: 1 });
auditLogSchema.index({ entityId: 1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
