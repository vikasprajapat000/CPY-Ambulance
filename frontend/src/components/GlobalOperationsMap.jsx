import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

const GlobalOperationsMap = ({ bookings }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({}); // store marker instances by booking ID
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet
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

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    if (mapInstanceRef.current) return; // already init

    const L = window.L;
    
    // Default center (Delhi NCR)
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([28.6139, 77.2090], 10);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [leafletLoaded]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    const createIcon = (colorHex) => L.divIcon({
      html: `<div style="
        width: 32px; height: 32px; border-radius: 50%;
        background: linear-gradient(135deg, ${colorHex}, ${colorHex}dd);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px ${colorHex}88; border: 2px solid white;
      ">
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const statusColors = {
      'PENDING': '#f59e0b', // yellow
      'APPROVED': '#10b981', // green
      'DISPATCHED': '#3b82f6', // blue
      'EN_ROUTE': '#f97316', // orange
      'ARRIVING': '#ef4444', // red
      'COMPLETED': '#14b8a6', // teal
      'CANCELLED': '#6b7280' // gray
    };

    const getPopupContent = (b, color) => `
      <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 200px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 8px;">
          <strong style="font-size: 14px; color: #111;">${b.bookingId}</strong>
          <span style="font-size: 10px; font-weight: bold; background: ${color}22; color: ${color}; padding: 2px 6px; border-radius: 12px;">${b.status || 'PENDING'}</span>
        </div>
        <div style="font-size: 13px; color: #444; margin-bottom: 4px;"><strong>Patient:</strong> ${b.patientName}</div>
        <div style="font-size: 13px; color: #444; margin-bottom: 4px;"><strong>Phone:</strong> +91 ${b.phone}</div>
        <div style="font-size: 13px; color: #444; margin-bottom: 8px;"><strong>Type:</strong> <span style="color: #dc2626;">${b.emergencyType}</span></div>
        <div style="font-size: 12px; color: #666; background: #f9f9f9; padding: 6px; border-radius: 6px; line-height: 1.4;">${b.address}</div>
      </div>
    `;

    // Track active booking IDs to remove old markers
    const currentIds = new Set();
    const bounds = [];

    bookings.forEach(b => {
      if (!b.latitude || !b.longitude) return;
      currentIds.add(b._id);

      const color = statusColors[b.status?.toUpperCase()] || statusColors.PENDING;
      const icon = createIcon(color);
      const latlng = [b.latitude, b.longitude];
      bounds.push(latlng);

      const popupContent = getPopupContent(b, color);

      if (markersRef.current[b._id]) {
        // Update existing marker
        markersRef.current[b._id].setLatLng(latlng);
        markersRef.current[b._id].setIcon(icon);
        markersRef.current[b._id].getPopup().setContent(popupContent);
      } else {
        // Create new marker
        const marker = L.marker(latlng, { icon }).addTo(map);
        marker.bindPopup(popupContent);
        markersRef.current[b._id] = marker;
      }
    });

    // Remove markers for bookings that are no longer active
    Object.keys(markersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    // Auto fit bounds if there are markers (only do this occasionally or on first load to not annoy users)
    if (bounds.length > 0 && !window.hasFittedBoundsForMap) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50], maxZoom: 14 });
      window.hasFittedBoundsForMap = true;
    }

    // ── Setup Socket.io for Real-Time Marker Updates ──
    const socket = io(SOCKET_URL);
    socket.on('connect', () => {
      console.log('Admin Map: Connected to Live Tracking Socket');
      // Admin joins all active booking rooms to receive their updates
      bookings.forEach(b => {
        socket.emit('join-booking', b._id);
      });
    });

    socket.on('location-update', (data) => {
      if (!data.bookingId || !data.lat || !data.lng) return;
      
      const marker = markersRef.current[data.bookingId];
      if (marker) {
        // Instantly move the marker on the map!
        marker.setLatLng([data.lat, data.lng]);
      }
    });

    return () => {
      socket.disconnect();
    };

  }, [bookings, leafletLoaded]);

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div ref={mapRef} className="absolute inset-0 z-0 bg-gray-50" />
      
      {!leafletLoaded && (
        <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 font-medium">Initializing Live Operations Map...</p>
          </div>
        </div>
      )}

      {/* Legend overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-2 pointer-events-none">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status Legend</h4>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700"><div className="w-3 h-3 rounded-full" style={{background: '#f59e0b'}}></div> Pending</div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700"><div className="w-3 h-3 rounded-full" style={{background: '#10b981'}}></div> Approved</div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700"><div className="w-3 h-3 rounded-full" style={{background: '#3b82f6'}}></div> Dispatched</div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700"><div className="w-3 h-3 rounded-full" style={{background: '#14b8a6'}}></div> Completed</div>
      </div>
    </div>
  );
};

export default GlobalOperationsMap;
