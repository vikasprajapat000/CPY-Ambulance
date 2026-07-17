import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Truck, Navigation, Power, AlertCircle, MapPin, CheckCircle } from 'lucide-react';
import { getBookingById, updateAmbulanceLocation, updateBookingStatus } from '../services/api';

const DriverPortal = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const watchIdRef = useRef(null);
  const lastEmitRef = useRef(0);

  // Fetch Booking Details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(id);
        if (res.data) {
          setBooking(res.data);
          setStatus(res.data.status);
        }
      } catch (err) {
        setError('Failed to load booking details.');
      }
      setLoading(false);
    };
    fetchBooking();
  }, [id]);

  // Tracking Logic
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setError('');
    setTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, speed } = pos.coords;
        setLocation({ lat: latitude, lng: longitude, speed: speed || 0 });

        // Throttle emissions to once every 3 seconds to save bandwidth
        const now = Date.now();
        if (now - lastEmitRef.current > 3000) {
          lastEmitRef.current = now;
          try {
            await updateAmbulanceLocation({
              bookingId: id,
              lat: latitude,
              lng: longitude,
              speed: speed || 0
            });
          } catch (err) {
            console.error('Failed to sync location', err);
          }
        }
      },
      (err) => {
        setError(`Location Error: ${err.message}`);
        setTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
  };

  const stopTracking = () => {
    setTracking(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      setStatus(newStatus);
      if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
        stopTracking();
      }
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading Driver Portal...</div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">{error || 'Booking Not Found'}</div>;

  const isCompleted = status === 'COMPLETED' || status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-red-600 px-6 py-4 shadow-md sticky top-0 z-50 flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6" /> Driver Console
        </h1>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-mono font-bold">
          {booking.bookingId}
        </span>
      </header>

      <main className="flex-grow p-4 sm:p-6 max-w-lg mx-auto w-full flex flex-col gap-6">
        
        {/* Patient Info Card */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 shadow-xl">
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Patient Details
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="font-bold">{booking.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Phone:</span>
              <span className="font-bold text-blue-400">
                <a href={`tel:${booking.phone}`}>+91 {booking.phone}</a>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Emergency:</span>
              <span className="font-bold text-red-400">{booking.emergencyType}</span>
            </div>
            <div className="pt-2 border-t border-gray-700 mt-2">
              <span className="text-gray-400 block mb-1">Destination Address:</span>
              <p className="font-medium text-gray-200">{booking.address}</p>
            </div>
          </div>
        </div>

        {/* Tracking Control */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 shadow-xl flex flex-col items-center justify-center text-center">
          {error && (
            <div className="w-full bg-red-900/50 border border-red-500 text-red-200 text-sm p-3 rounded-lg mb-4 flex items-center gap-2 text-left">
              <AlertCircle className="h-5 w-5 shrink-0" /> {error}
            </div>
          )}

          <div className="relative mb-6">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-colors duration-500 ${
              tracking ? 'border-green-500 bg-green-500/10' : isCompleted ? 'border-gray-600 bg-gray-700' : 'border-blue-500 bg-blue-500/10'
            }`}>
              <Navigation className={`h-12 w-12 transition-transform duration-1000 ${tracking ? 'text-green-500 rotate-45 animate-pulse' : isCompleted ? 'text-gray-500' : 'text-blue-500'}`} />
            </div>
            {tracking && (
              <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2">
            {tracking ? 'GPS Tracking Active' : isCompleted ? 'Trip Finished' : 'GPS Tracking Inactive'}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            {tracking 
              ? 'Your exact location is being streamed to the patient and hospital in real-time.' 
              : isCompleted
              ? 'This booking has been closed.'
              : 'Start tracking when you are en route to the patient.'}
          </p>

          {!isCompleted && (
            <button
              onClick={tracking ? stopTracking : startTracking}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                tracking 
                  ? 'bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-500/50' 
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30'
              }`}
            >
              <Power className="h-6 w-6" />
              {tracking ? 'Stop Broadcasting' : 'Start Engine & Track'}
            </button>
          )}

          {location && tracking && (
            <div className="mt-6 w-full grid grid-cols-2 gap-4 text-left">
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <span className="text-gray-500 text-xs uppercase">Speed</span>
                <div className="font-mono text-lg">{Math.round(location.speed * 3.6)} <span className="text-xs text-gray-500">km/h</span></div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <span className="text-gray-500 text-xs uppercase">Signal</span>
                <div className="font-bold text-green-400">Excellent</div>
              </div>
            </div>
          )}
        </div>

        {/* Workflow Actions */}
        {!isCompleted && (
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={status === 'ARRIVING'}
              onClick={() => handleStatusChange('ARRIVING')}
              className={`py-3 rounded-xl font-bold transition-all ${status === 'ARRIVING' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'}`}
            >
              Mark Arriving
            </button>
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              className="py-3 rounded-xl font-bold bg-gray-800 text-gray-400 border border-gray-700 hover:bg-teal-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-5 w-5" /> Finish Trip
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default DriverPortal;
