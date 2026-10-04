const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: null },
    dateOfBirth: { type: Date, default: null },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'],
    },
    pin: { type: String, select: false }, // hashed, optional extra auth
    preferredLanguage: {
      type: String,
      enum: ['hi', 'en'],
      default: 'hi',
    },
    village: { type: String, trim: true },
    tehsil: { type: String, trim: true }, // MP uses tehsil
    district: { type: String, trim: true },
    state: { type: String, trim: true, default: 'Madhya Pradesh' },
    pincode: {
      type: String,
      trim: true,
      match: [/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'],
      default: null,
    },

    // --- Aadhaar eKYC ---
    // Store only last 4 and a hash for verification, never the full number
    aadharLast4: { type: String, trim: true, default: null },
    aadharHash: { type: String, select: false, default: null },
    aadharVerified: { type: Boolean, default: false },

    // --- Land Verification (Mock LandRecord API) ---
    landDistrict: { type: String, trim: true, default: null },
    landTehsil: { type: String, trim: true, default: null },
    landVillage: { type: String, trim: true, default: null },
    khasraNumber: { type: String, trim: true, default: null },
    landAreaHectares: { type: Number, default: 0 },
    landTenure: { type: String, enum: ['owned', 'leased', 'rented'], default: 'owned' },
    leaseDocumentPath: { type: String, default: null },
    
    landVerificationStatus: { 
      type: String, 
      enum: ['pending', 'verified', 'manual_review', 'rejected'], 
      default: 'pending' 
    },
    landReviewRemarks: { type: String, default: null },
    
    // Auto-populated after land check
    cropEligibility: [{ type: String }], 

    policyAccepted: { type: Boolean, default: false },
    policyAcceptedAt: { type: Date, default: null },

    preferredCentres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Centre' }],

    // --- Bank Details & PFMS Validation ---
    bankDetails: {
      accountHolderName: { type: String, trim: true, default: null },
      bankName: { type: String, trim: true, default: null },
      accountNumber: { type: String, trim: true, default: null },
      ifscCode: { type: String, trim: true, uppercase: true, default: null },
    },
    bankValidationStatus: {
      type: String,
      enum: ['pending', 'verified', 'invalid'],
      default: 'pending'
    },
    bankValidationRemarks: { type: String, default: null },

    // Profile Activation
    profileStatus: {
      type: String,
      enum: ['incomplete', 'pending_review', 'active', 'rejected'],
      default: 'incomplete'
    },

    registeredAt: { type: String, trim: true },
    registeredVia: {
      type: String,
      enum: ['web', 'centre_staff', 'csc'],
      default: 'web',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

farmerSchema.virtual('registrationComplete').get(function registrationComplete() {
  return this.profileStatus === 'active';
});

farmerSchema.set('toJSON', { virtuals: true });
farmerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Farmer', farmerSchema);
