import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Phone, MapPin, User, Clock } from 'lucide-react';
import MapPicker from '../components/MapPicker';
import LoadingSpinner from '../components/LoadingSpinner';
import { createBooking } from '../services/api';

const Booking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    emergencyType: '',
    address: '',
    latitude: null,
    longitude: null,
    additionalInfo: ''
  });

  const emergencyTypes = [
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      latitude: location.lat,
      longitude: location.lng
    }));
  };

  const validateForm = () => {
    if (!formData.patientName.trim()) {
      setError('Please enter patient name');
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.emergencyType) {
      setError('Please select emergency type');
      return false;
    }
    if (!formData.address || !formData.latitude || !formData.longitude) {
      setError('Please select pickup location on map');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await createBooking(formData);
      
      // Redirect to WhatsApp immediately
      if (response.whatsappUrl) {
        window.open(response.whatsappUrl, '_blank');
      }

      // Navigate to confirmation page
      navigate(`/booking/confirmation/${response.data._id}`, {
        state: { booking: response.data }
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book <span className="text-red-600">Ambulance</span> Service
          </h1>
          <p className="text-lg text-gray-600">
            Fill in the details below and we'll dispatch an ambulance to your location immediately
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">
              For immediate emergency, please call directly
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="h-5 w-5 text-red-600" />
                <span>Patient Information</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    placeholder="Enter patient's full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-700">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9109090909"
                      maxLength="10"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    We'll call you on this number for confirmation
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Type *
                  </label>
                  <select
                    name="emergencyType"
                    value={formData.emergencyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="">Select emergency type</option>
                    {emergencyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span>Pickup Location</span>
              </h2>
              
              <MapPicker onLocationSelect={handleLocationSelect} />
              
              {formData.address && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Selected Location:</p>
                  <p className="text-sm text-green-700 mt-1">{formData.address}</p>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span>Additional Information</span>
              </h2>
              
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Please provide any additional details about the emergency (symptoms, patient condition, etc.)"
                rows="4"
                maxLength="500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500 text-right">
                {formData.additionalInfo.length}/500 characters
              </p>
            </div>

            {/* What Happens Next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>What Happens Next?</span>
              </h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="font-bold min-w-[20px]">1.</span>
                  <span>You'll receive instant confirmation with your booking details</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold min-w-[20px]">2.</span>
                  <span>Our dispatcher will call you within 2-3 minutes to confirm</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold min-w-[20px]">3.</span>
                  <span>Ambulance will be dispatched to your location</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold min-w-[20px]">4.</span>
                  <span>Expected arrival time: 15-30 minutes</span>
                </li>
              </ol>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>Confirming Booking...</span>
                </>
              ) : (
                <>
                  <Phone className="h-5 w-5" />
                  <span>Confirm Booking & Request Ambulance</span>
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 text-center">
              By submitting, you agree to our privacy policy. Your data is used only for 
              booking purposes and will be handled with complete confidentiality.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;