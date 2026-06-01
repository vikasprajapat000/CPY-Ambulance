import { useState } from 'react';
import { MapPin, Navigation, Loader } from 'lucide-react';
import FreeMap from './FreeMap';

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
    return data.display_name || `Coordinate (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  };

  // 🔍 Forward geocode manual address using OpenStreetMap (FREE)
  const forwardGeocode = async (addressText) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressText)}&limit=1`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name
      };
    }
    return null;
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
          setError('Failed to fetch address for current location');
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

  // 🎯 SELECT LOCATION FROM INTERACTIVE MAP DRAG/CLICK
  const handleMapLocationSelect = async (lat, lng) => {
    setLoading(true);
    setError('');

    try {
      const address = await reverseGeocode(lat, lng);
      
      const finalLocation = {
        lat,
        lng,
        address
      };

      setLocation(finalLocation);
      onLocationSelect(finalLocation);
    } catch (err) {
      setError('Failed to get address for selected map coordinates');
    } finally {
      setLoading(false);
    }
  };

  // ✍️ MANUAL ADDRESS SUBMIT
  const handleManualAddressSubmit = async () => {
    if (!manualAddress.trim()) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Attempt real geocoding using OSM
      const geoResult = await forwardGeocode(manualAddress);
      
      if (geoResult) {
        setLocation(geoResult);
        onLocationSelect(geoResult);
      } else {
        // Fallback to Delhi default center if lookup yielded nothing
        const demoLocation = {
          lat: 28.6139,
          lng: 77.2090,
          address: `${manualAddress} (Location approximate)`,
        };
        setLocation(demoLocation);
        onLocationSelect(demoLocation);
      }
    } catch (err) {
      // Network issues/throttling fallback
      const demoLocation = {
        lat: 28.6139,
        lng: 77.2090,
        address: `${manualAddress} (Fallback location)`,
      };
      setLocation(demoLocation);
      onLocationSelect(demoLocation);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Interactive Map Visual Picker */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Pickup Point on Map (Click Map or Drag Red Pin)
        </label>
        <FreeMap
          lat={location ? location.lat : 28.6139}
          lng={location ? location.lng : 77.2090}
          onChange={handleMapLocationSelect}
          interactive={!loading}
        />
      </div>

      {/* Use Current Location Button */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={loading}
        className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center space-x-2 shadow transition-colors"
      >
        {loading ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            <span>Detecting Location...</span>
          </>
        ) : (
          <>
            <Navigation className="h-5 w-5 animate-pulse" />
            <span>Detecting Live Location</span>
          </>
        )}
      </button>

      <div className="flex items-center space-x-4">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-500 font-semibold">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Manual Address Lookup */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Pickup Address / landmark
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="Type address, e.g. Red Fort, Delhi"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
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
            className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Location Confirmation Details */}
      {location && (
        <div className="p-4 bg-green-50 border-2 border-green-400 rounded-lg shadow-sm">
          <div className="flex items-start space-x-3">
            <MapPin className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Pickup Coordinates Confirmed:</p>
              <p className="text-xs text-green-700 mt-1">{location.address}</p>
              <p className="text-xs font-mono text-green-600 mt-1">
                Latitude: {location.lat.toFixed(6)} | Longitude: {location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center font-medium">
        💡 Pro-Tip: Geolocation and dragging the map pin give the most precise results for emergency drivers.
      </p>
    </div>
  );
};

export default MapPicker;
