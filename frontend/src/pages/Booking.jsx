import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Phone, MapPin, User, Clock, ChevronRight, ChevronLeft, Check, Heart, Ambulance, Zap, Activity, ThermometerSun, Wind, Droplets } from 'lucide-react';
import MapPicker from '../components/MapPicker';
import LoadingSpinner from '../components/LoadingSpinner';
import { createBooking } from '../services/api';

const EMERGENCY_TYPES = [
  { id: 'Heart Attack',         icon: <Heart className="h-5 w-5" />,         color: 'from-red-500 to-red-600',      label: 'Heart Attack' },
  { id: 'Stroke',               icon: <Activity className="h-5 w-5" />,      color: 'from-purple-500 to-purple-600',label: 'Stroke' },
  { id: 'Accident',             icon: <Zap className="h-5 w-5" />,           color: 'from-orange-500 to-orange-600',label: 'Accident' },
  { id: 'Breathing Problem',    icon: <Wind className="h-5 w-5" />,          color: 'from-blue-500 to-blue-600',    label: 'Breathing' },
  { id: 'Severe Pain',          icon: <ThermometerSun className="h-5 w-5" />,color: 'from-yellow-500 to-yellow-600',label: 'Severe Pain' },
  { id: 'Unconscious',          icon: <AlertCircle className="h-5 w-5" />,   color: 'from-gray-600 to-gray-700',    label: 'Unconscious' },
  { id: 'Bleeding',             icon: <Droplets className="h-5 w-5" />,      color: 'from-red-600 to-red-700',      label: 'Bleeding' },
  { id: 'Burns',                icon: <ThermometerSun className="h-5 w-5" />,color: 'from-amber-500 to-amber-600',  label: 'Burns' },
  { id: 'Poisoning',            icon: <AlertCircle className="h-5 w-5" />,   color: 'from-green-600 to-green-700',  label: 'Poisoning' },
  { id: 'Pregnancy Emergency',  icon: <Heart className="h-5 w-5" />,         color: 'from-pink-500 to-pink-600',    label: 'Pregnancy' },
  { id: 'Other Emergency',      icon: <Ambulance className="h-5 w-5" />,     color: 'from-slate-500 to-slate-600',  label: 'Other' },
];

const STEPS = [
  { id: 1, title: 'Patient Info',    icon: <User className="h-4 w-4" />,    desc: 'Basic details' },
  { id: 2, title: 'Location',        icon: <MapPin className="h-4 w-4" />,  desc: 'Pickup point'  },
  { id: 3, title: 'Confirm',         icon: <Check className="h-4 w-4" />,   desc: 'Review & submit' },
];

const Booking = () => {
  const navigate  = useNavigate();
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const [formData, setFormData] = useState({
    patientName:    '',
    phone:          '',
    emergencyType:  '',
    address:        '',
    latitude:       null,
    longitude:      null,
    additionalInfo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLocationSelect = (loc) => {
    setFormData(prev => ({
      ...prev,
      address:   loc.address,
      latitude:  loc.lat,
      longitude: loc.lng,
    }));
  };

  const handleEmergencySelect = (type) => {
    setFormData(prev => ({ ...prev, emergencyType: type }));
    setError('');
  };

  /* ── Validation per step ── */
  const validateStep = () => {
    if (step === 1) {
      if (!formData.patientName.trim()) return setError('Please enter patient name') || false;
      if (!/^[0-9]{10}$/.test(formData.phone)) return setError('Please enter a valid 10-digit phone number') || false;
      if (!formData.emergencyType) return setError('Please select an emergency type') || false;
    }
    if (step === 2) {
      if (!formData.address || !formData.latitude || !formData.longitude)
        return setError('Please select your pickup location on the map') || false;
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) { setError(''); setStep(s => s + 1); } };
  const prevStep = () => { setError(''); setStep(s => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await createBooking(formData);
      if (response.whatsappUrl) window.open(response.whatsappUrl, '_blank');
      navigate(`/booking/confirmation/${response.data._id}`, { state: { booking: response.data } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            🚑 Emergency Booking
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Book <span className="text-gradient-emergency">Ambulance</span> Service
          </h1>
          <p className="text-gray-500 text-lg">Fill in the details and we'll dispatch immediately</p>
        </div>

        {/* Step Progress */}
        <div className="mb-8">
          {/* Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {/* Steps */}
          <div className="flex justify-between">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step > s.id
                    ? 'bg-green-500 text-white shadow-lg'
                    : step === s.id
                    ? 'bg-red-600 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > s.id ? <Check className="h-4 w-4" /> : s.icon}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>{s.title}</p>
                  <p className="text-xs text-gray-400 hidden sm:block">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border-l-4 border-red-600 text-red-800 px-4 py-3.5 rounded-xl animate-fade-up">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="card-premium rounded-3xl p-8 shadow-2xl">

          {/* ── STEP 1: Patient Info ── */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Patient Information</h2>
                  <p className="text-sm text-gray-500">Tell us about the patient</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Full Name *</label>
                <input
                  type="text" name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="Enter patient's full name"
                  className="input-premium"
                  autoFocus
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-700 font-semibold text-sm">+91</span>
                  <input
                    type="tel" name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    className="flex-1 px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-r-xl focus:border-red-500 focus:bg-white outline-none transition-all text-sm"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">We'll call this number for confirmation</p>
              </div>

              {/* Emergency Type Icon Cards */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Emergency Type *</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {EMERGENCY_TYPES.map((et) => (
                    <button
                      key={et.id}
                      type="button"
                      onClick={() => handleEmergencySelect(et.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-xs font-semibold ${
                        formData.emergencyType === et.id
                          ? 'border-red-600 bg-red-50 text-red-700 scale-105 shadow-md'
                          : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50 text-gray-600'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${et.color} flex items-center justify-center text-white shadow-sm`}>
                        {et.icon}
                      </div>
                      <span className="text-center leading-tight">{et.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Location ── */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Pickup Location</h2>
                  <p className="text-sm text-gray-500">Where should we send the ambulance?</p>
                </div>
              </div>

              <MapPicker onLocationSelect={handleLocationSelect} />

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Information (optional)</label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Describe symptoms, floor number, landmark, or any helpful details..."
                  rows="3"
                  maxLength="500"
                  className="input-premium resize-none"
                />
                <p className="mt-1.5 text-xs text-gray-400 text-right">{formData.additionalInfo.length}/500</p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Confirm Booking</h2>
                  <p className="text-sm text-gray-500">Review your details before submitting</p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                {[
                  { label: 'Patient Name',   value: formData.patientName },
                  { label: 'Phone',          value: `+91 ${formData.phone}` },
                  { label: 'Emergency Type', value: formData.emergencyType },
                  { label: 'Pickup Address', value: formData.address },
                  ...(formData.additionalInfo ? [{ label: 'Additional Info', value: formData.additionalInfo }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                    <span className="text-sm font-semibold text-gray-500 sm:w-36 flex-shrink-0">{label}</span>
                    <span className="text-sm text-gray-900 font-medium">{value || '—'}</span>
                  </div>
                ))}
              </div>

              {/* What happens next */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> What Happens Next?
                </h3>
                <ol className="space-y-2">
                  {[
                    'Instant confirmation with booking ID',
                    'Our dispatcher calls within 2-3 minutes',
                    'Ambulance dispatched to your location',
                    'Expected arrival: 15-30 minutes',
                  ].map((txt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                      <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                      {txt}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full btn-emergency py-4 text-lg justify-center emergency-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><LoadingSpinner /><span>Confirming Booking...</span></>
                ) : (
                  <><Phone className="h-5 w-5" /><span>Confirm & Request Ambulance</span></>
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                By submitting, you agree to our privacy policy. Your data is handled with complete confidentiality.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 3 && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              )}
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 btn-emergency py-3 justify-center"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Emergency call reminder */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            For immediate life-threatening emergencies, please{' '}
            <a href="tel:112" className="text-red-600 font-bold hover:underline">call 112</a>
            {' '}or{' '}
            <a href="tel:+911234567890" className="text-red-600 font-bold hover:underline">our hotline</a>
            {' '}directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;