const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');

// Create booking
router.post('/create', bookingController.createBooking);

// Get all bookings (Admin)
router.get('/', bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Update booking status (Approve)
router.patch('/:id/status', bookingController.updateBookingStatus);

module.exports = router;
