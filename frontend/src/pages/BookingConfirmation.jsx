import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Ambulance,
  MessageCircle
} from 'lucide-react';
import { getBookingById } from '../services/api';
import { EMERGENCY_PHONE, WHATSAPP_NUMBER } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState('');

  // 🔁 AUTO CHECK STATUS EVERY 5 SECONDS
  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const res = await getBookingById(id);
        const bookingData = res.data;

        setBooking(bookingData);
        setLoading(false);

        // ✅ AUTO REDIRECT WHEN APPROVED
        if (bookingData.status === 'APPROVED') {
          navigate(`/booking/approved/${id}`);
        }
      } catch (err) {
        setError('Failed to load booking details');
        setLoading(false);
      }
    };

    fetchBooking();
    const interval = setInterval(fetchBooking, 5000);

    return () => clearInterval(interval);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-600 mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find this booking.
          </p>
          <Link to="/" className="text-red-600 font-semibold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps?q=${booking.latitude},${booking.longitude}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Booking Received
          </h1>
          <p className="text-gray-600">
            Waiting for admin approval…
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 flex justify-between">
            <div>
              <p className="text-sm">Booking ID</p>
              <p className="text-xl font-bold">{booking.bookingId}</p>
            </div>
            <span className="bg-white text-green-600 px-4 py-1 rounded-full font-semibold">
              {booking.status.toUpperCase()}
            </span>
          </div>

          {/* Timeline */}
          <div className="px-6 py-6 bg-blue-50">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
              <p className="font-semibold text-blue-900">
                Admin is reviewing your request…
              </p>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              This page will update automatically.
            </p>
          </div>

          {/* Details */}
          <div className="px-6 py-6 space-y-3">
            <p><b>Patient:</b> {booking.patientName}</p>
            <p><b>Phone:</b> +91 {booking.phone}</p>
            <p><b>Emergency:</b> {booking.emergencyType}</p>
            <p><b>Address:</b> {booking.address}</p>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm"
            >
              View on Google Maps
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <a
            href={`tel:${EMERGENCY_PHONE}`}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold flex justify-center items-center space-x-2"
          >
            <Phone className="h-5 w-5" />
            <span>Call Emergency</span>
          </a>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold flex justify-center items-center space-x-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span>WhatsApp Support</span>
          </a>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Do not refresh — approval will appear automatically.
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;
