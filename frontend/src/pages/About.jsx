import { Shield, Clock, Users, Award, Heart, Ambulance } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Availability',
      description: 'Round-the-clock emergency medical services without any holidays or breaks'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Advanced Equipment',
      description: 'State-of-the-art medical equipment and life support systems in every ambulance'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Trained Professionals',
      description: 'Certified paramedics and EMTs with years of emergency medical experience'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Quality Service',
      description: 'Commitment to providing the highest standard of emergency medical care'
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About CPY Ambulance</h1>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            Dedicated to saving lives through fast, reliable, and professional emergency medical services
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                CPY Ambulance is committed to providing rapid, reliable, and professional emergency 
                medical services to communities across Delhi NCR. We understand that every second 
                counts in an emergency, which is why we maintain a fleet of fully-equipped ambulances 
                staffed by trained medical professionals.
              </p>
              <p className="text-lg text-gray-700">
                Our goal is to bridge the gap between medical emergencies and hospital care, ensuring 
                that patients receive immediate medical attention while being transported safely to 
                the nearest appropriate medical facility.
              </p>
            </div>
            <div className="bg-red-50 p-8 rounded-xl">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-16 w-16 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Saving Lives Since 2015
              </h3>
              <div className="space-y-3 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-600">5000+</div>
                  <div className="text-gray-600">Lives Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">50+</div>
                  <div className="text-gray-600">Ambulances</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">100+</div>
                  <div className="text-gray-600">Medical Staff</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="bg-red-100 text-red-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ambulance className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Transport</h3>
              <p className="text-gray-600">
                24/7 emergency ambulance service with advanced life support equipment
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ICU Ambulance</h3>
              <p className="text-gray-600">
                Mobile ICU units for critical patients requiring intensive care during transport
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Event Medical Support</h3>
              <p className="text-gray-600">
                On-site medical support and ambulance services for events and gatherings
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;