import { useEffect, useRef, useState } from 'react';

/**
 * MapWithRouting - Leaflet map that shows an animated ambulance
 * moving from `ambulanceLat/Lng` toward `patientLat/Lng`.
 * Uses free Leaflet + Leaflet Routing Machine (CDN).
 */
const MapWithRouting = ({ ambulanceLat, ambulanceLng, patientLat, patientLng }) => {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const ambulanceMarker = useRef(null);
  const patientMarker  = useRef(null);
  const routeControl   = useRef(null);
  const [loaded, setLoaded] = useState(false);

  /* ── Load Leaflet + LRM from CDN ── */
  useEffect(() => {
    const loadLeaflet = () =>
      new Promise((res) => {
        if (window.L) return res();
        const css = Object.assign(document.createElement('link'), {
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
          crossOrigin: '',
        });
        document.head.appendChild(css);
        const js = Object.assign(document.createElement('script'), {
          src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
          integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
          crossOrigin: '',
        });
        js.onload = res;
        document.head.appendChild(js);
      });

    const loadLRM = () =>
      new Promise((res) => {
        if (window.L && window.L.Routing) return res();
        const css = Object.assign(document.createElement('link'), {
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css',
        });
        document.head.appendChild(css);
        const js = Object.assign(document.createElement('script'), {
          src: 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js',
        });
        js.onload = res;
        document.head.appendChild(js);
      });

    loadLeaflet().then(loadLRM).then(() => setLoaded(true));
  }, []);

  /* ── Create Marker Icons ── */
  const createAmbulanceIcon = (L) =>
    L.divIcon({
      html: `<div style="
        width:44px;height:44px;border-radius:50%;
        background:linear-gradient(135deg,#3b82f6,#1d4ed8);
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 16px rgba(37,99,235,.7);
        animation:ambulance-drive 0.8s ease-in-out infinite;
      ">
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'>
          <path d='M10 10H6'/><path d='M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'/><path d='M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'/><path d='M17 18H9'/><circle cx='7' cy='18' r='2'/><circle cx='17' cy='18' r='2'/>
        </svg>
      </div>`,
      className: '',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

  const createPatientIcon = (L) =>
    L.divIcon({
      html: `<div style="
        position:relative;width:44px;height:44px;
      ">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:rgba(220,38,38,0.25);
          animation:ripple 1.5s ease-out infinite;
        "></div>
        <div style="
          position:absolute;top:4px;left:4px;
          width:36px;height:36px;border-radius:50%;
          background:linear-gradient(135deg,#dc2626,#991b1b);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 12px rgba(220,38,38,.6);
        ">
          <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='white'>
            <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
          </svg>
        </div>
      </div>`,
      className: '',
      iconSize: [44, 44],
      iconAnchor: [22, 44],
    });

  /* ── Init / Update Map ── */
  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    const L = window.L;
    const aLat = ambulanceLat || 28.6200;
    const aLng = ambulanceLng || 77.2100;
    const pLat = patientLat  || 28.6139;
    const pLng = patientLng  || 77.2090;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, { zoomControl: false })
        .setView([(aLat + pLat) / 2, (aLng + pLng) / 2], 14);
      mapInstanceRef.current = map;
      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OSM © CARTO',
      }).addTo(map);
    }

    const map = mapInstanceRef.current;

    // Update / add ambulance marker
    if (ambulanceMarker.current) {
      ambulanceMarker.current.setLatLng([aLat, aLng]);
    } else {
      ambulanceMarker.current = L.marker([aLat, aLng], { icon: createAmbulanceIcon(L) })
        .addTo(map)
        .bindPopup('<b>🚑 Ambulance</b><br/>En route to you');
    }

    // Update / add patient marker
    if (patientMarker.current) {
      patientMarker.current.setLatLng([pLat, pLng]);
    } else {
      patientMarker.current = L.marker([pLat, pLng], { icon: createPatientIcon(L) })
        .addTo(map)
        .bindPopup('<b>📍 Your Location</b>');
    }

    // Routing (show route line)
    if (window.L.Routing && !routeControl.current) {
      routeControl.current = L.Routing.control({
        waypoints: [
          L.latLng(aLat, aLng),
          L.latLng(pLat, pLng),
        ],
        routeWhileDragging: false,
        show: false,
        addWaypoints: false,
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 5, opacity: 0.8, dashArray: '10,6' }],
        },
        createMarker: () => null, // use our custom markers
      }).addTo(map);
    } else if (routeControl.current && window.L.Routing) {
      routeControl.current.setWaypoints([
        L.latLng(aLat, aLng),
        L.latLng(pLat, pLng),
      ]);
    }

    setTimeout(() => map.invalidateSize(), 300);
  }, [loaded, ambulanceLat, ambulanceLng, patientLat, patientLng]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl" style={{ height: '420px' }}>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center z-50 gap-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium text-sm">Loading live map...</p>
        </div>
      )}
      {/* Legend */}
      {loaded && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">🚑</div>
            Ambulance
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px]">📍</div>
            Your Location
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <div className="h-0.5 w-5 border-t-2 border-dashed border-blue-500" />
            Route
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapWithRouting;
