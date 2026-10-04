const Farmer = require('../models/Farmer');
const Centre = require('../models/Centre');
const { verifyAadhaar, fetchLandRecord, validateBankDetails } = require('../integrations/MockIntegrations');
const bcrypt = require('bcryptjs');
const { assertFarmerOwnsData } = require('../middleware/auth');

function canAct(req, farmerId) {
  return req.user.role === 'farmer' ? String(req.user.id) === String(farmerId) : ['system_admin', 'state_admin', 'district_admin'].includes(req.user.role);
}

async function getFarmer(req, res) {
  try {
    if (!canAct(req, req.params.id)) return res.status(403).json({ message: 'Not authorised' });
    const farmer = await Farmer.findById(req.params.id).populate('preferredCentres', 'name district tehsil village codePrefix');
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch farmer', error: err.message });
  }
}

async function updateLocation(req, res) {
  try {
    if (!canAct(req, req.params.id)) return res.status(403).json({ message: 'Not authorised' });
    const { district, tehsil, village, pincode, state } = req.body;
    
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { district, tehsil, village, pincode, state: state || 'Madhya Pradesh' },
      { new: true, runValidators: true }
    );
    res.json(farmer);
  } catch (err) {
    res.status(400).json({ message: 'Could not update location', error: err.message });
  }
}

async function submitAadhaarEKYC(req, res) {
  try {
    if (!canAct(req, req.params.id)) return res.status(403).json({ message: 'Not authorised' });
    const { aadhaarNumber } = req.body;
    if (!aadhaarNumber || aadhaarNumber.length !== 12) return res.status(400).json({ message: 'Valid 12 digit Aadhaar is required' });

    const existing = await Farmer.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Farmer not found' });

    const aadhaarLast4 = aadhaarNumber.slice(-4);
    
    // Call Mock UIDAI integration
    const kycResult = await verifyAadhaar(aadhaarLast4);
    
    if (kycResult.success) {
      const hash = await bcrypt.hash(aadhaarNumber, 10);
      existing.aadharLast4 = aadhaarLast4;
      existing.aadharHash = hash;
      existing.aadharVerified = true;
      await existing.save();
      res.json(existing);
    } else {
      res.status(400).json({ message: 'Aadhaar verification failed' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Could not verify Aadhaar', error: err.message });
  }
}

async function submitLandRecords(req, res) {
  try {
    if (!canAct(req, req.params.id)) return res.status(403).json({ message: 'Not authorised' });
    const { landDistrict, landTehsil, landVillage, khasraNumber, landTenure } = req.body;

    const tenure = landTenure || 'owned';
    const existing = await Farmer.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Farmer not found' });

    let leaseDocumentPath = existing.leaseDocumentPath;
    if (req.file) leaseDocumentPath = `/uploads/lease-documents/${req.file.filename}`;
    if (tenure !== 'owned' && !leaseDocumentPath) {
      return res.status(400).json({ message: 'Lease/rental agreement upload required' });
    }
    if (tenure === 'owned') leaseDocumentPath = null;

    // Call Mock Bhulekh API
    const landResult = await fetchLandRecord(landDistrict, landTehsil, landVillage, khasraNumber);
    
    let landVerificationStatus = 'pending';
    let cropEligibility = [];
    let landAreaHectares = 0;
    
    if (landResult.match) {
      landVerificationStatus = 'verified';
      landAreaHectares = landResult.areaHectares;
      // Mock crop inference from area
      cropEligibility = ['गेहूं', 'धान', 'चना', 'सोयाबीन'];
    } else {
      landVerificationStatus = 'manual_review';
    }

    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { 
        landDistrict, landTehsil, landVillage, khasraNumber, landTenure: tenure, leaseDocumentPath,
        landVerificationStatus, landAreaHectares, cropEligibility
      },
      { new: true, runValidators: true }
    );
    res.json(farmer);
  } catch (err) {
    res.status(400).json({ message: 'Could not save land record details', error: err.message });
  }
}

async function updateBankDetails(req, res) {
  try {
    if (!canAct(req, req.params.id)) return res.status(403).json({ message: 'Not authorised' });
    const { accountHolderName, bankName, accountNumber, ifscCode } = req.body;

    const existing = await Farmer.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Farmer not found' });

    const bankResult = await validateBankDetails(ifscCode, accountNumber);
    let bankValidationStatus = bankResult.valid ? 'verified' : 'invalid';
    
    let profileStatus = existing.profileStatus;
    if (bankValidationStatus === 'verified' && existing.landVerificationStatus === 'verified' && existing.aadharVerified) {
      profileStatus = 'active';
    } else if (existing.landVerificationStatus === 'manual_review') {
      profileStatus = 'pending_review';
    } else {
      profileStatus = 'incomplete';
    }

    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { 
        bankDetails: { accountHolderName, bankName, accountNumber, ifscCode },
        bankValidationStatus,
        profileStatus
      },
      { new: true }
    );
    res.json(farmer);
  } catch (err) {
    res.status(400).json({ message: 'Could not save bank details', error: err.message });
  }
}

async function acceptPolicy(req, res) {
  try {
    if (!canAct(req, req.params.id)) return res.status(403).json({ message: 'Not authorised' });
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { policyAccepted: true, policyAcceptedAt: new Date() },
      { new: true }
    );
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
}

async function updatePreferredCentres(req, res) {
  try {
    if (!canAct(req, req.params.id)) return res.status(403).json({ message: 'Not authorised' });
    const { centreIds } = req.body;
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, { preferredCentres: centreIds }, { new: true });
    res.json(farmer);
  } catch (err) {
    res.status(400).json({ message: 'Error', error: err.message });
  }
}

async function updatePersonalDetails(req, res) {
  try {
    if (!canAct(req, req.params.id)) return res.status(403).json({ message: 'Not authorised' });
    const { name, gender, dateOfBirth } = req.body;
    const update = { gender: gender || null, dateOfBirth: dateOfBirth || null };
    if (name) update.name = name;
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    res.json(farmer);
  } catch (err) {
    res.status(400).json({ message: 'Error', error: err.message });
  }
}

const getAllFarmers = async (req, res) => {
  try {
    let query = {};
    if (req.session.role === 'district_admin') query.district = req.session.district;
    const farmers = await Farmer.find(query).sort({ createdAt: -1 }).limit(100);
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllFarmers,
  getFarmer,
  updateLocation,
  updatePersonalDetails,
  submitAadhaarEKYC,
  submitLandRecords,
  acceptPolicy,
  updatePreferredCentres,
  updateBankDetails,
};

