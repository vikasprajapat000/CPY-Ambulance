import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, MapPin, Phone, Truck, RefreshCw, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const DriverDashboard = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchPendingBookings();
    
    // Poll for new emergencies every 10 seconds
    const interval = setInterval(fetchPendingBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem('cpy_user') ? JSON.parse(localStorage.getItem('cpy_user')).token : '';
      const res = await fetch(`${API_URL}/bookings/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPendingBookings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pending bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (id) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('cpy_user') ? JSON.parse(localStorage.getItem('cpy_user')).token : '';
      const res = await fetch(`${API_URL}/bookings/${id}/accept`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (data.success) {
        // Navigate immediately to the active driver portal for this booking
        navigate(`/driver/${id}`);
      } else {
        alert(data.message || 'Failed to accept booking. It may have been taken by another driver.');
        fetchPendingBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Network error while accepting booking.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-8 shadow-xl">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Truck className="h-8 w-8 text-red-500" /> Driver Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Welcome back, {user?.name}. You are on duty.</p>
          </div>
          <button 
            onClick={() => { setLoading(true); fetchPendingBookings(); }}
            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all border border-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900 font-poppins flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-600" /> Active Emergencies
          </h2>
          <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-sm">
            {pendingBookings.length} Pending
          </span>
        </div>

        {loading && pendingBookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Scanning for emergencies...</p>
          </div>
        ) : pendingBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Clear</h3>
            <p className="text-gray-500">There are no pending emergency requests in your area right now. Stay alert.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                
                {/* Emergency Pulsing Border Effect */}
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600 animate-pulse"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  
                  {/* Left Side Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                        {booking.bookingId}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-1 font-medium">
                        <Clock className="h-4 w-4" /> {new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-900">{booking.emergencyType}</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-800">{booking.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-800">+91 {booking.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Action */}
                  <div className="sm:text-right shrink-0">
                    <button
                      onClick={() => handleAcceptBooking(booking._id)}
                      disabled={actionLoading === booking._id}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold hover:from-red-500 hover:to-red-600 transition-all shadow-lg shadow-red-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {actionLoading === booking._id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <Truck className="h-5 w-5" /> Accept & Drive
                        </>
                      )}
                    </button>
                    <p className="text-xs text-red-500 mt-2 font-medium text-center sm:text-right">Respond Immediately</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
