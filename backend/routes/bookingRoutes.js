const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const validateBooking = require('../middleware/validateBooking');

// Create booking (validated)
router.post('/create', validateBooking, bookingController.createBooking);

// Get stats summary (must be before :id routes to avoid collision)
router.get('/stats/summary', bookingController.getBookingStats);

// Get booking by custom bookingId (must be before :id routes)
router.get('/booking/:bookingId', bookingController.getBookingByBookingId);

// Get bookings by phone (must be before :id routes)
router.get('/phone/:phone', bookingController.getBookingsByPhone);

// Get all bookings (Admin)
router.get('/', bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Update booking status (Approve)
router.patch('/:id/status', bookingController.updateBookingStatus);

module.exports = router;
