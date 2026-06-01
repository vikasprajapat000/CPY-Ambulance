import { useEffect, useRef, useState } from 'react';

const FreeMap = ({ lat, lng, onChange, interactive = true }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet CDN dynamically to avoid extra npm packages
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Add Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Allow Leaflet scripts to remain cached/mounted in the head
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const initialLat = lat || 28.6139; // Delhi center default
    const initialLng = lng || 77.2090;

    // Clear previous instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const L = window.L;

    // Create Map
    const map = L.map(mapRef.current).setView([initialLat, initialLng], 14);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer (beautiful standard style)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Beautiful Red Pin marker
    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add Marker
    const marker = L.marker([initialLat, initialLng], {
      icon: redIcon,
      draggable: interactive
    }).addTo(map);
    markerRef.current = marker;

    if (interactive && onChange) {
      // Move marker on clicking anywhere on map
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onChange(lat, lng);
      });

      // Move marker on dragging
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        onChange(lat, lng);
      });
    }

    // Adjust map dimensions immediately
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, interactive]);

  // Sync outside updates (like current location updates)
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !lat || !lng) return;
    
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    
    map.setView([lat, lng], 15);
    if (marker) {
      marker.setLatLng([lat, lng]);
    }
  }, [lat, lng]);

  return (
    <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-gray-300 shadow-inner">
      {!leafletLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 font-medium z-[1000]">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold tracking-wide">Loading Interactive Map...</span>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '320px' }} />
    </div>
  );
};

export default FreeMap;
