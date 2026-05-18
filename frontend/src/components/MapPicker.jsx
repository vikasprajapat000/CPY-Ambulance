import { useState } from 'react';
import { MapPin, Navigation, Loader } from 'lucide-react';

const MapPicker = ({ onLocationSelect }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualAddress, setManualAddress] = useState('');

  // 🔁 Reverse geocode using OpenStreetMap (FREE)
  const reverseGeocode = async (lat, lng) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.display_name || 'Location detected';
  };

  // 📍 USE CURRENT LIVE LOCATION
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const address = await reverseGeocode(lat, lng);

          const finalLocation = {
            lat,
            lng,
            address,
          };

          setLocation(finalLocation);
          onLocationSelect(finalLocation); // 🔥 auto-send to Booking.jsx
        } catch (err) {
          setError('Failed to fetch address');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError('Please allow location access to continue');
      },
      { enableHighAccuracy: true }
    );
  };

  // ✍️ MANUAL ADDRESS (fallback only)
  const handleManualAddressSubmit = async () => {
    if (!manualAddress.trim()) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ⚠️ Fallback only (no random GPS)
      const demoLocation = {
        lat: 28.6139,
        lng: 77.2090,
        address: manualAddress,
      };

      setLocation(demoLocation);
      onLocationSelect(demoLocation);
    } catch {
      setError('Failed to set address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Use Current Location Button */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            <span>Detecting Location...</span>
          </>
        ) : (
          <>
            <Navigation className="h-5 w-5" />
            <span>Use My Current Location</span>
          </>
        )}
      </button>

      <div className="flex items-center space-x-4">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Manual Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pickup Address (optional)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="Enter address manually"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleManualAddressSubmit();
              }
            }}
          />
          <button
            type="button"
            onClick={handleManualAddressSubmit}
            disabled={loading}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Set
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Location Confirmation */}
      {location && (
        <div className="relative h-64 bg-gray-100 rounded-lg border-2 border-green-400 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-14 w-14 text-red-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-800">Location Confirmed</p>
            <p className="text-xs text-gray-600 mt-1 px-4">
              {location.address}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        💡 Tip: Using current location gives fastest ambulance dispatch.
      </p>
    </div>
  );
};

export default MapPicker;
