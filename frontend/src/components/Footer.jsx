import { Link } from 'react-router-dom';
import { Ambulance, Phone, MessageCircle, Mail, MapPin, Heart, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { EMERGENCY_PHONE, WHATSAPP_NUMBER } from '../utils/constants';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 relative overflow-hidden">
      {/* Top gradient border */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-red-600 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-red-800 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <Ambulance className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">CPY</span>
                <span className="text-red-400 font-bold text-lg"> Ambulance</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Delhi NCR's most trusted emergency medical service. Available 24/7 with trained paramedics and advanced life support.
            </p>
            {/* Live status */}
            <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700/30 px-3 py-1.5 rounded-full">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">Active & Responding</span>
            </div>
            {/* Social links */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: <Facebook className="h-4 w-4" />, href: '#', label: 'Facebook' },
                { icon: <Twitter className="h-4 w-4" />,  href: '#', label: 'Twitter'  },
                { icon: <Instagram className="h-4 w-4" />,href: '#', label: 'Instagram'},
                { icon: <Youtube className="h-4 w-4" />,  href: '#', label: 'YouTube'  },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/',        label: 'Home'              },
                { to: '/booking', label: 'Book Ambulance'    },
                { to: '/about',   label: 'About Us'          },
                { to: '/contact', label: 'Contact'           },
                { to: '/admin',   label: 'Admin Dashboard'   },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm hover:text-red-400 transition-colors duration-200 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 group-hover:scale-150 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Services</h3>
            <ul className="space-y-2.5">
              {[
                'Emergency Transport',
                'ICU Ambulance',
                'Neonatal Transport',
                'Event Medical Support',
                'Inter-Hospital Transfer',
                'Air Ambulance Coordination',
              ].map((s) => (
                <li key={s}>
                  <span className="flex items-center gap-2 text-sm hover:text-red-400 transition-colors duration-200 cursor-default group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-red-500 transition-colors" />
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Emergency Contact</h3>
            <div className="space-y-4">
              <a
                href={`tel:${EMERGENCY_PHONE}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-red-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-colors">
                  <Phone className="h-4 w-4 text-red-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Emergency Hotline</p>
                  <p className="text-white font-bold text-lg">{EMERGENCY_PHONE}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-green-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                  <MessageCircle className="h-4 w-4 text-green-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">WhatsApp Support</p>
                  <p className="text-white font-semibold">Chat with us</p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-white font-medium text-sm">vikas93prajapat@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Service Area</p>
                  <p className="text-white font-medium text-sm">Delhi NCR Region</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {year} CPY Ambulance Service. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              Made with <Heart className="h-3.5 w-3.5 text-red-500 mx-1 animate-pulse" /> for saving lives
            </div>
            <div className="flex gap-4 text-xs text-gray-600">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
