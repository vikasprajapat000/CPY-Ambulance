import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AlertTriangle, MapPin, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

const NearbyEmergencyListener = ({ coords }) => {
  const [alert, setAlert] = useState(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Connect only once
    const socket = io(SOCKET_URL);
    setSocketInstance(socket);

    socket.on('connect', () => {
      console.log('Nearby Listener: Connected to socket');
    });

    socket.on('nearby-emergency', (data) => {
      console.log('RECEIVED EMERGENCY ALERT', data);
      setAlert(data);
      
      // Auto-hide alert after 30 seconds
      setTimeout(() => {
        setAlert(null);
      }, 30000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Whenever coords update (from LocationGate), emit them to backend
  useEffect(() => {
    if (socketInstance && socketInstance.connected && coords) {
      socketInstance.emit('update-user-location', coords);
    }
  }, [coords, socketInstance]);

  if (!alert) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-bounce-in max-w-sm w-full">
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-5 shadow-2xl border border-red-400 text-white overflow-hidden">
        
        {/* Pulsing background effect */}
        <div className="absolute inset-0 bg-red-500 opacity-20 animate-ping"></div>

        <button 
          onClick={() => setAlert(null)}
          className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
          </div>
          
          <div>
            <h3 className="font-bold text-lg font-poppins mb-1 leading-tight">
              EMERGENCY NEARBY!
            </h3>
            <p className="text-red-100 text-sm mb-3">
              An ambulance was just booked <strong className="text-white text-base bg-black/20 px-2 py-0.5 rounded">{alert.distance}m</strong> away from your current location!
            </p>
            
            <div className="flex flex-col gap-2">
              <div className="bg-black/20 p-2 rounded-lg text-xs flex items-center gap-2">
                <MapPin className="h-3 w-3 text-red-300 shrink-0" />
                <span className="truncate">{alert.address}</span>
              </div>
              
              <button 
                onClick={() => {
                  setAlert(null);
                  navigate(`/tracking/${alert.dbId}`);
                }}
                className="w-full bg-white text-red-700 font-bold py-2 rounded-xl text-sm hover:bg-red-50 transition-colors shadow-md mt-1"
              >
                Track Ambulance Live
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyEmergencyListener;
