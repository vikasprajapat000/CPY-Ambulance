import { useState, useEffect, useRef } from 'react';
import { Shield, Clock, Users, Award, Heart, Ambulance, CheckCircle, Star } from 'lucide-react';

const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let n = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      n += step;
      if (n >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(n));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration, start]);
  return count;
};

const values = [
  { icon: <Clock className="h-7 w-7" />,    title: '24/7 Availability',      desc: 'Round-the-clock emergency medical services without any holidays or breaks', color: 'from-blue-500 to-blue-600' },
  { icon: <Shield className="h-7 w-7" />,   title: 'Advanced Equipment',      desc: 'State-of-the-art medical equipment and life support systems in every ambulance', color: 'from-purple-500 to-purple-600' },
  { icon: <Users className="h-7 w-7" />,    title: 'Trained Professionals',   desc: 'Certified paramedics and EMTs with years of emergency medical experience', color: 'from-green-500 to-green-600' },
  { icon: <Award className="h-7 w-7" />,    title: 'Quality Service',         desc: 'Commitment to providing the highest standard of emergency medical care', color: 'from-orange-500 to-orange-600' },
];

const services = [
  { icon: <Ambulance className="h-8 w-8" />, title: 'Emergency Transport', desc: '24/7 emergency ambulance service with ALS equipment and trained crew', color: 'bg-red-100 text-red-600' },
  { icon: <Heart className="h-8 w-8" />,     title: 'ICU Ambulance',       desc: 'Mobile ICU units for critical patients requiring intensive care during transport', color: 'bg-blue-100 text-blue-600' },
  { icon: <Shield className="h-8 w-8" />,    title: 'Event Medical Support', desc: 'On-site medical support and standby ambulance services for events', color: 'bg-green-100 text-green-600' },
];

const timeline = [
  { year: '2015', title: 'Founded', desc: 'CPY Ambulance was established with 5 ambulances and a mission to save lives across Delhi' },
  { year: '2017', title: 'Expanded Fleet', desc: 'Grew to 20+ ambulances and launched the first mobile app for online booking' },
  { year: '2019', title: 'ICU Units Added', desc: 'Introduced mobile ICU ambulances to handle critical care during transport' },
  { year: '2022', title: 'GPS Tracking', desc: 'Launched real-time GPS tracking for all ambulances, improving response times by 35%' },
  { year: '2024', title: 'Digital Platform', desc: 'Launched full online booking system and 24/7 WhatsApp support' },
  { year: '2025', title: '5000+ Lives Saved', desc: 'Reached a milestone of saving over 5000 lives across Delhi NCR region' },
];

const About = () => {
  const [visible, setVisible] = useState(false);
  const statsRef = useRef(null);

  const lives      = useCounter(5000, 2000, visible);
  const ambCount   = useCounter(50,   1500, visible);
  const staffCount = useCounter(100,  1800, visible);
  const yearsCount = useCounter(10,   1000, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="gradient-hero text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-red-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-500/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 text-red-200">
            🏥 Our Story
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            About <span className="text-gradient-emergency">CPY Ambulance</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Dedicated to saving lives through fast, reliable, and professional emergency medical services across Delhi NCR since 2015.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
            <path d="M0,60L1440,0L1440,60Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-divider mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-5 leading-relaxed">
                CPY Ambulance is committed to providing rapid, reliable, and professional emergency medical services to communities across Delhi NCR. We understand that every second counts in an emergency, which is why we maintain a fleet of fully-equipped ambulances staffed by trained medical professionals.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our goal is to bridge the gap between medical emergencies and hospital care, ensuring that patients receive immediate medical attention while being transported safely to the nearest appropriate medical facility.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {['ISO Certified', 'NABH Compliant', 'Govt. Registered'].map(b => (
                  <div key={b} className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full text-sm font-semibold text-green-700">
                    <CheckCircle className="h-4 w-4" /> {b}
                  </div>
                ))}
              </div>
            </div>
            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 gap-5">
              {[
                { val: lives,      suf: '+', label: 'Lives Saved',      icon: '❤️', color: 'from-red-500 to-red-600' },
                { val: ambCount,   suf: '+', label: 'Ambulances',       icon: '🚑', color: 'from-blue-500 to-blue-600' },
                { val: staffCount, suf: '+', label: 'Medical Staff',    icon: '👨‍⚕️', color: 'from-green-500 to-green-600' },
                { val: yearsCount, suf: '+', label: 'Years of Service', icon: '⭐', color: 'from-orange-500 to-orange-600' },
              ].map(({ val, suf, label, icon, color }) => (
                <div key={label} className={`bg-gradient-to-br ${color} text-white rounded-3xl p-7 text-center shadow-xl`}>
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-4xl font-extrabold">{val.toLocaleString()}{suf}</div>
                  <div className="text-sm font-medium mt-1 opacity-90">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-divider mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="card-premium p-7 group">
                <div className={`bg-gradient-to-br ${v.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-divider mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
          </div>
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-200 via-red-400 to-red-200" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-6`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="card-premium inline-block rounded-2xl p-5 max-w-xs">
                      <div className="text-red-600 font-bold text-sm">{item.year}</div>
                      <div className="font-bold text-gray-900">{item.title}</div>
                      <div className="text-gray-500 text-sm mt-1">{item.desc}</div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xl z-10 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-divider mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={i} className="card-premium p-8 text-center group">
                <div className={`${s.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;