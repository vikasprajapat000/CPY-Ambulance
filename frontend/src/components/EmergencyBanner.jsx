import { Phone, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { EMERGENCY_PHONE, WHATSAPP_NUMBER } from '../utils/constants';

const EmergencyBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-in-bottom">
      <div className="bg-gradient-to-r from-gray-900 via-red-950 to-gray-900 border-t-2 border-red-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: pulsing label */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white font-bold text-sm">🚨 24/7 Emergency Response Active</span>
            </div>
            <span className="hidden md:block text-gray-400 text-sm">|</span>
            <span className="hidden md:block text-gray-300 text-sm">Delhi NCR – Average arrival 15-20 min</span>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${EMERGENCY_PHONE}`}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-red-600/30 emergency-glow"
            >
              <Phone className="h-4 w-4 animate-bounce-gen" />
              {EMERGENCY_PHONE}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <button
              onClick={() => setVisible(false)}
              className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
