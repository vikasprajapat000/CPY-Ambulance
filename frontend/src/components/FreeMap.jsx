import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Search, Layers, X } from 'lucide-react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

const FreeMap = ({ lat, lng, onChange, interactive = true }) => {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef      = useRef(null);
  const searchRef      = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [suggestions,   setSuggestions]   = useState([]);
  const [searching,     setSearching]     = useState(false);
  const [locating,      setLocating]      = useState(false);
  const [tileMode,      setTileMode]      = useState('voyager'); // voyager | satellite
  const tileLayerRef = useRef(null);
  const debounceRef  = useRef(null);

  /* ── Load Leaflet CDN ── */
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

  /* ── Tile URLs ── */
  const getTileUrl = (mode) =>
    mode === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const getTileAttrib = (mode) =>
    mode === 'satellite'
      ? '© Esri'
      : '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>';

  /* ── Initialize Map ── */
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const initialLat = lat || 28.6139;
    const initialLng = lng || 77.2090;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const L = window.L;
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView([initialLat, initialLng], 14);

    mapInstanceRef.current = map;

    // Custom zoom control (top-right)
    L.control.zoom({ position: 'topright' }).addTo(map);

    // CartoDB Voyager tile layer (beautiful, clean)
    tileLayerRef.current = L.tileLayer(getTileUrl(tileMode), {
      maxZoom: 19,
      attribution: getTileAttrib(tileMode),
    }).addTo(map);

    // Custom ambulance/pin SVG marker
    const pinIcon = L.divIcon({
      html: `
        <div style="position:relative;width:40px;height:40px;">
          <div style="
            position:absolute;inset:0;border-radius:50%;
            background:rgba(220,38,38,0.25);
            animation:ripple 1.5s ease-out infinite;
          "></div>
          <div style="
            position:absolute;top:4px;left:4px;
            width:32px;height:32px;border-radius:50%;
            background:linear-gradient(135deg,#dc2626,#b91c1c);
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 4px 12px rgba(220,38,38,.6);
          ">
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
              <path d='M10 10H6'/><path d='M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'/><path d='M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'/><path d='M17 18H9'/><circle cx='7' cy='18' r='2'/><circle cx='17' cy='18' r='2'/>
            </svg>
          </div>
        </div>
      `,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: pinIcon,
      draggable: interactive,
    }).addTo(map);
    markerRef.current = marker;

    if (interactive && onChange) {
      map.on('click', (e) => {
        const { lat: la, lng: lo } = e.latlng;
        marker.setLatLng([la, lo]);
        onChange(la, lo);
        reverseGeocode(la, lo);
      });
      marker.on('dragend', (e) => {
        const { lat: la, lng: lo } = e.target.getLatLng();
        onChange(la, lo);
        reverseGeocode(la, lo);
      });
    }

    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [leafletLoaded, interactive]);

  /* ── Sync external lat/lng updates ── */
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !lat || !lng) return;
    mapInstanceRef.current.setView([lat, lng], 15);
    markerRef.current?.setLatLng([lat, lng]);
  }, [lat, lng]);

  /* ── Swap tile layer on mode change ── */
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !tileLayerRef.current) return;
    const L = window.L;
    tileLayerRef.current.remove();
    tileLayerRef.current = L.tileLayer(getTileUrl(tileMode), {
      maxZoom: 19,
      attribution: getTileAttrib(tileMode),
    }).addTo(mapInstanceRef.current);
  }, [tileMode]);

  /* ── Reverse geocode (for click/drag updates) ── */
  const reverseGeocode = async (la, lo) => {
    try {
      const r = await fetch(
        `${NOMINATIM_URL}/reverse?lat=${la}&lon=${lo}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const d = await r.json();
      if (d.display_name) setSearchQuery(d.display_name.slice(0, 80));
    } catch (_) {}
  };

  /* ── Address Search (Nominatim) ── */
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
      const data = await r.json();
      setSuggestions(data);
    } catch (_) { setSuggestions([]); }
    setSearching(false);
  };

  const selectSuggestion = (item) => {
    const la = parseFloat(item.lat);
    const lo = parseFloat(item.lon);
    setSuggestions([]);
    setSearchQuery(item.display_name.slice(0, 80));
    if (mapInstanceRef.current && window.L) {
      mapInstanceRef.current.setView([la, lo], 15);
      markerRef.current?.setLatLng([la, lo]);
    }
    if (onChange) onChange(la, lo);
  };

  /* ── GPS Location ── */
  const handleGPS = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const la = coords.latitude;
        const lo = coords.longitude;
        setLocating(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([la, lo], 16);
          markerRef.current?.setLatLng([la, lo]);
        }
        if (onChange) onChange(la, lo);
        reverseGeocode(la, lo);
      },
      () => { setLocating(false); alert('Unable to get your location. Please enable GPS.'); },
      { timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl" style={{ height: '360px' }}>
      {/* Map Loading Skeleton */}
      {!leafletLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center z-[1000] gap-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-semibold text-sm tracking-wide">Initializing Map...</p>
        </div>
      )}

      {/* Search Bar */}
      {interactive && leafletLoaded && (
        <div className="absolute top-3 left-3 right-14 z-[1000]" ref={searchRef}>
          <div className="relative">
            <div className="flex items-center gap-2 bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search address or landmark..."
                className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSuggestions([]); }} className="text-gray-400 hover:text-gray-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              {searching && <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />}
            </div>
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => selectSuggestion(s)}
                    className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-red-50 transition-colors text-left border-b last:border-0 border-gray-50"
                  >
                    <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 line-clamp-2">{s.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* GPS + Tile toggle buttons */}
      {interactive && leafletLoaded && (
        <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
          <button
            onClick={handleGPS}
            title="Use my location"
            className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors border border-gray-200"
          >
            {locating
              ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              : <Navigation className="h-4 w-4 text-red-600" />}
          </button>
          <button
            onClick={() => setTileMode(m => m === 'voyager' ? 'satellite' : 'voyager')}
            title="Toggle satellite view"
            className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors border border-gray-200"
          >
            <Layers className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default FreeMap;
