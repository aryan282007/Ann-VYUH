// Simulated External Integrations for PROTOTYPE

const MOCK_STATE = {
  otp: { fail: false },
  aadhaar: { fail: false },
  landRecord: { fail: false, mismatch: false },
  bank: { fail: false, invalid: false },
  pfms: { fail: false, delay: false },
  sms: { fail: false },
  ivr: { fail: false },
  gemini: { fail: false }
};

const sendOTP = async (mobileNumber) => {
  if (MOCK_STATE.otp.fail) throw new Error('SMS Gateway Timeout');
  console.log(`[MOCK OTP] Sent 123456 to ${mobileNumber}`);
  return { success: true, otp: '123456' }; // Hardcoded demo OTP
};

const verifyAadhaar = async (aadhaarLast4) => {
  if (MOCK_STATE.aadhaar.fail) throw new Error('UIDAI Server Unavailable');
  console.log(`[MOCK AADHAAR] Verified ${aadhaarLast4}`);
  return { success: true, nameMatched: true };
};

const fetchLandRecord = async (district, tehsil, village, khasraNumber) => {
  if (MOCK_STATE.landRecord.fail) throw new Error('Bhulekh API Timeout');
  if (MOCK_STATE.landRecord.mismatch) {
    return { success: true, match: false, reason: 'Name mismatch in land records' };
  }
  return { success: true, match: true, areaHectares: Math.round((0.5 + Math.random() * 5) * 100) / 100 };
};

const validateBankDetails = async (ifsc, accountNumber) => {
  if (MOCK_STATE.bank.fail) throw new Error('NPCI Switch Timeout');
  if (MOCK_STATE.bank.invalid) return { success: true, valid: false, reason: 'Invalid IFSC or Account' };
  return { success: true, valid: true };
};

const processPFMSPayment = async (bookingId, amount) => {
  if (MOCK_STATE.pfms.fail) throw new Error('PFMS Gateway Timeout');
  if (MOCK_STATE.pfms.delay) return { success: true, status: 'processing', utr: null };
  return { success: true, status: 'credited', utr: `UTR${Math.floor(Math.random()*1000000000)}` };
};

const sendSMS = async (mobileNumber, message) => {
  if (MOCK_STATE.sms.fail) throw new Error('SMS Delivery Failed');
  console.log(`[MOCK SMS] To ${mobileNumber}: ${message}`);
  return { success: true };
};

const initiateIVRCall = async (mobileNumber, promptCode, params) => {
  if (MOCK_STATE.ivr.fail) throw new Error('Telecom Provider Error');
  console.log(`[MOCK IVR] Calling ${mobileNumber} for ${promptCode} with ${JSON.stringify(params)}`);
  return { success: true };
};

const generateHindiExplanation = async (prompt) => {
  if (MOCK_STATE.gemini.fail) return 'सिस्टम जनरेटेड सलाह (Gemini Unavailable)';
  
  // Try real Gemini if API key present
  if (process.env.GEMINI_API_KEY && !MOCK_STATE.gemini.fail) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
      const result = await model.generateContent(`Translate or phrase this reasoning naturally in Hindi for a farmer: ${prompt}`);
      return result.response.text().trim();
    } catch(err) {
      console.log('[Gemini Fallback]', err.message);
      return `(Fallback) ${prompt}`;
    }
  }
  return `(Mock Gemini) ${prompt}`;
};

module.exports = {
  MOCK_STATE,
  sendOTP,
  verifyAadhaar,
  fetchLandRecord,
  validateBankDetails,
  processPFMSPayment,
  sendSMS,
  initiateIVRCall,
  generateHindiExplanation
};

