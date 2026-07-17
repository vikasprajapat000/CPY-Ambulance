import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyBanner from './components/EmergencyBanner';
import Home from './pages/Home';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import Contact from './pages/Contact';
import About from './pages/About';
import ThankYou from './pages/Thankyou';
import AdminDashboard from './pages/AdminDashboard';
import BookingApproved from './pages/BookingApproved';
import AmbulanceTracking from './pages/AmbulanceTracking';
import DriverPortal from './pages/DriverPortal';
import DriverDashboard from './pages/DriverDashboard';
import LocationGate from './components/LocationGate';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Location Gated Public Routes */}
              <Route path="/" element={<LocationGate><Home /></LocationGate>} />
              <Route path="/booking" element={<LocationGate><Booking /></LocationGate>} />
              <Route path="/booking/confirmation/:id" element={<BookingConfirmation />} />
              <Route path="/booking/approved/:id" element={<BookingApproved />} />
              <Route path="/thank-you" element={<ThankYou />} />

              {/* Protected Routes (Admin) */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Routes (Driver) */}
              <Route 
                path="/driver-portal-entry" 
                element={
                  <ProtectedRoute allowedRoles={['DRIVER']}>
                    <LocationGate>
                      <DriverDashboard />
                    </LocationGate>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/driver/:id" 
                element={
                  <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                    <LocationGate><DriverPortal /></LocationGate>
                  </ProtectedRoute>
                } 
              />

              {/* Protected Routes (Tracking) */}
              <Route 
                path="/tracking/:id" 
                element={
                  <LocationGate><AmbulanceTracking /></LocationGate>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <EmergencyBanner />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
