const fs = require('fs');

// 1. Read the old SIH-26032 Landing.jsx
let oldLanding = fs.readFileSync('../SIH-26032/frontend/src/pages/Landing.jsx', 'utf8');

// 2. Add React imports (useEffect, useState)
oldLanding = oldLanding.replace(/import \{ Link \} from 'react-router-dom';/, "import { Link } from 'react-router-dom';\nimport { useState, useEffect } from 'react';");

// 3. Inject the modal states and functions inside the Landing component
const modalLogic = `
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '', image: '' });

  useEffect(() => {
    if (!sessionStorage.getItem('welcomeShown')) {
      setModalContent({
        title: lang === 'en' ? 'We Are Under Development' : '\\u0939\\u092E \\u0935\\u093F\\u0915\\u093E\\u0938 \\u0915\\u0947 \\u091A\\u0930\\u0923 \\u092E\\u0947\\u0902 \\u0939\\u0948\\u0902',
        body: lang === 'en' 
          ? 'Thank you for exploring Ann VYUH! Please note that this website project is currently under active development and is about 40-50% complete. More features will be launching shortly.' 
          : '\\u0905\\u0928\\u094D\\u0928 VYUH \\u0915\\u094B \\u090F\\u0915\\u094D\\u0938\\u092A\\u094D\\u0932\\u094B\\u0930 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0927\\u0928\\u094D\\u092F\\u0935\\u093E\\u0926! \\u0915\\u0943\\u092A\\u092F\\u093E \\u0927\\u094D\\u092F\\u093E\\u0928 \\u0926\\u0947\\u0902 \\u0915\\u093F \\u092F\\u0939 \\u0935\\u0947\\u092C\\u0938\\u093E\\u0907\\u091F \\u092A\\u094D\\u0930\\u094B\\u091C\\u0947\\u0915\\u094D\\u091F \\u0935\\u0930\\u094D\\u0924\\u092E\\u093E\\u0928 \\u092E\\u0947\\u0902 \\u0938\\u0915\\u094D\\u0930\\u093F\\u092F \\u0935\\u093F\\u0915\\u093E\\u0938 \\u0915\\u0947 \\u0905\\u0927\\u0940\\u0928 \\u0939\\u0948 \\u0914\\u0930 \\u0932\\u0917\\u092D\\u0917 40-50% \\u092A\\u0942\\u0930\\u094D\\u0923 \\u0939\\u0948\\u0964 \\u091C\\u0932\\u094D\\u0926 \\u0939\\u0940 \\u0914\\u0930 \\u092D\\u0940 \\u0938\\u0941\\u0935\\u093F\\u0927\\u093E\\u090F\\u0901 \\u0932\\u0949\\u0928\\u094D\\u091A \\u0915\\u0940 \\u091C\\u093E\\u090F\\u0902\\u0917\\u0940\\u0964',
        image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
      });
      setShowModal(true);
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [lang]);

  function openAppModal() {
    setModalContent({
      title: lang === 'en' ? 'App Under Development' : '\\u0910\\u092A \\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0923 \\u0905\\u0927\\u0940\\u0928 \\u0939\\u0948',
      body: lang === 'en' 
        ? 'Our mobile application (Android APK) is currently under active development phase. It will feature offline slot booking, instant payment tracking, interactive Mandi maps, and live procurement queue alerts.' 
        : '\\u0939\\u092E\\u093E\\u0930\\u093E \\u092E\\u094B\\u092C\\u093E\\u0907\\u0932 \\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 (Android APK) \\u0935\\u0930\\u094D\\u0924\\u092E\\u093E\\u0928 \\u092E\\u0947\\u0902 \\u0938\\u0915\\u094D\\u0930\\u093F\\u092F \\u0935\\u093F\\u0915\\u093E\\u0938 \\u091A\\u0930\\u0923 \\u092E\\u0947\\u0902 \\u0939\\u0948\\u0964 \\u0907\\u0938\\u092E\\u0947\\u0902 \\u0911\\u092B\\u093C\\u0932\\u093E\\u0907\\u0928 \\u0938\\u094D\\u0932\\u0949\\u091F \\u092C\\u0941\\u0915\\u093F\\u0902\\u0917, \\u0924\\u094D\\u0935\\u0930\\u093F\\u0924 \\u092D\\u0941\\u0917\\u0924\\u093E\\u0928 \\u091F\\u094D\\u0930\\u0948\\u0915\\u093F\\u0902\\u0917, \\u0907\\u0902\\u091F\\u0930\\u0948\\u0915\\u094D\\u091F\\u093F\\u0935 \\u092E\\u0902\\u0921\\u0940 \\u092E\\u0948\\u092A\\u094D\\u0938 \\u0914\\u0930 \\u0932\\u093E\\u0907\\u0935 \\u0916\\u0930\\u0940\\u0926 \\u0915\\u0924\\u093E\\u0930 \\u0905\\u0932\\u0930\\u094D\\u091F \\u0915\\u0940 \\u0938\\u0941\\u0935\\u093F\\u0927\\u093E \\u0939\\u094B\\u0917\\u0940\\u0964',
      image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
    });
    setShowModal(true);
  }
`;

oldLanding = oldLanding.replace(/const \{ t \} = useLanguage\(\);/, "const { t, lang } = useLanguage();\n" + modalLogic);

// 4. Change window.alert to openAppModal()
oldLanding = oldLanding.replace(/onClick=\{.*?window\.alert.*?\}/g, 'onClick={openAppModal}');

// 5. Inject the Mobile App Showcase Section before the "Need Help" section
const mobileSection = `
      {/* 4.5 Mobile App Showcase */}
      <section className="py-24 px-5 bg-gradient-to-b from-[#F5FBFC] to-white relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fdf3c6] rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
        
        <MotionDiv className="relative z-10 mb-12" {...sectionMotion}>
          <div className="relative mx-auto w-[280px] h-[580px] bg-black rounded-[3rem] p-2.5 shadow-2xl border-4 border-gray-900 overflow-hidden transform hover:scale-105 transition-transform duration-500">
            <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-1/2 mx-auto z-20"></div>
            <img src="/mobile-ui.jpeg" alt="Ann VYUH Mobile App Interface" className="w-full h-full object-cover rounded-[2.5rem]" />
          </div>
        </MotionDiv>

        <MotionDiv className="relative z-10 max-w-2xl mx-auto" {...cardMotion}>
          <h2 className="text-4xl md:text-5xl font-black text-ink mb-4">
            {lang === 'en' ? 'Explore ' : '\\u092E\\u094B\\u092C\\u093E\\u0907\\u0932 \\u092A\\u0930 '}<span className="text-primary-dark">\\u0905\\u0928\\u094D\\u0928 VYUH</span>{lang === 'en' ? ' on Mobile' : ' \\u0926\\u0947\\u0916\\u0947\\u0902'}
          </h2>
          <p className="text-lg text-muted font-medium mb-8">
            {lang === 'en' 
              ? 'Experience seamless slot booking, instant payments, and transparent procurement right from your phone.' 
              : '\\u0905\\u092A\\u0928\\u0947 \\u092B\\u094B\\u0928 \\u0938\\u0947 \\u0928\\u093F\\u0930\\u094D\\u092C\\u093E\\u0927 \\u0938\\u094D\\u0932\\u0949\\u091F \\u092C\\u0941\\u0915\\u093F\\u0902\\u0917, \\u0924\\u094D\\u0935\\u0930\\u093F\\u0924 \\u092D\\u0941\\u0917\\u0924\\u093E\\u0928 \\u0914\\u0930 \\u092A\\u093E\\u0930\\u0926\\u0930\\u094D\\u0936\\u0940 \\u0916\\u0930\\u0940\\u0926 \\u0915\\u093E \\u0905\\u0928\\u0941\\u092D\\u0935 \\u0915\\u0930\\u0947\\u0902\\u0964'}
          </p>
          <button type="button" onClick={openAppModal} className="group relative inline-flex items-center justify-center gap-3 bg-[#FFC107] hover:bg-[#FFB300] text-ink font-bold text-lg px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-1">
            <span className="flex items-center justify-center w-6 h-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>
            <div className="text-left">
              <div className="leading-tight">{lang === 'en' ? 'Download APK' : 'APK \\u0921\\u093E\\u0909\\u0928\\u0932\\u094B\\u0921 \\u0915\\u0930\\u0947\\u0902'}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70">Android Version</div>
            </div>
          </button>
        </MotionDiv>
      </section>
`;

oldLanding = oldLanding.replace(/\{\/\* Need help\? - real destinations only:/, mobileSection + "\n      {/* Need help? - real destinations only:");

// 6. Inject the Modal UI at the bottom
const modalJSX = `
      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-10 backdrop-blur">✕</button>
            <div className="h-48 w-full overflow-hidden relative">
              <img src={modalContent.image} alt="Modal Banner" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-14 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-ink">♡</div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-ink mb-3">{modalContent.title}</h3>
              <p className="text-sm text-muted font-medium leading-relaxed mb-6">{modalContent.body}</p>
              <button onClick={() => setShowModal(false)} className="bg-[#FFC107] hover:bg-[#FFB300] text-ink font-bold px-10 py-2.5 rounded-full transition-all active:scale-95 shadow-md">
                {lang === 'en' ? 'Exit' : '\\u092C\\u0902\\u0926 \\u0915\\u0930\\u0947\\u0902'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

oldLanding = oldLanding.replace(/    <\/div>\n  \);\n\}/s, modalJSX);

// 7. Note: The SIH-26032 original has staff login links at the bottom. 
// User requested: "remove staff login from botton from navbar and footer we can login though the login page"
// So we must remove that section!
oldLanding = oldLanding.replace(/\{\/\* Procurement-centre and admin sign-in live only here on the homepage[\s\S]*?<\/div>\n      <\/div>/, '');

fs.writeFileSync('frontend/src/pages/Landing.jsx', oldLanding, 'utf8');
