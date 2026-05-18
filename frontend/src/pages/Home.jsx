import { Link } from 'react-router-dom';
import { Phone, Clock, Shield, Users, Ambulance, Heart, MessageCircle } from 'lucide-react';
import { EMERGENCY_PHONE, WHATSAPP_NUMBER } from '../utils/constants';
import EmergencyCallButton from '../components/EmergencyCallButton';

const Home = () => {
  const features = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Availability',
      description: 'Round-the-clock emergency medical service at your doorstep'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Advanced Life Support',
      description: 'Equipped with latest medical equipment and trained paramedics'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Trained Staff',
      description: 'Professional medical team with years of emergency experience'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Quick Response',
      description: 'Average arrival time of 15-30 minutes in emergency situations'
    }
  ];

  return (
    <div>
      {/* ✅ HERO SECTION (FIXED: padding-top added) */}
      <section className="pt-16 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                🚨 Available 24/7
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Fast & Reliable
                <br />
                <span className="text-red-200">Emergency Ambulance</span>
                <br />
                Service
              </h1>

              <p className="text-xl text-red-100 mb-8 leading-relaxed">
                Professional ambulance service across Delhi NCR. Equipped with trained staff,
                GPS tracking, and advanced life support. We reach you in 15-20 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${EMERGENCY_PHONE}`}
                  className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-50 transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Now - Emergency</span>
                </a>

                <Link
                  to="/booking"
                  className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-400 transition-all flex items-center justify-center space-x-2"
                >
                  <Ambulance className="h-5 w-5" />
                  <span>Book Ambulance Online</span>
                </Link>
              </div>

              <div className="mt-8 flex items-center space-x-4 text-red-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live Support Available</span>
                </div>
              </div>
            </div>

            {/* Right Info Card */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-red-200">Emergency Hotline</p>
                      <p className="text-xl font-bold">{EMERGENCY_PHONE}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-green-500 p-3 rounded-lg">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-red-200">WhatsApp Support</p>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-bold hover:text-green-400"
                      >
                        Click to Chat
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-red-200">Average Arrival</p>
                      <p className="text-xl font-bold">15-30 Minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CPY Ambulance?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive emergency medical services with trained staff and modern equipment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="bg-red-100 text-red-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
