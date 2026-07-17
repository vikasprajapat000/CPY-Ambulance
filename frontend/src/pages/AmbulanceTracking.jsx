import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home, MapPin, Phone, MessageCircle, Clock, Zap, CheckCircle, Navigation } from 'lucide-react';
import MapWithRouting from '../components/MapWithRouting';
import { EMERGENCY_PHONE, WHATSAPP_NUMBER } from '../utils/constants';
import { getBookingById } from '../services/api';

import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

const STATUS_STEPS = [
  { key: 'BOOKED',     label: 'Booking Received',    icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-500' },
  { key: 'DISPATCHED', label: 'Ambulance Dispatched', icon: <Zap className="h-4 w-4" />,         color: 'bg-blue-500' },
  { key: 'EN_ROUTE',   label: 'En Route',             icon: <Navigation className="h-4 w-4" />,  color: 'bg-orange-500' },
  { key: 'ARRIVING',   label: 'Arriving Soon',        icon: <MapPin className="h-4 w-4" />,       color: 'bg-red-500' },
];

const AmbulanceTracking = () => {
  const { id } = useParams();
  const [statusIdx, setStatusIdx] = useState(1);
  const [loading, setLoading] = useState(true);

  // Real locations from database
  const [patientLoc, setPatientLoc] = useState({ lat: 28.6139, lng: 77.2090 });
  const [ambPos, setAmbPos] = useState({ lat: 28.6139, lng: 77.2090 });
  
  const [speed, setSpeed] = useState(0);
  const [eta, setEta] = useState(15);
  
  useEffect(() => {
    // 1. Fetch real booking data to get patient coordinates
    const fetchInitialData = async () => {
      try {
        const res = await getBookingById(id);
        const b = res.data;
        if (b && b.latitude && b.longitude) {
          setPatientLoc({ lat: b.latitude, lng: b.longitude });
          // Temporarily set ambulance to patient location until first GPS ping arrives
          // Or we could fetch from location endpoint
          setAmbPos({ lat: b.latitude - 0.005, lng: b.longitude - 0.005 }); // Small offset just so it's not hidden
        }
        
        // Match UI status index based on DB status
        const statusMap = { 'PENDING': 0, 'APPROVED': 1, 'DISPATCHED': 2, 'EN_ROUTE': 2, 'ARRIVING': 3, 'COMPLETED': 3 };
        if (b && b.status && statusMap[b.status] !== undefined) {
          setStatusIdx(statusMap[b.status]);
        }
      } catch (err) {
        console.error("Failed to fetch booking details", err);
      }
      setLoading(false);
    };

    fetchInitialData();

    // 2. Real-time tracking connection via Socket.io
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to live tracking server');
      socket.emit('join-booking', id);
    });

    socket.on('location-update', (data) => {
      if (data.lat && data.lng) {
        setAmbPos({ lat: data.lat, lng: data.lng });
        if (data.speed !== undefined) setSpeed(Math.round(data.speed * 3.6));
        
        setPatientLoc(prev => {
          const dx = (data.lat - prev.lat) * 111; 
          const dy = (data.lng - prev.lng) * 111;
          const distKm = Math.sqrt(dx*dx + dy*dy);
          const etaMins = (distKm / 40) * 60;
          setEta(Math.max(1, etaMins));
          return prev;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Live Tracker...</div>;

  const etaMin = Math.ceil(eta);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl animate-bounce-gen">🚑</span>
              Live Ambulance Tracking
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Booking ID: <span className="text-white font-mono font-semibold">{id}</span></p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/20"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ETA + Status Panel */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ETA */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-orange-400" />
            <div className="text-4xl font-extrabold text-orange-400">{etaMin}</div>
            <div className="text-gray-300 text-sm">Minutes ETA</div>
          </div>

          {/* Speed */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-blue-400" />
            <div className="text-4xl font-extrabold text-blue-400">{speed}</div>
            <div className="text-gray-300 text-sm">km/h Speed</div>
          </div>

          {/* Distance */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
            <MapPin className="h-6 w-6 mx-auto mb-2 text-green-400" />
            <div className="text-4xl font-extrabold text-green-400">{(eta * 0.75).toFixed(1)}</div>
            <div className="text-gray-300 text-sm">km Away</div>
          </div>

          {/* Status */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400">LIVE</div>
            <div className="text-gray-300 text-sm">Tracking Active</div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Status Timeline</h3>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-500 ${
                    i <= statusIdx ? s.color + ' shadow-lg scale-110' : 'bg-gray-700'
                  }`}>
                    {s.icon}
                  </div>
                  <p className={`text-xs mt-1.5 font-medium text-center max-w-[64px] ${i <= statusIdx ? 'text-white' : 'text-gray-500'}`}>
                    {s.label}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 transition-all duration-700 ${i < statusIdx ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leaflet Map with Routing */}
        <div className="w-full">
          <MapWithRouting 
            ambulanceLat={ambPos.lat}
            ambulanceLng={ambPos.lng}
            patientLat={patientLoc.lat}
            patientLng={patientLoc.lng}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href={`tel:${EMERGENCY_PHONE}`}
            className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg"
          >
            <Phone className="h-5 w-5 animate-bounce-gen" />
            Call Emergency
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-700 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp Support
          </a>
        </div>

        <p className="text-center text-gray-500 text-sm">
          🔄 Location updates automatically every few seconds · Do not refresh this page
        </p>
      </div>
    </div>
  );
};

export default AmbulanceTracking;
