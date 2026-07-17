import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ambulance, Phone, Menu, X, Home, Calendar, Info, PhoneCall, Shield, MapPin, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { EMERGENCY_PHONE } from '../utils/constants';
import TrackModal from './TrackModal';
import { AuthContext } from '../context/AuthContext';

const navLinks = [
  { to: '/',        label: 'Home',    icon: <Home className="h-4 w-4" /> },
  { to: '/booking', label: 'Book',    icon: <Calendar className="h-4 w-4" /> },
  { to: '/about',   label: 'About',   icon: <Info className="h-4 w-4" /> },
  { to: '/contact', label: 'Contact', icon: <PhoneCall className="h-4 w-4" /> },
  { to: '/admin',   label: 'Admin',   icon: <Shield className="h-4 w-4" /> },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const menuRef               = useRef(null);
  
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gray-900/95 backdrop-blur-lg shadow-2xl border-b border-red-600/20'
            : 'bg-gradient-to-r from-gray-900 via-gray-900 to-red-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 emergency-glow">
                <Ambulance className="h-5 w-5 text-white animate-ambulance" />
              </div>
              <div>
                <span className="font-bold text-white text-lg font-poppins tracking-tight">CPY</span>
                <span className="text-red-400 font-bold text-lg"> Ambulance</span>
                <div className="flex items-center gap-1 -mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">24/7 Live</span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === to
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </div>

            {/* Emergency Call + Hamburger */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-4">
                <button
                  onClick={() => setTrackModalOpen(true)}
                  className="text-white hover:text-red-400 font-semibold text-sm transition-colors flex items-center gap-1 bg-white/10 px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20"
                >
                  <MapPin className="h-4 w-4" /> Track Booking
                </button>
                
                {user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold border border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4 text-red-400" />
                      {user.name.split(' ')[0]}
                    </button>
                    
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100]">
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{user.role}</span>
                        </div>
                        
                        {user.role === 'ADMIN' && (
                          <Link to="/admin" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Shield className="h-4 w-4 text-gray-400" /> Admin Dashboard
                          </Link>
                        )}
                        {user.role === 'DRIVER' && (
                          <Link to="/driver-portal-entry" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Ambulance className="h-4 w-4 text-gray-400" /> Driver Portal
                          </Link>
                        )}
                        
                        <button 
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }} 
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" className="text-white hover:text-red-400 font-semibold text-sm transition-colors flex items-center gap-1">
                      <LogIn className="h-4 w-4" /> Login
                    </Link>
                    <span className="text-gray-600">|</span>
                    <Link to="/register" className="text-white hover:text-red-400 font-semibold text-sm transition-colors flex items-center gap-1">
                      <UserPlus className="h-4 w-4" /> Register
                    </Link>
                  </div>
                )}
                
                <a
                  href={`tel:${EMERGENCY_PHONE}`}
                  className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:from-red-500 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-600/30 emergency-glow group"
                >
                  <Phone className="h-4 w-4 animate-bounce" /> {EMERGENCY_PHONE}
                </a>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Toggle menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-gray-900/98 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === link.to
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setOpen(false); setTrackModalOpen(true); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10"
            >
              <MapPin className="h-4 w-4" /> Track Booking
            </button>
            
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" /> Sign Out ({user.name})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <UserPlus className="h-4 w-4" /> Register
                </Link>
              </>
            )}

            <a
              href={`tel:${EMERGENCY_PHONE}`}
              className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm"
            >
              <Phone className="h-4 w-4" />
              Call Emergency: {EMERGENCY_PHONE}
            </a>
          </div>
        </div>
      </nav>
      {/* Spacer for fixed nav */}
      <div className="h-16 lg:h-18" />

      {/* Track Modal */}
      <TrackModal isOpen={trackModalOpen} onClose={() => setTrackModalOpen(false)} />
    </>
  );
};

export default Navbar;
