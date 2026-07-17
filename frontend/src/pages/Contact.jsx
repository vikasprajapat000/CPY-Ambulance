import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { EMERGENCY_PHONE, WHATSAPP_NUMBER } from '../utils/constants';
import FreeMap from '../components/FreeMap';

/* Toast component */
const Toast = ({ msg, type, onClose }) => (
  <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'} flex items-center gap-3`}>
    {type === 'success' ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <span>❌</span>}
    <span>{msg}</span>
    <button onClick={onClose} className="ml-auto text-current opacity-70 hover:opacity-100">✕</button>
  </div>
);

const contactInfo = [
  { icon: <Phone className="h-5 w-5" />,          title: 'Emergency Hotline', value: EMERGENCY_PHONE,          href: `tel:${EMERGENCY_PHONE}`,                    color: 'bg-red-100 text-red-600',    hoverBg: 'hover:bg-red-600', accent: 'text-red-600' },
  { icon: <MessageCircle className="h-5 w-5" />,  title: 'WhatsApp',          value: 'Chat with us 24/7',     href: `https://wa.me/${WHATSAPP_NUMBER}`,           color: 'bg-green-100 text-green-600',hoverBg: 'hover:bg-green-600', accent: 'text-green-600', external: true },
  { icon: <Mail className="h-5 w-5" />,           title: 'Email',             value: 'vikas93prajapat@gmail.com', href: 'mailto:vikas93prajapat@gmail.com',        color: 'bg-blue-100 text-blue-600',  hoverBg: 'hover:bg-blue-600', accent: 'text-blue-600' },
  { icon: <MapPin className="h-5 w-5" />,         title: 'Service Area',      value: 'Delhi NCR Region',      href: null,                                         color: 'bg-purple-100 text-purple-600',hoverBg: '',                accent: 'text-purple-600' },
  { icon: <Clock className="h-5 w-5" />,          title: 'Operating Hours',   value: '24 Hours / 7 Days',     href: null,                                         color: 'bg-orange-100 text-orange-600',hoverBg: '',               accent: 'text-orange-600' },
];

const Contact = () => {
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .send('service_g9py3bj', 'template_spciyj7', {
        from_name: form.name,
        phone:     form.phone,
        message:   form.message,
      }, 'PAY-sNimUuJj2QHA2')
      .then(() => {
        setLoading(false);
        showToast('Message sent successfully! We\'ll respond shortly. 🎉', 'success');
        setTimeout(() => navigate('/thank-you'), 1500);
      })
      .catch(() => {
        setLoading(false);
        showToast('Failed to send message. Please call us directly.', 'error');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30">
      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero */}
      <section className="gradient-hero text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-20 w-72 h-72 bg-red-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4">Contact <span className="text-gradient-emergency">Us</span></h1>
          <p className="text-gray-300 text-xl">We're here to help 24/7. Reach out anytime.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" className="w-full" preserveAspectRatio="none">
            <path d="M0,50L1440,0L1440,50Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
              <p className="text-gray-500">Multiple ways to reach our emergency team</p>
            </div>

            <div className="space-y-4">
              {contactInfo.map(({ icon, title, value, href, color, accent, external }) => (
                <div key={title} className="card-premium p-5 flex items-center gap-4 group">
                  <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
                    {href ? (
                      <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className={`font-bold ${accent} hover:underline text-base`}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className={`font-bold ${accent} text-base`}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Service area mini map */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Area Map</p>
              <FreeMap lat={28.6139} lng={77.2090} interactive={false} />
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-premium rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Send className="h-5 w-5 text-red-600" /> Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="input-premium"
                />
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="Your contact number"
                  className="input-premium"
                />
              </div>
              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you? (Non-emergency queries only — for emergencies please call directly)"
                  className="input-premium resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-emergency py-4 justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Sending...</span></>
                ) : (
                  <><Send className="h-5 w-5" /><span>Send Message</span></>
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                ⚠️ For emergencies, please <a href={`tel:${EMERGENCY_PHONE}`} className="text-red-600 font-bold">call directly</a> — don't use this form.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
