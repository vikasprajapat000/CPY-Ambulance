import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Ambulance, Phone, MapPin, Navigation } from 'lucide-react';
import { EMERGENCY_PHONE } from '../utils/constants';

const BookingApproved = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        {/* Animated ambulance icon */}
        <div className="relative inline-flex items-center justify-center w-36 h-36 mb-8">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-40" />
          <div className="absolute inset-6 rounded-full bg-red-100 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full gradient-emergency flex items-center justify-center shadow-2xl">
            <Ambulance className="h-14 w-14 text-white animate-ambulance" />
          </div>
        </div>

        <div className="card-premium rounded-3xl p-10 shadow-2xl">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-5">
            <CheckCircle className="h-4 w-4" /> Booking Approved!
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Ambulance Dispatched 🚑
          </h1>
          <p className="text-gray-500 mb-2 text-lg leading-relaxed">
            Your booking has been approved and an ambulance is on its way to your location!
          </p>
          <p className="text-gray-400 text-sm mb-8">Booking ID: <span className="font-mono font-bold text-gray-700">{id}</span></p>

          {/* ETA indicator */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-orange-700 font-bold">
              <Navigation className="h-5 w-5 animate-pulse" />
              Estimated Arrival: 15-20 Minutes
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to={`/tracking/${id}`}
              className="btn-emergency py-4 justify-center w-full text-base"
            >
              <MapPin className="h-5 w-5" />
              Track Live on Map
            </Link>
            <a
              href={`tel:${EMERGENCY_PHONE}`}
              className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors text-base"
            >
              <Phone className="h-5 w-5" />
              Call Emergency: {EMERGENCY_PHONE}
            </a>
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors py-2"
            >
              ← Return to Home
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Please stay calm and make space for the ambulance to arrive 🙏
        </p>
      </div>
    </div>
  );
};

export default BookingApproved;
