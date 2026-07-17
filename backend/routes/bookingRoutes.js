const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookingStats,
  getPendingBookings,
  acceptBooking,
  getBookingByBookingId,
  getBookingsByPhone,
  getAllBookings,
  getBookingById,
  updateBookingStatus
} = require('../controllers/bookingController');
const validateBooking = require('../middleware/validateBooking');
const { protect, driver } = require('../middleware/authMiddleware');

// Create booking (validated)
router.post('/create', validateBooking, createBooking);

// Get stats summary (must be before :id routes to avoid collision)
router.get('/stats/summary', getBookingStats);

// Get bookings pending (Driver)
router.get('/pending', protect, driver, getPendingBookings);

// Accept booking (Driver)
router.put('/:id/accept', protect, driver, acceptBooking);

// Get booking by custom bookingId (must be before :id routes)
router.get('/booking/:bookingId', getBookingByBookingId);

// Get bookings by phone (must be before :id routes)
router.get('/phone/:phone', getBookingsByPhone);

// Get all bookings (Admin)
router.get('/', getAllBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Update booking status (Approve)
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
