import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import NotificationSimulatorPanel from './components/NotificationSimulatorPanel.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import usePageTitle from './hooks/usePageTitle.js';
import { useAuth } from './context/AuthContext.jsx';

import Landing from './pages/Landing.jsx';
import About from './pages/About.jsx';
import StaffLogin from './pages/StaffLogin.jsx';
import IVRSimulator from './pages/IVRSimulator.jsx';
import CentreSchedules from './pages/CentreSchedules.jsx';

import FarmerRegister from './pages/farmer/Register.jsx';
import FarmerLogin from './pages/farmer/Login.jsx';
import FarmerHome from './pages/farmer/Home.jsx';
import BookSlot from './pages/farmer/BookSlot.jsx';
import MyBookings from './pages/farmer/Dashboard.jsx';
import PaymentStatus from './pages/farmer/PaymentStatus.jsx';
import ReportComplaint from './pages/farmer/ReportComplaint.jsx';
import TrackBooking from './pages/farmer/TrackBooking.jsx';
import FarmerProfile from './pages/farmer/Profile.jsx';

import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminCentres from './pages/admin/Centres.jsx';
import AdminQueue from './pages/admin/Queue.jsx';
import AdminFarmers from './pages/admin/Farmers.jsx';
import AdminPayments from './pages/admin/Payments.jsx';
import AdminNotifications from './pages/admin/Notifications.jsx';
import AdminReports from './pages/admin/Reports.jsx';
import AdminSettings from './pages/admin/Settings.jsx';

export default function App() {
  usePageTitle();
  const { session } = useAuth();
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`flex flex-col bg-paper ${isAdminRoute ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {!isAdminRoute && <Navbar />}
      <main id="main-content" className={`flex-1 ${isAdminRoute ? 'flex overflow-hidden' : ''}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/centres/schedules" element={<CentreSchedules />} />

          <Route path="/farmer/register" element={<FarmerRegister />} />
          <Route path="/farmer/login" element={<FarmerLogin />} />
          <Route path="/farmer/home" element={<ProtectedRoute roles={['farmer']}><FarmerHome /></ProtectedRoute>} />
          <Route path="/farmer/book" element={<ProtectedRoute roles={['farmer']}><BookSlot /></ProtectedRoute>} />
          <Route path="/farmer/bookings" element={<ProtectedRoute roles={['farmer']}><MyBookings /></ProtectedRoute>} />
          <Route path="/farmer/payments" element={<ProtectedRoute roles={['farmer']}><PaymentStatus /></ProtectedRoute>} />
          <Route path="/farmer/complaint" element={<ProtectedRoute roles={['farmer']}><ReportComplaint /></ProtectedRoute>} />
          <Route path="/farmer/profile" element={<ProtectedRoute roles={['farmer']}><FarmerProfile /></ProtectedRoute>} />
          <Route path="/farmer/track/:token" element={<TrackBooking />} />

          <Route path="/staff/login" element={<StaffLogin />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="centres" element={<AdminCentres />} />
            <Route path="farmers" element={<AdminFarmers />} />
            <Route path="queue" element={<AdminQueue />} />
            <Route path="procurement" element={<div className="p-4">Procurement Stub</div>} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/ivr" element={<IVRSimulator />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <NotificationSimulatorPanel />
    </div>
  );
}



