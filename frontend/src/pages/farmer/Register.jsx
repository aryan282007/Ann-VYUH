import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import AuthLayout from '../../layouts/AuthLayout.jsx';

export default function FarmerRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { joinFarmerRoom } = useSocket();
  const { lang } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    district: '',
    aadharNumber: ''
  });
  
  const [stage, setStage] = useState('form');
  const [otp, setOtp] = useState('');
  const [devCode, setDevCode] = useState(null);
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const districts = ['Bhopal', 'Sehore', 'Ujjain', 'Vidisha', 'Indore'];

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/farmer/register', formData);
      setDevCode(data.devCode || null);
      setStage('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'पंजीकरण विफल (Registration failed)');
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyOTP(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/farmer/verify-otp', { mobileNumber: formData.mobileNumber, code: otp });
      login(data.token, data.farmer, 'farmer');
      joinFarmerRoom(data.farmer._id);
      navigate('/farmer/home');
    } catch (err) {
      setError(err.response?.data?.message || 'अवैध ओटीपी (Invalid OTP)');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-ink mb-2">{lang === 'en' ? 'Register' : 'पंजीकरण करें'}</h2>
        <p className="text-muted text-sm font-medium">{lang === 'en' ? 'Create your account on Ann VYUH portal' : 'अन्न VYUH पोर्टल पर अपना खाता बनाएँ'}</p>
      </div>

      {stage === 'form' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-ink ml-1">{lang === 'en' ? 'Full Name' : 'पूरा नाम (Full Name)'}</label>
            <input
              required
              placeholder={lang === 'en' ? 'Your Name' : 'आपका नाम'}
              className="w-full rounded-xl border border-border bg-white py-3 px-4 text-ink placeholder:text-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-ink ml-1">{lang === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">+91</span>
              <input
                required
                pattern="[0-9]{10}"
                placeholder="98765 43210"
                className="w-full rounded-xl border border-border bg-white py-3 pl-12 pr-4 text-ink placeholder:text-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-ink ml-1">{lang === 'en' ? 'Aadhaar Number (KYC)' : 'आधार नंबर (Aadhaar KYC)'}</label>
            <input
              required
              pattern="[0-9]{12}"
              placeholder="0000 0000 0000"
              className="w-full rounded-xl border border-border bg-white py-3 px-4 text-ink placeholder:text-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium tracking-widest"
              value={formData.aadharNumber}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-ink ml-1">{lang === 'en' ? 'District' : 'जिला'}</label>
            <select
              required
              className="w-full rounded-xl border border-border bg-white py-3 px-4 text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            >
              <option value="" disabled>{lang === 'en' ? 'Select District' : 'जिला चुनें'}</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {error && <p className="text-sm font-semibold text-danger text-center animate-shake">{error}</p>}
          
          <button type="submit" disabled={submitting} className="w-full bg-[#87B88C] hover:bg-primary text-white font-bold rounded-xl py-3.5 mt-2 transition-colors">
            {submitting ? (lang === 'en' ? 'Please wait...' : 'प्रतीक्षा करें...') : (lang === 'en' ? 'Register >' : 'पंजीकरण करें >')}
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
          <button type="button" onClick={() => setStage('form')} className="w-full text-primary font-bold hover:underline text-sm text-center">
            &larr; {lang === 'en' ? 'Go Back' : 'वापस जाएँ'}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm font-medium text-muted">
        {lang === 'en' ? 'Already registered? ' : 'पहले से पंजीकृत हैं? '}<Link to="/farmer/login" className="text-primary font-bold hover:underline">{lang === 'en' ? 'Log In' : 'लॉग इन करें'}</Link>
      </p>
    </AuthLayout>
  );
}
