import { useState, useEffect } from 'react';
import { MapPinOff, MapPin, Loader2, Ambulance } from 'lucide-react';
import NearbyEmergencyListener from './NearbyEmergencyListener';

const LocationGate = ({ children }) => {
  const [status, setStatus] = useState('pending'); // 'pending' | 'granted' | 'denied'
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('granted');
      },
      (err) => {
        console.error("Location Access Error:", err);
        setStatus('denied');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-red-600/30 rounded-full animate-ping" />
          <div className="absolute inset-2 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <Ambulance className="h-8 w-8 text-white z-10 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold font-poppins mb-2">Location Access Required</h1>
        <p className="text-gray-400 max-w-md">
          Please click <strong>"Allow"</strong> when your browser prompts for your location. 
          We use this exclusively to notify you of nearby emergencies in real-time.
        </p>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-24 h-24 bg-red-900/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
          <MapPinOff className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold font-poppins text-red-500 mb-4">Access Blocked</h1>
        <p className="text-gray-300 max-w-md text-lg mb-8 leading-relaxed">
          You cannot use the CPY Ambulance network without enabling location services. 
          We require this to ensure the safety of our community through proximity alerts.
        </p>
        
        <div className="bg-gray-800 p-6 rounded-2xl max-w-sm w-full border border-gray-700 text-left">
          <h3 className="font-bold text-white mb-2">How to fix this:</h3>
          <ol className="list-decimal pl-5 text-gray-400 text-sm space-y-2 marker:text-red-500">
            <li>Click the padlock icon 🔒 in your browser's address bar.</li>
            <li>Find "Location" and change it to "Allow".</li>
            <li>Refresh this page.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* If granted, render the actual app routes */}
      {children}
      {/* And run the listener in the background, feeding it the live coordinates */}
      <NearbyEmergencyListener coords={coords} />
    </>
  );
};

export default LocationGate;
