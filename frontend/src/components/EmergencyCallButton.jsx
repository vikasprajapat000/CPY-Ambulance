import { Phone } from 'lucide-react';
import { EMERGENCY_PHONE } from '../utils/constants';

const EmergencyCallButton = () => {
  return (
    <a
      href={`tel:${EMERGENCY_PHONE}`}
      className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-all shadow-lg inline-flex items-center justify-center space-x-2"
    >
      <Phone className="h-5 w-5" />
      <span>Emergency Call</span>
    </a>
  );
};

export default EmergencyCallButton;