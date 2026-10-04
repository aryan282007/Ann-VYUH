import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!session || !['centre_admin', 'district_admin', 'state_admin', 'system_admin'].includes(session.role)) {
    return <div className="p-8 text-center">Unauthorized. Please log in as an administrator.</div>;
  }

  const roleLabels = {
    centre_admin: 'केंद्र प्रबंधक',
    district_admin: 'जिला अधिकारी',
    state_admin: 'राज्य प्रशासक',
    system_admin: 'सिस्टम एडमिन'
  };

  const navItems = [
    { name: 'डैशबोर्ड', path: '/admin/dashboard', icon: '📊' },
    { name: 'केंद्र', path: '/admin/centres', icon: '🏢' },
    { name: 'किसान', path: '/admin/farmers', icon: '👨‍🌾' },
    { name: 'कतार प्रबंधन', path: '/admin/queue', icon: '👥' },
    { name: 'खरीद', path: '/admin/procurement', icon: '🌾' },
    { name: 'भुगतान', path: '/admin/payments', icon: '₹' },
    { name: 'सूचनाएं', path: '/admin/notifications', icon: '🔔' },
    { name: 'रिपोर्ट्स', path: '/admin/reports', icon: '📈' },
    { name: 'सेटिंग्स', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-paper font-sans">
      
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-surface shadow-md flex flex-col z-20 flex-shrink-0"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-primary-dark">अन्न VYUH</h1>
                <p className="text-xs text-muted font-medium">प्रशासनिक पैनल</p>
              </div>
              <button className="lg:hidden text-ink" onClick={() => setIsSidebarOpen(false)}>✕</button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-primary-light text-primary-dark font-semibold' : 'text-ink hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary-dark font-bold">
                  {session.name ? session.name.charAt(0) : 'A'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-ink truncate">{session.name || 'Admin'}</p>
                  <p className="text-xs text-muted truncate">{roleLabels[session.role]}</p>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full py-2 text-sm text-danger border border-danger/30 rounded-lg hover:bg-danger/5 transition-colors"
              >
                लॉग आउट
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-surface shadow-sm border-b border-border flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-ink hover:text-primary transition-colors"
            >
              ☰
            </button>
            
            <div className="hidden md:flex items-center bg-paper rounded-full px-4 py-1.5 border border-border focus-within:border-primary">
              <span className="text-muted mr-2">🔍</span>
              <input
                type="text"
                placeholder="खोजें (Ctrl+K)"
                className="bg-transparent border-none outline-none text-sm w-48 text-ink"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <div className="hidden sm:block text-muted font-medium">
              {new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <button className="text-ink font-bold hover:text-primary">A/अ</button>
            <div className="relative cursor-pointer hover:text-primary">
              🔔
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border border-surface"></span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-paper">
          <Outlet />
        </div>
        
      </div>
    </div>
  );
}

