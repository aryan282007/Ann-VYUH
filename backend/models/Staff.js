const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { 
      type: String, 
      enum: ['centre_admin', 'district_admin', 'state_admin', 'system_admin'], 
      required: true 
    },
    centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', default: null }, // for centre_admin
    district: { type: String, default: null }, // for district_admin
    mustChangePassword: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
