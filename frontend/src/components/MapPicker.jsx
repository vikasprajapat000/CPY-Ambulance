import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Search, X } from 'lucide-react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

const MapPicker = ({ onLocationSelect }) => {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef      = useRef(null);
  const debounceRef    = useRef(null);

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [suggestions,   setSuggestions]   = useState([]);
  const [searching,     setSearching]     = useState(false);
  const [locating,      setLocating]      = useState(false);
  const [selectedAddr,  setSelectedAddr]  = useState('');

  /* ── Load Leaflet ── */
  useEffect(() => {
    if (window.L) { setLeafletLoaded(true); return; }

    const link = Object.assign(document.createElement('link'), {
      rel: 'stylesheet',
      href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
      crossOrigin: '',
    });
    document.head.appendChild(link);

    const script = Object.assign(document.createElement('script'), {
      src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
      integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
      crossOrigin: '',
    });
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  /* ── Pinpoint SVG icon ── */
  const getPinIcon = (L) => L.divIcon({
    html: `
      <div style="position:relative;width:44px;height:44px;">
        <div style="
          position:absolute;inset:-4px;border-radius:50%;
          background:rgba(220,38,38,0.2);
          animation:ripple 1.8s ease-out infinite;
        "></div>
        <div style="
          position:absolute;top:2px;left:2px;
          width:40px;height:40px;border-radius:50%;
          background:linear-gradient(135deg,#dc2626,#991b1b);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 6px 20px rgba(220,38,38,.6);
        ">
          <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='white'>
            <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
          </svg>
        </div>
      </div>
    `,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });

  /* ── Init Map ── */
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const L = window.L;
    const map = L.map(mapRef.current, { zoomControl: false })
      .setView([28.6139, 77.2090], 12);

    mapInstanceRef.current = map;
    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OSM © CARTO',
    }).addTo(map);

    const marker = L.marker([28.6139, 77.2090], {
      icon: getPinIcon(L),
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    const onPlace = async (la, lo) => {
      marker.setLatLng([la, lo]);
      const addr = await reverseGeocode(la, lo);
      setSelectedAddr(addr);
      if (onLocationSelect) onLocationSelect({ lat: la, lng: lo, address: addr });
    };

    map.on('click', (e) => onPlace(e.latlng.lat, e.latlng.lng));
    marker.on('dragend', (e) => {
      const { lat: la, lng: lo } = e.target.getLatLng();
      onPlace(la, lo);
    });

    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);

    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, [leafletLoaded]);

  /* ── Reverse geocode ── */
  const reverseGeocode = async (la, lo) => {
    try {
      const r = await fetch(
        `${NOMINATIM_URL}/reverse?lat=${la}&lon=${lo}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const d = await r.json();
      return d.display_name || `${la.toFixed(5)}, ${lo.toFixed(5)}`;
    } catch (_) {
      return `${la.toFixed(5)}, ${lo.toFixed(5)}`;
    }
  };

  /* ── Search ── */
  const handleSearchInput = (val) => {
    setSearchQuery(val);
    setSuggestions([]);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 3) return;
    debounceRef.current = setTimeout(() => doSearch(val), 400);
  };

  const doSearch = async (q) => {
    setSearching(true);
    try {
      const r = await fetch(
        `${NOMINATIM_URL}/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      );
      setSuggestions(await r.json());
    } catch (_) { setSuggestions([]); }
    setSearching(false);
  };

  const selectSuggestion = (item) => {
    const la = parseFloat(item.lat);
    const lo = parseFloat(item.lon);
    const addr = item.display_name;
    setSuggestions([]);
    setSearchQuery('');
    setSelectedAddr(addr);
    if (mapInstanceRef.current && window.L) {
      mapInstanceRef.current.setView([la, lo], 16);
      markerRef.current?.setLatLng([la, lo]);
    }
    if (onLocationSelect) onLocationSelect({ lat: la, lng: lo, address: addr });
  };

  /* ── GPS ── */
  const handleGPS = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const la = coords.latitude;
        const lo = coords.longitude;
        setLocating(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([la, lo], 16);
          markerRef.current?.setLatLng([la, lo]);
        }
        const addr = await reverseGeocode(la, lo);
        setSelectedAddr(addr);
        if (onLocationSelect) onLocationSelect({ lat: la, lng: lo, address: addr });
      },
      () => { setLocating(false); alert('GPS not available. Please search or click on map.'); },
      { timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      {/* Search + GPS Controls */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-red-500 focus-within:bg-white transition-all">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search pickup address or landmark..."
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSuggestions([]); }}>
                <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {searching && <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />}
          </div>
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-56 overflow-y-auto">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => selectSuggestion(s)}
                  className="w-full flex items-start gap-2.5 px-4 py-3 hover:bg-red-50 border-b last:border-0 border-gray-50 text-left transition-colors"
                >
                  <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 line-clamp-2">{s.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* GPS Button */}
        <button
          type="button"
          onClick={handleGPS}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-colors shadow-md flex-shrink-0"
        >
          {locating
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Navigation className="h-4 w-4" />}
          <span className="hidden sm:inline">{locating ? 'Locating...' : 'Use GPS'}</span>
        </button>
      </div>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg" style={{ height: '300px' }}>
        {!leafletLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center z-50 gap-3">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Loading map...</p>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Selected location card */}
      {selectedAddr && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-fade-up">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-0.5">Selected Pickup Location</p>
            <p className="text-sm text-green-700 leading-relaxed">{selectedAddr}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 flex items-center gap-1.5">
        <MapPin className="h-3 w-3" />
        Click on the map, drag the pin, search an address, or use GPS to select your pickup location
      </p>
    </div>
  );
};

export default MapPicker;
