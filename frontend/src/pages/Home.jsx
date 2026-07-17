import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Clock, Shield, Users, Heart, Ambulance, MessageCircle, ChevronRight, Star, MapPin, Zap, CheckCircle } from 'lucide-react';
import { EMERGENCY_PHONE, WHATSAPP_NUMBER } from '../utils/constants';

/* ── Animated Counter Hook ── */
const useCounter = (target, duration = 2000, startTrigger = true) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startTrigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, startTrigger]);
  return count;
};

const features = [
  { icon: <Clock className="h-7 w-7" />, title: '24/7 Availability', desc: 'Round-the-clock emergency medical service at your doorstep', color: 'from-blue-500 to-blue-600' },
  { icon: <Shield className="h-7 w-7" />, title: 'Advanced Life Support', desc: 'Equipped with latest medical equipment and trained paramedics', color: 'from-purple-500 to-purple-600' },
  { icon: <Users className="h-7 w-7" />, title: 'Trained Staff', desc: 'Professional medical team with years of emergency experience', color: 'from-green-500 to-green-600' },
  { icon: <Zap className="h-7 w-7" />, title: 'Quick Response', desc: 'Average arrival time of 15-20 minutes in emergency situations', color: 'from-orange-500 to-orange-600' },
];

const steps = [
  { num: '01', title: 'Call or Book Online', desc: 'Dial our emergency number or fill the online booking form in 60 seconds', icon: <Phone className="h-6 w-6" /> },
  { num: '02', title: 'Dispatch Confirmed', desc: 'Our dispatcher confirms your booking and assigns the nearest ambulance', icon: <CheckCircle className="h-6 w-6" /> },
  { num: '03', title: 'Ambulance En Route', desc: 'Track live on map as our ambulance heads to your location', icon: <Ambulance className="h-6 w-6" /> },
];

const testimonials = [
  { name: 'Rohit Sharma', loc: 'New Delhi', text: 'Ambulance arrived in 18 minutes. The paramedic team was exceptional and my father was stable by the time we reached hospital.', stars: 5 },
  { name: 'Priya Verma', loc: 'Gurugram', text: 'Booked online during midnight emergency. Super smooth process and the staff was calm and professional. Highly recommend!', stars: 5 },
  { name: 'Amit Singh', loc: 'Noida', text: 'CPY Ambulance saved my wife\'s life during a cardiac event. Response time was incredibly fast. Forever grateful.', stars: 5 },
];

const serviceTypes = ['Heart Attack', 'Stroke', 'Accident', 'Breathing', 'Maternity', 'ICU Transfer', 'Neonatal', 'Burns', 'Poisoning'];

const Home = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const lives      = useCounter(5000, 2000, statsVisible);
  const ambulances = useCounter(50,   1500, statsVisible);
  const staff      = useCounter(100,  1800, statsVisible);
  const years      = useCounter(10,   1000, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-sm font-semibold animate-fade-up">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                🚨 Available 24/7 · Delhi NCR
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight animate-fade-up delay-100">
                Fast &<br />
                <span className="text-gradient-emergency">Reliable</span><br />
                Emergency<br />
                <span className="text-red-300">Ambulance</span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-lg animate-fade-up delay-200">
                Professional ambulance service across Delhi NCR. Equipped with trained staff, GPS tracking, and advanced life support. We reach you in <strong className="text-white">15-20 minutes</strong>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
                <a
                  href={`tel:${EMERGENCY_PHONE}`}
                  id="hero-call-btn"
                  className="btn-emergency text-lg px-8 py-4 emergency-glow"
                >
                  <Phone className="h-5 w-5 animate-bounce-gen" />
                  Call Now — {EMERGENCY_PHONE}
                </a>
                <Link
                  to="/booking"
                  id="hero-book-btn"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-200 group"
                >
                  <Ambulance className="h-5 w-5" />
                  Book Online
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 animate-fade-up delay-400">
                {[
                  { icon: '⚡', label: '15-20 min response' },
                  { icon: '🏥', label: 'ALS equipped' },
                  { icon: '📍', label: 'GPS tracked' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-gray-300 text-sm">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Info Card */}
            <div className="hidden lg:block animate-slide-right delay-200">
              <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
                {/* Live status */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg">Emergency Contact</span>
                  <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs font-semibold">LIVE</span>
                  </div>
                </div>

                {[
                  { icon: <Phone className="h-5 w-5" />, label: 'Emergency Hotline', value: EMERGENCY_PHONE, href: `tel:${EMERGENCY_PHONE}`, bg: 'bg-red-500' },
                  { icon: <MessageCircle className="h-5 w-5" />, label: 'WhatsApp Support', value: 'Click to Chat', href: `https://wa.me/${WHATSAPP_NUMBER}`, bg: 'bg-green-500' },
                  { icon: <Clock className="h-5 w-5" />, label: 'Average Arrival', value: '15-20 Minutes', href: null, bg: 'bg-blue-500' },
                  { icon: <MapPin className="h-5 w-5" />, label: 'Service Area', value: 'Delhi NCR Region', href: null, bg: 'bg-purple-500' },
                ].map(({ icon, label, value, href, bg }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className={`${bg} p-3 rounded-xl text-white flex-shrink-0 shadow-lg`}>{icon}</div>
                    <div>
                      <p className="text-gray-400 text-xs">{label}</p>
                      {href
                        ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-white font-bold text-lg hover:text-red-400 transition-colors">{value}</a>
                        : <p className="text-white font-bold text-lg">{value}</p>
                      }
                    </div>
                  </div>
                ))}

                {/* Book button */}
                <Link to="/booking" className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-3 rounded-xl font-bold hover:from-red-500 hover:to-red-600 transition-all duration-200 shadow-lg">
                  Book Ambulance Now →
                </Link>
              </div>
            </div>
          </div>

          {/* Scrolling service pills */}
          <div className="mt-16 overflow-hidden animate-fade-up delay-500">
            <div className="flex gap-3 flex-wrap">
              {serviceTypes.map((s) => (
                <span key={s} className="px-4 py-1.5 bg-white/10 border border-white/15 text-gray-300 text-sm rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path d="M0,80L48,72C96,64,192,48,288,45.3C384,43,480,53,576,58.7C672,64,768,64,864,58.7C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,80L0,80Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: lives,      suffix: '+', label: 'Lives Saved',        icon: '❤️', color: 'text-red-600' },
              { value: ambulances, suffix: '+', label: 'Ambulances',         icon: '🚑', color: 'text-blue-600' },
              { value: staff,      suffix: '+', label: 'Medical Staff',      icon: '👨‍⚕️', color: 'text-green-600' },
              { value: years,      suffix: '+', label: 'Years of Service',   icon: '⭐', color: 'text-orange-600' },
            ].map(({ value, suffix, label, icon, color }) => (
              <div key={label} className="text-center card-premium p-8">
                <div className="text-4xl mb-3">{icon}</div>
                <div className={`text-4xl md:text-5xl font-extrabold ${color} mb-2`}>
                  {value.toLocaleString()}{suffix}
                </div>
                <div className="text-gray-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-divider mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Get emergency medical help in 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-red-200 via-red-400 to-red-200" />
            {steps.map((step, i) => (
              <div key={i} className="relative card-premium p-8 text-center">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {step.num}
                </div>
                <div className="mt-4 w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-divider mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose CPY Ambulance?</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Comprehensive emergency medical services with trained staff and modern equipment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card-premium p-7 group">
                <div className={`bg-gradient-to-br ${f.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-divider mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lives We've Touched</h2>
            <p className="text-gray-500 text-xl">Real stories from people we've helped</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="card-premium p-7">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-5 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-gray-400 text-sm">{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-20 gradient-emergency relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🚑</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Every Second Counts
          </h2>
          <p className="text-red-100 text-xl mb-10 max-w-2xl mx-auto">
            Don't wait in an emergency. Our team is ready to respond immediately. 
            One call connects you to life-saving help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${EMERGENCY_PHONE}`}
              className="flex items-center justify-center gap-2 bg-white text-red-600 px-10 py-4 rounded-xl font-extrabold text-lg hover:bg-red-50 transition-all shadow-xl"
            >
              <Phone className="h-5 w-5 animate-bounce-gen" />
              {EMERGENCY_PHONE}
            </a>
            <Link
              to="/booking"
              className="flex items-center justify-center gap-2 bg-red-800/50 border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-red-800/70 transition-all"
            >
              <Ambulance className="h-5 w-5" />
              Book Online Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
