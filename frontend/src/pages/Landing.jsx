import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { MotionDiv, MotionLink, MotionLi, cardMotion, cardMotionDelayed, sectionMotion } from '../components/motion.js';

const FEATURES = [
  { key: 'bookSlot', icon: '📅' },
  { key: 'queue', icon: '👥' },
  { key: 'payment', icon: '₹' },
  { key: 'report', icon: '🚨' },
  { key: 'centres', icon: '🏢' },
];

const QUICK_SERVICES = [
  { key: 'register', icon: '📝', to: '/farmer/register' },
  { key: 'bookSlot', icon: '📅', to: '/farmer/book' },
  { key: 'myBookings', icon: '📋', to: '/farmer/bookings' },
  { key: 'queue', icon: '👥', to: '/farmer/bookings' },
];

export default function Landing() {
  const { t, lang } = useLanguage();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '', image: '' });

  useEffect(() => {
    // Only show once per session to avoid annoying the user during testing
    if (!sessionStorage.getItem('welcomeShown')) {
      setModalContent({
        title: lang === 'en' ? 'We Are Under Development' : 'हम विकास के चरण में हैं',
        body: lang === 'en' ? 'Thank you for exploring Ann VYUH! Please note that this website project is currently under active development and is about 40-50% complete. More features will be launching shortly.' : 'अन्न VYUH को एक्सप्लोर करने के लिए धन्यवाद! कृपया ध्यान दें कि यह वेबसाइट प्रोजेक्ट वर्तमान में सक्रिय विकास के अधीन है और लगभग 40-50% पूर्ण है। जल्द ही और भी सुविधाएँ लॉन्च की जाएंगी।',
        image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
      });
      setShowModal(true);
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [lang]);


  function openAppModal() {
    setModalContent({
      title: lang === 'en' ? 'App Under Development' : '\u0910\u092A \u0928\u093F\u0930\u094D\u092E\u093E\u0923 \u0905\u0927\u0940\u0928 \u0939\u0948',
      body: lang === 'en' ? 'Our mobile application (Android APK) is currently under active development phase. It will feature offline slot booking, instant payment tracking, interactive Mandi maps, and live procurement queue alerts.' : 'हमारा मोबाइल एप्लिकेशन (Android APK) वर्तमान में सक्रिय विकास चरण में है। इसमें ऑफ़लाइन स्लॉट बुकिंग, त्वरित भुगतान ट्रैकिंग, इंटरैक्टिव मंडी मैप्स और लाइव खरीद कतार अलर्ट की सुविधा होगी।',
      image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
    });
    setShowModal(true);
  }


  return (
    <div className="flex flex-col font-sans overflow-x-hidden">
      
      {/* 1. Hero Section - Organic & Modern */}
      <section className="relative pt-24 pb-32 px-5 overflow-hidden bg-[#EAF2E8]">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-3/4 h-[120%] bg-[#D5E6D2] rounded-l-full opacity-60 transform translate-x-1/3 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#C2DAC0] rounded-tr-[120px] opacity-40"></div>
        
        <div className="relative mx-auto max-w-6xl z-10 flex flex-col md:flex-row items-center gap-12">
          <MotionDiv className="flex-1" {...sectionMotion}>
            <div className="inline-block bg-white/70 backdrop-blur px-4 py-1.5 rounded-full text-primary-dark font-bold text-sm mb-6 shadow-sm border border-white/50">
              {t('home.eyebrow')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-ink leading-tight">
              अन्न <span className="text-primary-dark">VYUH</span>
            </h1>
            <p className="mt-6 text-xl text-ink/80 max-w-xl font-medium leading-relaxed">
              {t('home.tagline')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <Link to="/farmer/register" className="bg-[#87B88C] hover:bg-primary text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-1 text-lg">
                {t('home.cta.register')}
              </Link>
              <Link to="/farmer/login" className="bg-white text-primary-dark hover:bg-gray-50 border border-primary/20 px-8 py-4 rounded-xl font-bold transition-all shadow-sm text-lg">
                {t('home.cta.login')}
              </Link>
            </div>
          </MotionDiv>
          
          <MotionDiv className="flex-1 w-full" {...sectionMotion}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
              <img
                src="https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Farmer in Madhya Pradesh"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{t('home.photoBanner.heading')}</h3>
                  <p className="opacity-90 font-medium">{t('home.tagline')}</p>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* 2. Bento Box Features Grid */}
      <section className="py-20 px-5 bg-paper">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink">अन्न VYUH की <span className="text-primary">विशेषताएँ</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {FEATURES.map((f, i) => (
              <MotionDiv 
                key={f.key} 
                className={`bg-white rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors ${i === 0 ? 'md:col-span-2' : ''} ${i === 3 ? 'md:col-span-2' : ''}`}
                {...cardMotionDelayed(i)}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-light/50 flex items-center justify-center text-3xl mb-4">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink mb-2">{t(`home.feature.${f.key}.title`)}</h3>
                  <p className="text-muted font-medium line-clamp-3">{t(`home.feature.${f.key}.body`)}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Quick Services - Action Cards */}
      <section className="py-20 px-5 bg-[#EAF2E8]/50">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-primary font-bold tracking-wide uppercase text-sm mb-2">{t('home.quickServices.eyebrow')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-ink">{t('home.quickServices.heading')}</h2>
            </div>
            <p className="text-muted max-w-sm font-medium">{t('home.quickServices.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_SERVICES.map((s, i) => (
              <MotionLink 
                key={s.key} 
                to={s.to} 
                className="group bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                {...cardMotionDelayed(i, 0.05)}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-bottom-left">{s.icon}</div>
                <h3 className="text-lg font-bold text-ink mb-2">{t(`home.feature.${s.key}.title`)}</h3>
                <p className="text-sm text-muted font-medium mb-4 line-clamp-2">{t(`home.feature.${s.key}.body`)}</p>
                <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t('common.continue')} &rarr;
                </span>
              </MotionLink>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Process flow & IVR */}
      <section id="how-it-works" className="py-24 px-5 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-6xl flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="flex-1 w-full relative">
            <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-primary/20 -z-10"></div>
            <p className="text-primary font-bold tracking-wide uppercase text-sm mb-2">{t('home.process.eyebrow')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-10">{t('home.process.heading')}</h2>
            
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((n, i) => (
                <MotionDiv key={n} className="flex gap-6 items-start" {...cardMotionDelayed(i)}>
                  <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                    {n}
                  </div>
                  <div className="pt-2">
                    <p className="text-lg font-bold text-ink">{t(`home.process.step${n}`)}</p>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-6">
            <MotionDiv className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-3xl p-10 text-white shadow-xl" {...cardMotion}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl mb-6 backdrop-blur">
                📞
              </div>
              <h2 className="text-2xl font-bold mb-3">{t('landing.ivr.title')}</h2>
              <p className="text-white/80 font-medium mb-8 leading-relaxed">{t('landing.ivr.body')}</p>
              <Link to="/ivr" className="bg-white text-primary-dark px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors inline-block">
                {t('landing.ivr.cta')}
              </Link>
            </MotionDiv>

            <MotionDiv className="bg-[#FFF8ED] border border-[#FFE0B2] rounded-3xl p-8" {...cardMotionDelayed(1)}>
              <h3 className="text-xl font-bold text-[#E65100] mb-4">{t('home.why.heading')}</h3>
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="flex gap-3 text-ink font-medium">
                    <span className="text-[#E65100]">✓</span>
                    {t(`home.why.reason${n}`)}
                  </li>
                ))}
              </ul>
            </MotionDiv>
          </div>

        </div>
      </section>

      
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
            onClick={openAppModal}
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

      {/* 5. Need Help CTA */}
      <section id="need-help" className="py-20 px-5 bg-paper">
        <MotionDiv className="mx-auto max-w-4xl bg-white border border-border shadow-lg rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left" {...sectionMotion}>
          <div>
            <h2 className="text-3xl font-bold text-ink mb-3">{t('home.help.heading')}</h2>
            <p className="text-muted font-medium text-lg">{t('home.help.body')}</p>
          </div>
          <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
            <Link to="/centres/schedules" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all text-center">
              {t('home.help.centres')}
            </Link>
            <a href="tel:1800XXXXXXX" className="border-2 border-primary text-primary hover:bg-primary-light/20 px-8 py-3.5 rounded-xl font-bold transition-all text-center">
              {t('home.help.contact')}
            </a>
          </div>
        </MotionDiv>
      </section>
      

      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-10 backdrop-blur"
            >
              ✕
            </button>
            
            {/* Image Banner */}
            <div className="h-48 w-full overflow-hidden relative">
              <img src={modalContent.image} alt="Modal Banner" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-14 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-ink">
                ♡
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-ink mb-3">{modalContent.title}</h3>
              <p className="text-sm text-muted font-medium leading-relaxed mb-6">
                {modalContent.body}
              </p>
              
              <button 
                onClick={() => setShowModal(false)}
                className="bg-[#FFC107] hover:bg-[#FFB300] text-ink font-bold px-10 py-2.5 rounded-full transition-all active:scale-95 shadow-md"
              >
                {lang === 'en' ? 'Exit' : '\u092C\u0902\u0926 \u0915\u0930\u0947\u0902'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}