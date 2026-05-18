const Booking = require('../models/Booking');
const { generateWhatsAppUrl } = require('../utils/whatsappService');
const { sendApprovalEmail } = require('../utils/emailService');

// ===============================
// CREATE BOOKING
// ===============================
exports.createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);

    const whatsappUrl = generateWhatsAppUrl(booking);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
      whatsappUrl
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// GET ALL BOOKINGS (ADMIN)
// ===============================
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// GET BOOKING BY ID
// ===============================
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// UPDATE BOOKING STATUS (ADMIN APPROVE)
// ===============================
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const status = req.body.status.toUpperCase(); // FORCE FORMAT

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // ✅ SEND EMAIL ONLY WHEN APPROVED
    if (status === 'APPROVED') {
      await sendApprovalEmail(booking);
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
