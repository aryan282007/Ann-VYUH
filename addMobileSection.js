const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

const mobileSection = `
      {/* 4.5 Mobile App Showcase */}
      <section className="py-24 px-5 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden flex flex-col items-center text-center">
        {/* Glow effect behind the phone */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fdf3c6] rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
        
        <MotionDiv className="relative z-10 mb-12" {...sectionMotion}>
          <div className="relative mx-auto w-[280px] h-[580px] bg-black rounded-[3rem] p-2.5 shadow-2xl border-4 border-gray-900 overflow-hidden transform hover:scale-105 transition-transform duration-500">
            {/* Phone notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-1/2 mx-auto z-20"></div>
            <img 
              src="/mobile-ui.jpeg" 
              alt="Ann VYUH Mobile App Interface" 
              className="w-full h-full object-cover rounded-[2.5rem]"
            />
          </div>
        </MotionDiv>

        <MotionDiv className="relative z-10 max-w-2xl mx-auto" {...cardMotion}>
          <h2 className="text-4xl md:text-5xl font-black text-ink mb-4">
            {lang === 'en' ? 'Explore ' : 'मोबाइल पर '}<span className="text-primary-dark">अन्न VYUH</span>{lang === 'en' ? ' on Mobile' : ' देखें'}
          </h2>
          <p className="text-lg text-muted font-medium mb-8">
            {lang === 'en' 
              ? 'Experience seamless slot booking, instant payments, and transparent procurement right from your phone.' 
              : 'अपने फोन से निर्बाध स्लॉट बुकिंग, त्वरित भुगतान और पारदर्शी खरीद का अनुभव करें।'}
          </p>
          
          <button 
            type="button"
            onClick={() => window.alert(t('home.cta.installApp.comingSoon'))}
            className="group relative inline-flex items-center justify-center gap-3 bg-[#FFC107] hover:bg-[#FFB300] text-ink font-bold text-lg px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            <span className="flex items-center justify-center w-6 h-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>
            <div className="text-left">
              <div className="leading-tight">{lang === 'en' ? 'Download APK' : 'APK डाउनलोड करें'}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70">Android Version</div>
            </div>
            <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
              &rarr;
            </span>
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-4 text-xs font-bold text-muted uppercase tracking-wider flex-wrap">
            <span className="flex items-center gap-1"><span className="text-[#FFC107]">✓</span> Secure direct download</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1"><span className="text-primary">✓</span> Verified build</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1"><span className="text-primary">✓</span> Updated regularly</span>
          </div>
        </MotionDiv>
      </section>
`;

content = content.replace('{/* 5. Need Help CTA */}', mobileSection + '\n      {/* 5. Need Help CTA */}');

// Also inject `const { lang } = useLanguage();` if it's not there, so our ternary operators work!
if (!content.includes('const { lang } = useLanguage();')) {
  content = content.replace('const { t } = useLanguage();', 'const { t, lang } = useLanguage();');
}

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
