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
  const { lang } = useLanguage();

  const [mobileNumber, setMobileNumber] = useState(location.state?.mobileNumber || '');
  const [otp, setOtp] = useState('');
  const [devCode, setDevCode] = useState(null);
  const [stage, setStage] = useState('mobile'); 
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Demo role selector
  const [demoRole, setDemoRole] = useState('farmer');

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
      const { data } = await api.post('/auth/staff/login', { username, password: 'password123' });
      login(data.token, data.staff, data.staff.role);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Staff login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function requestOTP(e) {
    e.preventDefault();
    if (demoRole !== 'farmer') return handleDemoStaffLogin(e);

    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/farmer/request-otp', { mobileNumber });
      setDevCode(data.devCode || null);
      setStage('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'ओटीपी भेजने में विफल');
    } finally {
      setSubmitting(false);
    }
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
      setError(err.response?.data?.message || 'अवैध ओटीपी (Invalid OTP)');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-ink mb-2">{lang === 'en' ? 'Log In' : 'लॉग इन करें'}</h2>
        <p className="text-muted text-sm font-medium">{lang === 'en' ? 'Please enter your registered mobile number' : 'कृपया अपना पंजीकृत मोबाइल नंबर दर्ज करें'}</p>
      </div>

      {stage === 'mobile' && (
        <form onSubmit={requestOTP} className="space-y-6">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-ink ml-1">{lang === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">+91</span>
              <input
                required={demoRole === 'farmer'}
                pattern="[0-9]{10}"
                placeholder="98765 43210"
                className="w-full rounded-xl border border-border bg-white py-3.5 pl-12 pr-12 text-ink placeholder:text-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-bold text-ink ml-1">{lang === 'en' ? 'Login Role (Demo)' : 'लॉगिन भूमिका (डेमो)'}</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'farmer', label: lang === 'en' ? 'Farmer' : 'किसान' },
                { id: 'district_admin', label: lang === 'en' ? 'District Admin' : 'प्रशासन अधिकारी (जिला)' },
                { id: 'centre_admin', label: lang === 'en' ? 'Centre Admin' : 'केंद्र प्रबंधक' },
                { id: 'state_admin', label: lang === 'en' ? 'State Admin' : 'राज्य प्रशासक' },
                { id: 'system_admin', label: lang === 'en' ? 'System Admin' : 'सिस्टम एडमिन' }
              ].map(role => (
                <label 
                  key={role.id}
                  onClick={() => setDemoRole(role.id)} 
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    demoRole === role.id ? 'border-primary bg-primary-light/30' : 'border-border hover:border-gray-300'
                  } ${role.id === 'farmer' ? 'col-span-2' : ''}`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${demoRole === role.id ? 'border-primary' : 'border-gray-300'}`}>
                    {demoRole === role.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-xs font-semibold ${demoRole === role.id ? 'text-primary-dark' : 'text-muted'}`}>
                    {role.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm font-semibold text-danger text-center animate-shake">{error}</p>}
          
          <button type="submit" disabled={submitting} className="w-full bg-[#87B88C] hover:bg-primary text-white font-bold rounded-xl py-3.5 transition-colors flex items-center justify-center gap-2 shadow-sm">
            {submitting ? (lang === 'en' ? 'Please wait...' : 'प्रतीक्षा करें...') : (demoRole === 'farmer' ? (lang === 'en' ? 'Send OTP >' : 'ओटीपी भेजें >') : (lang === 'en' ? 'Demo Login >' : 'डेमो लॉगिन >'))}
          </button>
        </form>
      )}

      {stage === 'otp' && (
        <form onSubmit={verifyOTP} className="space-y-6">
          <div className="rounded-xl bg-accent-light/50 p-4 border border-accent/20">
            <p className="text-sm text-accent-dark font-medium text-center">
              {lang === 'en' ? 'Demo Mode: Your OTP is ' : 'डेमो मोड: आपका ओटीपी '}<strong>{devCode || '123456'}</strong>{lang === 'en' ? '' : ' है।'}
            </p>
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-ink ml-1">{lang === 'en' ? 'Enter OTP' : 'ओटीपी दर्ज करें'}</label>
            <input
              required
              inputMode="numeric"
              className="w-full rounded-xl border border-border bg-white py-3.5 px-4 text-center text-2xl tracking-[0.5em] font-bold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {error && <p className="text-sm font-semibold text-danger text-center animate-shake">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full bg-[#87B88C] hover:bg-primary text-white font-bold rounded-xl py-3.5 transition-colors">
            {submitting ? (lang === 'en' ? 'Verifying...' : 'सत्यापन हो रहा है...') : (lang === 'en' ? 'Verify >' : 'सत्यापित करें >')}
          </button>
          <button type="button" onClick={() => setStage('mobile')} className="w-full text-primary font-bold hover:underline text-sm text-center">
            &larr; {lang === 'en' ? 'Go Back' : 'वापस जाएँ'}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm font-medium text-muted">
        {lang === 'en' ? 'New farmer? ' : 'नया किसान? '}<Link to="/farmer/register" className="text-primary font-bold hover:underline">{lang === 'en' ? 'Register here' : 'पंजीकरण करें'}</Link>
      </p>
    </AuthLayout>
  );
}
