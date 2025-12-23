import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { EMERGENCY_PHONE, WHATSAPP_NUMBER } from '../utils/constants';

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        'service_g9py3bj',
        'template_spciyj7',
        {
          from_name: formData.name,
          phone: formData.phone,
          message: formData.message,
        },
        'PAY-sNimUuJj2QHA2'
      )
      .then(() => {
        setLoading(false);
        navigate('/thank-you');
      })
      .catch((error) => {
        setLoading(false);
        alert('❌ Failed to send message. Please try again.');
        console.error('EmailJS Error:', error);
      });
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            We're here to help 24/7. Reach out to us anytime.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">

          {/* Contact Info */}
          <div className="h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

              <div className="space-y-6 flex-grow">
                <Info
                  icon={<Phone className="h-6 w-6 text-red-600" />}
                  title="Emergency Hotline"
                >
                  <a
                    href={`tel:${EMERGENCY_PHONE}`}
                    className="font-bold text-red-600"
                  >
                    {EMERGENCY_PHONE}
                  </a>
                </Info>

                <Info
                  icon={<MessageCircle className="h-6 w-6 text-green-600" />}
                  title="WhatsApp"
                >
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-green-600"
                  >
                    Chat with us on WhatsApp
                  </a>
                </Info>

                <Info
                  icon={<Mail className="h-6 w-6 text-blue-600" />}
                  title="Email"
                >
                  vikas93prajapat@gmail.com
                </Info>

                <Info
                  icon={<MapPin className="h-6 w-6 text-purple-600" />}
                  title="Service Area"
                >
                  Delhi NCR Region
                </Info>

                <Info
                  icon={<Clock className="h-6 w-6 text-yellow-600" />}
                  title="Operating Hours"
                >
                  24 Hours / 7 Days
                </Info>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col h-full space-y-4"
              >
                <div className="flex-grow space-y-4">
                  <Input
                    label="Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />

                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />

                  <Textarea
                    label="Message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* Reusable Components */

const Info = ({ icon, title, children }) => (
  <div className="flex space-x-4 items-start">
    <div className="bg-gray-100 p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-700">{children}</p>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      {...props}
      required
      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <textarea
      {...props}
      required
      rows="5"
      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
    />
  </div>
);

export default Contact;
