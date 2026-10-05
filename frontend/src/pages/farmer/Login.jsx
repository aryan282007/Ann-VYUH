import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import AuthLayout from '../../layouts/AuthLayout.jsx';

export default function FarmerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { joinFarmerRoom } = useSocket();
  const { lang, t } = useLanguage();

  const [mobileNumber, setMobileNumber] = useState(location.state?.mobileNumber || '');
  const [otp, setOtp] = useState('');
  const [devCode, setDevCode] = useState(null);
  const [stage, setStage] = useState('mobile'); 
  const [demoRole, setDemoRole] = useState('farmer');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Auth blocking modal state
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '', image: '' });

  async function handleDemoStaffLogin(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    let username = '';
    if (demoRole === 'district_admin') username = 'districtadmin';
    else if (demoRole === 'centre_admin') username = 'centreadmin';
    else if (demoRole === 'state_admin') username = 'stateadmin';
    else if (demoRole === 'system_admin') username = 'sysadmin';

    try {
      const { data } = await api.post('/auth/admin/login', { username, password: 'password123' });
      login(data.token, data.staff, 'staff');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || (t('auth.dynamic.100')));
    } finally {
      setSubmitting(false);
    }
  }

  async function requestOTP(e) {
    e.preventDefault();
    
    if (demoRole !== 'farmer') return handleDemoStaffLogin(e);

    // Intercept farmer login and show popup
    setModalContent({
      title: t('auth.dynamic.101'),
      body: t('auth.dynamic.102'),
      image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
    });
    setShowModal(true);
  }

  async function verifyOTP(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/farmer/verify-otp', { mobileNumber, code: otp });
      login(data.token, data.farmer, 'farmer');
      joinFarmerRoom(data.farmer._id);
      navigate(data.farmer.registrationComplete ? '/farmer/home' : '/farmer/register');
    } catch (err) {
      setError(err.response?.data?.message || (t('auth.dynamic.103')));
    } finally {
      setSubmitting(false);
    }
  }

  const roleOptionClass = (roleValue) => 
    `flex items-center gap-2 rounded-full border px-4 py-2 cursor-pointer transition-colors ${
      demoRole === roleValue 
        ? 'border-primary bg-primary/5 text-primary' 
        : 'border-border text-muted hover:border-primary/50'
    }`;

  return (
    <AuthLayout>
      {stage === 'mobile' ? (
        <form onSubmit={requestOTP} className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-ink">{t('auth.dynamic.104')}</h2>
            <p className="text-sm text-muted mt-1">{t('auth.dynamic.105')}</p>
          </div>

          {error && <div className="rounded bg-red-50 p-3 text-sm text-red-600 mb-4">{error}</div>}

          <div>
            <label className="mb-1 block text-sm font-bold text-ink">{t('auth.dynamic.106')}</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-muted font-bold">+91</span>
              <input
                type="tel"
                required
                disabled={demoRole !== 'farmer'}
                pattern="[0-9]{10}"
                className="w-full rounded-md border border-border py-3 pl-14 pr-10 text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder={demoRole !== 'farmer' ? (t('auth.dynamic.107')) : ''}
              />
              <span className="absolute right-4 text-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-3 block text-sm font-bold text-ink">
              {t('auth.dynamic.108')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={roleOptionClass('farmer')}>
                <input type="radio" name="role" value="farmer" checked={demoRole === 'farmer'} onChange={(e) => setDemoRole(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{t('auth.dynamic.109')}</span>
              </label>
              
              <label className={roleOptionClass('district_admin')}>
                <input type="radio" name="role" value="district_admin" checked={demoRole === 'district_admin'} onChange={(e) => setDemoRole(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{t('auth.dynamic.110')}</span>
              </label>

              <label className={roleOptionClass('centre_admin')}>
                <input type="radio" name="role" value="centre_admin" checked={demoRole === 'centre_admin'} onChange={(e) => setDemoRole(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{t('auth.dynamic.111')}</span>
              </label>

              <label className={roleOptionClass('state_admin')}>
                <input type="radio" name="role" value="state_admin" checked={demoRole === 'state_admin'} onChange={(e) => setDemoRole(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{t('auth.dynamic.112')}</span>
              </label>

              <label className={roleOptionClass('system_admin')}>
                <input type="radio" name="role" value="system_admin" checked={demoRole === 'system_admin'} onChange={(e) => setDemoRole(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{t('auth.dynamic.113')}</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full mt-8 rounded-md bg-[#84b884] py-3.5 text-white font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-sm hover:bg-[#73a373]">
            {submitting ? '...' : (demoRole === 'farmer' ? (t('auth.dynamic.114')) : (t('auth.dynamic.115')))}
          </button>

          {demoRole === 'farmer' && (
            <p className="mt-6 text-center text-sm text-muted">
              {t('auth.dynamic.116')} <Link to="/farmer/register" className="text-primary font-bold hover:underline">{t('auth.dynamic.117')}</Link>
            </p>
          )}
        </form>
      ) : (
        <form onSubmit={verifyOTP} className="w-full space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-ink">{t('auth.dynamic.118')}</h2>
          </div>

          <div className="mb-4 rounded border border-primary/20 bg-primary-light p-3 text-sm text-primary">
            {t('auth.dynamic.119')} <b>{devCode || '1234'}</b>
          </div>
          
          {error && <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div>
            <label className="mb-1 block text-sm font-bold text-ink">{t('auth.dynamic.120')}</label>
            <input
              type="text"
              required
              className="w-full rounded-md border border-border py-3 text-center text-2xl tracking-widest text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button type="submit" disabled={submitting} className="w-full mt-6 rounded-md bg-[#84b884] py-3 text-white font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-sm hover:bg-[#73a373]">
            {submitting ? '...' : (t('auth.dynamic.121'))}
          </button>
        </form>
      )}

      {/* System Maintenance Modal */}
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
                {t('auth.dynamic.122')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
