const Farmer = require('../models/Farmer');
const { sendSMS, initiateIVRCall } = require('../integrations/MockIntegrations');

class ZeroNetworkNotifier {
  static async notifyFarmer(farmerId, message, ivrPromptCode = null, ivrParams = {}) {
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return;

    // Simulate determining if the farmer is offline (e.g. hasn't opened app recently)
    // For prototype, we'll randomly route to SMS or IVR, or both
    const isOffline = Math.random() > 0.5;
    const prefersVoice = farmer.preferredLanguage === 'hi'; // Mock condition

    if (isOffline || prefersVoice) {
      if (ivrPromptCode) {
        await initiateIVRCall(farmer.mobileNumber, ivrPromptCode, ivrParams);
      } else {
        await initiateIVRCall(farmer.mobileNumber, 'custom_alert', { message });
      }
    }
    
    // Always send SMS as fallback
    await sendSMS(farmer.mobileNumber, message);
  }
}

module.exports = ZeroNetworkNotifier;
