import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const AmbulanceTracking = () => {
  const { id } = useParams();

  // Demo ambulance location (simulated movement)
  const [location, setLocation] = useState({
    lat: 28.6139,
    lng: 77.2090
  });

  // 🔁 Simulate live movement every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLocation(prev => ({
        lat: prev.lat + 0.0005,
        lng: prev.lng + 0.0005
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const mapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          🚑 Live Ambulance Tracking
        </h1>

        <Link
          to="/"
          className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>

      <p className="text-gray-600 mb-4">
        Booking ID: <b>{id}</b>
      </p>

      {/* Map */}
      <div className="w-full h-[450px] rounded-lg overflow-hidden border">
        <iframe
          title="Ambulance Location"
          src={mapUrl}
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Location updates automatically every few seconds.
      </p>
    </div>
  );
};

export default AmbulanceTracking;
