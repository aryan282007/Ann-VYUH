import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage, SUPPORTED_LANGS } from '../context/LanguageContext.jsx';

const navLinkClass = ({ isActive }) =>
  `border-b-2 pb-1.5 transition-colors ${
    isActive ? 'border-primary text-primary' : 'border-transparent text-ink hover:border-primary hover:text-primary'
  }`;

export default function Navbar() {
  const { session, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
    setMenuOpen(false);
  }

  const farmerLinks = (
    <>
      <NavLink to="/farmer/home" className={navLinkClass} onClick={() => setMenuOpen(false)}>{t('nav.home')}</NavLink>
      <NavLink to="/farmer/book" className={navLinkClass} onClick={() => setMenuOpen(false)}>{t('nav.bookSlot')}</NavLink>
      <NavLink to="/farmer/bookings" className={navLinkClass} onClick={() => setMenuOpen(false)}>{t('nav.myBookings')}</NavLink>
      <NavLink to="/farmer/payments" className={navLinkClass} onClick={() => setMenuOpen(false)}>{t('nav.payments')}</NavLink>
      <NavLink to="/farmer/complaint" className={navLinkClass} onClick={() => setMenuOpen(false)}>{t('nav.reportIssue')}</NavLink>
      <NavLink to="/farmer/profile" className={navLinkClass} onClick={() => setMenuOpen(false)}>{t('nav.profile')}</NavLink>
    </>
  );

  const guestLinks = (
    <>
      <NavLink to="/farmer/register" className={navLinkClass} onClick={() => setMenuOpen(false)}>{t('nav.register')}</NavLink>
      <NavLink to="/centres/schedules" className={navLinkClass} onClick={() => setMenuOpen(false)}>{t('nav.centres')}</NavLink>
      <NavLink
        to="/farmer/login"
        onClick={() => setMenuOpen(false)}
        className={({ isActive }) =>
          `rounded border px-4 py-1.5 text-center transition-colors ${
            isActive ? 'border-primary bg-primary text-white' : 'border-primary/40 text-primary hover:bg-primary-light'
          }`
        }
      >
        {t('nav.login')}
      </NavLink>
    </>
  );

  return (
    <header className="bg-surface sticky top-0 z-50">
      <div className="mx-auto flex w-full max-w-full flex-wrap items-center justify-between gap-2 border-b border-border px-6 md:px-8 py-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <img src="/ann-vyuh-logo.svg" alt="Ann VYUH Logo" className="h-12 w-auto" />
        </Link>

        <button
          type="button"
          className="rounded p-1.5 text-ink hover:bg-primary-light md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={t('nav.menu')}
        >
          <span aria-hidden="true" className="text-xl font-black">{menuOpen ? '✕' : '☰'}</span>
        </button>

        <nav className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col gap-4 pt-4 text-p2 font-bold md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:pt-0`}>
          <NavLink to="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>{t('nav.about')}</NavLink>
          {session?.role === 'farmer' ? farmerLinks : !session ? guestLinks : null}
          {session && (
            <>
              <span className="font-normal text-muted">{session.profile?.name || session.profile?.mobileNumber}</span>
              <button onClick={handleLogout} className="btn-outline px-3 py-1 text-p2">
                {t('nav.logout')}
              </button>
            </>
          )}

          {/* Language Toggle */}
          <div className="flex items-center gap-1.5 ml-0 md:ml-2 border-l-0 md:border-l pl-0 md:pl-4 border-border">
            <span className="font-bold text-sm hidden lg:block text-muted">{t('common.language')}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="min-w-[92px] rounded-md border border-border bg-white px-2 py-1.5 text-ink text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            >
              {SUPPORTED_LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}
