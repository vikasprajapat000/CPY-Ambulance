import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { getBookingByBookingId } from '../services/api';

const TrackModal = ({ isOpen, onClose }) => {
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!bookingId.trim()) return;
    
    setError('');
    setLoading(true);

    try {
      // The bookingId entered by user, e.g., AMB-123456
      const res = await getBookingByBookingId(bookingId.trim().toUpperCase());
      if (res.data && res.data._id) {
        // We have the database _id, which is what the tracking page uses
        onClose();
        navigate(`/tracking/${res.data._id}`);
      } else {
        setError('Booking not found. Please check your ID.');
      }
    } catch (err) {
      setError('Booking not found or an error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-poppins">Track Ambulance</h2>
          <p className="text-red-100 text-sm mt-1">Enter your Booking ID to view live location</p>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleTrack}>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Booking ID</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="e.g. AMB-123456"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 font-mono focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !bookingId}
              className="w-full btn-emergency py-3 rounded-xl flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Searching...</>
              ) : (
                <>Track Now</>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default TrackModal;
