import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Phone, MapPin, MessageCircle, ChevronRight, Navigation } from 'lucide-react';
import { getBookingById } from '../services/api';
import { EMERGENCY_PHONE, WHATSAPP_NUMBER } from '../utils/constants';
import FreeMap from '../components/FreeMap';

const STATUS_FLOW = ['PENDING', 'APPROVED', 'DISPATCHED', 'COMPLETED'];
const STATUS_LABELS = {
  PENDING:    { label: 'Pending Review',      color: 'badge-pending',    icon: '⏳', step: 0 },
  APPROVED:   { label: 'Approved',            color: 'badge-approved',   icon: '✅', step: 1 },
  DISPATCHED: { label: 'Ambulance Dispatched',color: 'badge-dispatched', icon: '🚑', step: 2 },
  COMPLETED:  { label: 'Completed',           color: 'badge-completed',  icon: '🏥', step: 3 },
  CANCELLED:  { label: 'Cancelled',           color: 'badge-cancelled',  icon: '❌', step: -1 },
};

const BookingConfirmation = () => {
  const { id }      = useParams();
  const location    = useLocation();
  const navigate    = useNavigate();
  const [booking,   setBooking]  = useState(location.state?.booking || null);
  const [loading,   setLoading]  = useState(!booking);
  const [error,     setError]    = useState('');
  const [countdown, setCountdown] = useState(5);

  /* ── Auto-refresh booking status every 5s ── */
  useEffect(() => {
    if (!id) return;
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(id);
        const d   = res.data;
        setBooking(d);
        setLoading(false);
        if (d.status === 'APPROVED') navigate(`/booking/approved/${id}`);
      } catch (_) {
        setError('Failed to load booking details');
        setLoading(false);
      }
    };
    fetchBooking();
    const interval = setInterval(fetchBooking, 5000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  /* ── Countdown refresher UI ── */
  useEffect(() => {
    const t = setInterval(() => setCountdown(c => c <= 1 ? 5 : c - 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading booking details...</p>
      </div>
    </div>
  );

  if (error || !booking) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find this booking.</p>
        <Link to="/" className="btn-emergency">Return to Home</Link>
      </div>
    </div>
  );

  const statusInfo = STATUS_LABELS[booking.status?.toUpperCase()] || STATUS_LABELS.PENDING;
  const stepIdx    = statusInfo.step;

  const timeline = [
    { label: 'Booking Received',    done: stepIdx >= 0, active: stepIdx === 0 },
    { label: 'Admin Reviewing',     done: stepIdx >= 1, active: stepIdx === 1 },
    { label: 'Ambulance Dispatched',done: stepIdx >= 2, active: stepIdx === 2 },
    { label: 'En Route',            done: stepIdx >= 3, active: stepIdx === 3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Success Header */}
        <div className="text-center animate-fade-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 relative">
            <CheckCircle className="h-14 w-14 text-green-600" />
            <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Received! 🎉</h1>
          <p className="text-gray-500">Your request is being processed. Stay on this page for updates.</p>
        </div>

        {/* Booking ID Card */}
        <div className="card-premium rounded-3xl overflow-hidden animate-fade-up delay-100">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-green-200 text-xs font-semibold uppercase tracking-wider">Booking ID</p>
              <p className="text-white text-2xl font-bold font-mono">{booking.bookingId}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>

          {/* Live review notice */}
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
              <p className="text-blue-800 text-sm font-medium">Admin is reviewing your request…</p>
            </div>
            <div className="text-xs text-blue-500">Checking in {countdown}s</div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-3">
            {[
              { label: 'Patient',   value: booking.patientName },
              { label: 'Phone',     value: `+91 ${booking.phone}` },
              { label: 'Emergency', value: booking.emergencyType },
              { label: 'Address',   value: booking.address },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4">
                <span className="text-sm text-gray-400 font-medium w-24 flex-shrink-0">{label}</span>
                <span className="text-sm text-gray-800 font-semibold">{value}</span>
              </div>
            ))}
          </div>

          {/* Mini map */}
          {booking.latitude && booking.longitude && (
            <div className="px-6 pb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pickup Location</p>
              <FreeMap
                lat={booking.latitude}
                lng={booking.longitude}
                interactive={false}
              />
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="card-premium rounded-3xl p-6 animate-fade-up delay-200">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Status Timeline</h3>
          <div className="space-y-4">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-500 ${
                  t.done   ? 'bg-green-500 text-white' :
                  t.active ? 'bg-blue-500 text-white animate-pulse' :
                             'bg-gray-100 text-gray-400'
                }`}>
                  {t.done ? <CheckCircle className="h-4 w-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${t.done || t.active ? 'text-gray-900' : 'text-gray-400'}`}>{t.label}</p>
                  {t.active && <p className="text-xs text-blue-500 mt-0.5">In progress…</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 animate-fade-up delay-300">
          <a href={`tel:${EMERGENCY_PHONE}`}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg">
            <Phone className="h-5 w-5" /> Call Emergency
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg">
            <MessageCircle className="h-5 w-5" /> WhatsApp
          </a>
        </div>

        <p className="text-center text-xs text-gray-400">
          🔄 This page updates automatically. Do not close or refresh.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
