const jwt = require('jsonwebtoken');

function requireAuth(allowedRoles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ message: 'Not authorised for this action' });
      }
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

// Ensure Farmer only accesses their own data
function assertFarmerOwnsData(req, farmerId) {
  if (req.user.role === 'farmer' && String(req.user.id) !== String(farmerId)) {
    throw Object.assign(new Error('Not authorised to access this farmer data'), { status: 403 });
  }
}

// Scope checks for staff roles based on centre or district
function assertStaffScope(req, entityCentreId, entityDistrict) {
  if (req.user.role === 'centre_admin' && String(req.user.centre) !== String(entityCentreId)) {
    throw Object.assign(new Error('Not authorised for this centre'), { status: 403 });
  }
  if (req.user.role === 'district_admin' && req.user.district !== entityDistrict) {
    throw Object.assign(new Error('Not authorised for this district'), { status: 403 });
  }
  // state_admin and system_admin have global scope for business entities
}

module.exports = { requireAuth, assertFarmerOwnsData, assertStaffScope };
