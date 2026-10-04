const AuditLog = require('../models/AuditLog');

async function logAction({ req, action, entityType, entityId, details = {} }) {
  if (!req || !req.user) return;
  
  try {
    await AuditLog.create({
      actorId: req.user.id,
      actorRole: req.user.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: req.ip || req.connection.remoteAddress
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

module.exports = { logAction };
