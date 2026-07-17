import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, Phone, Ambulance } from 'lucide-react';
import { EMERGENCY_PHONE } from '../utils/constants';

/* Simple CSS confetti */
const COLORS = ['#dc2626','#f97316','#16a34a','#2563eb','#9333ea','#fbbf24'];

const Confetti = () => {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2.5 + Math.random() * 2}s`,
    size: `${8 + Math.random() * 8}px`,
    shape: Math.random() > 0.5 ? '50%' : '2px',
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

const ThankYou = () => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-16">
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full text-center">
        {/* Animated success icon */}
        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-50" />
          <div className="absolute inset-4 rounded-full bg-green-200 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl">
            <CheckCircle className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="card-premium rounded-3xl p-10 shadow-2xl">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Thank You! 🎉
          </h1>
          <p className="text-green-600 font-semibold text-lg mb-2">Message Sent Successfully</p>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We've received your message and our team will get back to you as soon as possible. 
            For emergencies, please don't wait — call us directly.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a
              href={`tel:${EMERGENCY_PHONE}`}
              className="btn-emergency py-3.5 justify-center w-full"
            >
              <Phone className="h-5 w-5 animate-bounce-gen" />
              Emergency: {EMERGENCY_PHONE}
            </a>
            <Link
              to="/booking"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              <Ambulance className="h-5 w-5" />
              Book an Ambulance
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Home className="h-5 w-5" />
              Return to Home
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Saving lives across Delhi NCR since 2015 ❤️
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
