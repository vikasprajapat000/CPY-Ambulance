// Emergency contact numbers
export const EMERGENCY_PHONE = import.meta.env.VITE_EMERGENCY_PHONE || '+91-9XXXXXXXXX';
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919XXXXXXXXX';

// Booking status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  DISPATCHED: 'dispatched',
  ARRIVED: 'arrived',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Emergency types
export const EMERGENCY_TYPES = [
  'Heart Attack',
  'Stroke',
  'Accident',
  'Breathing Problem',
  'Severe Pain',
  'Unconscious',
  'Bleeding',
  'Burns',
  'Poisoning',
  'Pregnancy Emergency',
  'Other Emergency'
];

// Status colors
export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  dispatched: 'bg-blue-100 text-blue-800',
  arrived: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

// Default location (Delhi NCR center)
export const DEFAULT_LOCATION = {
  lat: 28.6139,
  lng: 77.2090
};