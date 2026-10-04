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
  const { lang, t } = useLanguage();

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

  // Auth blocking modal state
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '', image: '' });

  const districts = ['Bhopal', 'Sehore', 'Ujjain', 'Vidisha', 'Indore'];

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    
    // Intercept registration and show popup
    setModalContent({
      title: lang === 'en' ? 'System Maintenance' : 'सिस्टम रखरखाव',
      body: lang === 'en' 
        ? 'Farmer registration and login portals are temporarily disabled while we upgrade our backend services for improved security and performance. Please try again later.' 
        : 'बेहतर सुरक्षा और प्रदर्शन के लिए हमारे बैकएंड सेवाओं को अपग्रेड करते समय किसान पंजीकरण और लॉगिन पोर्टल अस्थायी रूप से अक्षम कर दिए गए हैं। कृपया बाद में पुनः प्रयास करें।',
      image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
    });
    setShowModal(true);
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
      setError(err.response?.data?.message || (lang === 'en' ? 'Invalid OTP' : 'अवैध OTP'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      {stage === 'form' ? (
        <form onSubmit={handleRegisterSubmit} className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-ink">{lang === 'en' ? 'Register' : 'पंजीकरण करें'}</h2>
            <p className="text-sm text-muted mt-1">{lang === 'en' ? 'Create your account on Ann VYUH portal' : 'अन्न VYUH पोर्टल पर अपना खाता बनाएँ'}</p>
          </div>

          {error && <div className="rounded bg-red-50 p-3 text-sm text-red-600 mb-4">{error}</div>}
          
          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-bold text-ink">{lang === 'en' ? 'Full Name' : 'पूरा नाम (Full Name)'}</label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-border py-2.5 px-4 text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={lang === 'en' ? 'Your Name' : 'आपका नाम'}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-ink">{lang === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-muted font-bold">+91</span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  className="w-full rounded-md border border-border py-2.5 pl-14 pr-4 text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-ink">{lang === 'en' ? 'Aadhaar Number (KYC)' : 'आधार नंबर (Aadhaar KYC)'}</label>
              <input
                type="text"
                pattern="[0-9]{12}"
                className="w-full rounded-md border border-border py-2.5 px-4 text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-wide"
                value={formData.aadharNumber}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                placeholder="0000 0000 0000"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-ink">{lang === 'en' ? 'District' : 'ज़िला'}</label>
              <select
                required
                className="w-full rounded-md border border-border py-2.5 px-4 text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm bg-white"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              >
                <option value="">{lang === 'en' ? 'Select District' : 'ज़िला चुनें'}</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full mt-8 rounded-md bg-[#84b884] py-3.5 text-white font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-sm hover:bg-[#73a373]">
            {submitting ? '...' : (lang === 'en' ? 'Register >' : 'पंजीकरण करें >')}
          </button>

          <p className="mt-6 text-center text-sm text-muted font-medium">
            {lang === 'en' ? 'Already registered?' : 'पहले से पंजीकृत हैं?'} <Link to="/farmer/login" className="text-primary font-bold hover:underline">{lang === 'en' ? 'Log In' : 'लॉग इन करें'}</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={verifyOTP} className="w-full space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-ink">{lang === 'en' ? 'Verify OTP' : 'OTP सत्यापित करें'}</h2>
          </div>

          <div className="mb-4 rounded border border-primary/20 bg-primary-light p-3 text-sm text-primary">
            {lang === 'en' ? 'Demo Mode: OTP is' : 'डेमो मोड: OTP है'} <b>{devCode || '1234'}</b>
          </div>
          
          {error && <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div>
            <label className="mb-1 block text-sm font-bold text-ink">{lang === 'en' ? 'Enter OTP' : 'OTP दर्ज करें'}</label>
            <input
              type="text"
              required
              className="w-full rounded-md border border-border py-3 text-center text-2xl tracking-widest text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button type="submit" disabled={submitting} className="w-full mt-6 rounded-md bg-[#84b884] py-3 text-white font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-sm hover:bg-[#73a373]">
            {submitting ? '...' : (lang === 'en' ? 'Verify OTP >' : 'OTP सत्यापित करें >')}
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
                {lang === 'en' ? 'Exit' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
