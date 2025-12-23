import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import Contact from './pages/Contact';
import About from './pages/About';
import ThankYou from './pages/Thankyou';
import AdminDashboard from './pages/AdminDashboard';
import BookingApproved from './pages/BookingApproved';
import AmbulanceTracking from './pages/AmbulanceTracking';



function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/confirmation/:id" element={<BookingConfirmation />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/thank-you" element={<ThankYou />} />

            {/* ✅ ADMIN ROUTE ADDED */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/booking/approved/:id" element={<BookingApproved />} />
            <Route path="/tracking/:id" element={<AmbulanceTracking />} />


          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
