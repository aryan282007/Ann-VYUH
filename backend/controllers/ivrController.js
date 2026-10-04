// Simplified IVR Controller

const PROMPTS = {
  welcome: {
    en: 'Welcome to the Ann-VYUH smart procurement system. Please enter your 10 digit registered mobile number.',
    hi: 'अन्न-व्यूह स्मार्ट खरीद प्रणाली में आपका स्वागत है। कृपया अपना 10 अंकों का पंजीकृत मोबाइल नंबर दर्ज करें।',
  },
  enter_otp: {
    en: 'Please enter the 6 digit OTP sent to your mobile number.',
    hi: 'कृपया आपके मोबाइल नंबर पर भेजा गया 6 अंकों का ओटीपी दर्ज करें।',
  },
  main_menu: {
    en: 'Press 1 to book a new slot. Press 2 to check your booking status. Press 3 to hear today\'s centre wait times. Press 4 to speak to an executive.',
    hi: 'नया स्लॉट बुक करने के लिए 1 दबाएं। अपनी बुकिंग की स्थिति जांचने के लिए 2 दबाएं। आज के केंद्र की प्रतीक्षा सूची सुनने के लिए 3 दबाएं। कार्यकारी से बात करने के लिए 4 दबाएं।',
  },
  choose_centre: {
    en: 'Please choose a procurement centre from the list.',
    hi: 'कृपया सूची से एक खरीद केंद्र चुनें।',
  },
  choose_date: {
    en: 'Please choose an available date.',
    hi: 'कृपया उपलब्ध तिथि चुनें।',
  },
  choose_slot: {
    en: 'Please choose an available time slot.',
    hi: 'कृपया उपलब्ध समय स्लॉट चुनें।',
  },
  booking_confirmed: {
    en: 'Your booking is confirmed. Your token number will be sent via SMS.',
    hi: 'आपकी बुकिंग की पुष्टि हो गई है। आपका टोकन नंबर SMS के माध्यम से भेजा जाएगा।',
  },
  invalid_input: {
    en: 'Sorry, that is not a valid option. Please try again.',
    hi: 'क्षमा करें, यह एक मान्य विकल्प नहीं है। कृपया पुनः प्रयास करें।',
  },
};

async function getPrompt(req, res) {
  const { step } = req.params;
  const lang = req.query.lang || 'hi';

  const stepPrompts = PROMPTS[step];
  if (!stepPrompts) return res.status(404).json({ message: `Unknown IVR step "${step}"` });

  res.json({ step, lang, text: stepPrompts[lang] || stepPrompts.en });
}

async function getAllPrompts(req, res) {
  const lang = req.query.lang || 'hi';
  const out = {};
  Object.keys(PROMPTS).forEach((step) => {
    out[step] = PROMPTS[step][lang] || PROMPTS[step].en;
  });
  res.json({ lang, prompts: out });
}

async function speak(req, res) {
  // We rely entirely on the frontend's browser speechSynthesis now.
  // Return null audioContent to trigger the frontend's fallback.
  res.json({ audioContent: null, bhashiniConfigured: false });
}

module.exports = { getPrompt, getAllPrompts, speak };
