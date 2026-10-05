import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { MotionDiv, MotionLink, MotionLi, cardMotion, cardMotionDelayed, sectionMotion } from '../components/motion.js';

const FEATURES = [
  { key: 'bookSlot', icon: '📅' },
  { key: 'queue', icon: '⏳' },
  { key: 'payment', icon: '💳' },
  { key: 'report', icon: '📢' },
  { key: 'centres', icon: '📍' },
];

const QUICK_SERVICES = [
  { key: 'register', icon: '📝', to: '/farmer/register' },
  { key: 'bookSlot', icon: '📅', to: '/farmer/book' },
  { key: 'myBookings', icon: '📅', to: '/farmer/bookings' },
  { key: 'queue', icon: '⏳', to: '/farmer/bookings' },
  { key: 'payment', icon: '💳', to: '/farmer/payments' },
  { key: 'report', icon: '📢', to: '/farmer/complaint' },
  { key: 'centres', icon: '📍', to: '/centres/schedules' },
];

export default function Landing() {
  const { t, lang } = useLanguage();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '', image: '' });

  useEffect(() => {
    if (!sessionStorage.getItem('welcomeShown')) {
      setModalContent({
        title: t('popup.website_dev.title'),
        body: t('popup.website_dev.body'),
        image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
      });
      setShowModal(true);
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [t]);

  function openAppModal() {
    setModalContent({
      title: t('popup.app_dev.title'),
      body: t('popup.app_dev.body'),
      image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
    });
    setShowModal(true);
  }

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-b-[2.5rem] bg-[#0A6451] px-5 pb-16 pt-14 md:rounded-b-[4rem] md:pb-24 md:pt-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 20% 100%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)'
        }}
      >
        <div className="mx-auto max-w-5xl animate-fade-in relative z-10">
          <p className="text-small font-bold tracking-wide text-[#A4ED8D]">{t('home.eyebrow')}</p>
          <h1 className="mt-2 text-h1 text-white">अन्न VYUH</h1>
          <p className="mt-4 max-w-2xl text-p1 text-white/85">{t('home.tagline')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/farmer/register" className="rounded bg-[#A4ED8D] px-5 py-2.5 text-p2 font-bold text-[#074D43] transition-transform hover:scale-[1.03] hover:bg-[#D4FFC5] active:scale-95">
              {t('home.cta.register')}
            </Link>
            <Link to="/farmer/login" className="rounded border border-white/50 px-5 py-2.5 text-p2 font-bold text-white transition-colors hover:bg-white/10 active:scale-95">
              {t('home.cta.login')}
            </Link>
          </div>
          <Link to="/centres/schedules" className="mt-4 inline-block text-p2 font-bold text-[#A4ED8D] underline">
            {t('nav.centres')} →
          </Link>
          
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20">
            <img src="/ann-vyuh-app-mockup-v3.svg" alt="Ann VYUH App Mockup" className="w-[120px] lg:w-[150px] xl:w-[180px] object-contain drop-shadow-2xl" />
            <button
              type="button"
              onClick={openAppModal}
              className="rounded-full bg-[#FFC107] px-6 py-2 text-sm font-bold text-ink transition-transform hover:scale-105 hover:bg-[#FFB300] active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              {t('home.cta.installApp.label')}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <MotionDiv key={f.key} className="card" {...cardMotionDelayed(i)}>
              <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-xl">{f.icon}</span>
              <h2 className="mt-3 text-h3">{t(`home.feature.${f.key}.title`)}</h2>
              <p className="mt-2 text-p2 text-muted">{t(`home.feature.${f.key}.body`)}</p>
            </MotionDiv>
          ))}
        </div>

        <MotionDiv className="card mt-10 max-w-3xl" {...cardMotion}>
          <h2 className="text-h3">📞 {t('landing.ivr.title')}</h2>
          <p className="mt-2 text-p2 text-muted">{t('landing.ivr.body')}</p>
          <Link to="/ivr" className="btn-outline mt-3 inline-block">{t('landing.ivr.cta')}</Link>
        </MotionDiv>
      </div>

      <section className="bg-gradient-to-b from-[#F5FBFC] to-[#F0F8FB] px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-small font-bold tracking-wide text-primary">{t('home.quickServices.eyebrow')}</p>
            <h2 className="mt-1 text-h2">{t('home.quickServices.heading')}</h2>
            <p className="mt-1 text-p2 text-muted">{t('home.quickServices.subtitle')}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_SERVICES.map((s, i) => (
              <MotionLink key={s.key} to={s.to} className="card hover:border-primary" {...cardMotionDelayed(i, 0.06, true)}>
                <span aria-hidden="true" className="text-xl">{s.icon}</span>
                <h3 className="mt-2 text-h3">{t(`home.feature.${s.key}.title`)}</h3>
                <p className="mt-1 text-p2 text-muted">{t(`home.feature.${s.key}.body`)}</p>
                <span className="mt-2 inline-block text-small font-bold text-primary">{t('common.continue')} →</span>
              </MotionLink>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-small font-bold tracking-wide text-primary">{t('home.process.eyebrow')}</p>
            <h2 className="mt-1 text-h2">{t('home.process.heading')}</h2>
            <p className="mt-1 text-p2 text-muted">{t('home.process.subtitle')}</p>
          </div>
          <ol className="mt-8 space-y-3 max-w-3xl">
            {[1, 2, 3, 4, 5].map((n, i) => (
              <MotionLi key={n} className="card flex items-center gap-4" {...cardMotionDelayed(i)}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-p2 font-bold text-white">{n}</span>
                <span className="text-p1 font-semibold text-ink">{t(`home.process.step${n}`)}</span>
              </MotionLi>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#F5FBFC] px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <p className="text-small font-bold tracking-wide text-primary">{t('home.why.eyebrow')}</p>
          <h2 className="mt-1 text-h2">{t('home.why.heading')}</h2>
          <p className="mt-2 max-w-xl text-p2 text-muted">{t('home.why.body')}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 max-w-4xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="flex items-start gap-2 text-p2 text-ink">
                <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">✓</span>
                {t(`home.why.reason${n}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="need-help" className="px-5 py-14">
        <MotionDiv className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-6 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center" {...sectionMotion}>
          <div>
            <p className="text-small font-bold tracking-wide text-primary">{t('home.help.eyebrow')}</p>
            <h2 className="mt-1 text-h2">{t('home.help.heading')}</h2>
            <p className="mt-1 text-p2 text-muted">{t('home.help.body')}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 text-p2 font-bold">
            <a href="#how-it-works" className="text-primary underline">{t('home.help.howItWorks')} →</a>
            <Link to="/centres/schedules" className="text-primary underline">{t('home.help.centres')} →</Link>
            <a href="tel:1800XXXXXXX" className="text-primary underline">{t('home.help.contact')} →</a>
          </div>
        </MotionDiv>
      </section>

      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-10 backdrop-blur">✕</button>
            <div className="h-48 w-full overflow-hidden relative">
              <img src={modalContent.image} alt="Modal Banner" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-ink mb-3">{modalContent.title}</h3>
              <p className="text-sm text-muted font-medium leading-relaxed mb-6">{modalContent.body}</p>
              <button onClick={() => setShowModal(false)} className="bg-[#FFC107] hover:bg-[#FFB300] text-ink font-bold px-10 py-2.5 rounded-full transition-all active:scale-95 shadow-md">
                {t('common.ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
