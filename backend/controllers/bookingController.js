const Booking = require('../models/Booking');
const { generateWhatsAppUrl } = require('../utils/whatsappService');
const { sendApprovalEmail } = require('../utils/emailService');
const { calculateDistanceInMeters } = require('../utils/geoUtils');

// ===============================
// CREATE BOOKING
// ===============================
exports.createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);

    const whatsappUrl = generateWhatsAppUrl(booking);

    // ── Proximity Alert Broadcast (100m Radius) ──
    const activeUsers = req.app.get('activeUsers');
    const io = req.app.get('io');
    
    if (activeUsers && io && booking.latitude && booking.longitude) {
      Object.entries(activeUsers).forEach(([socketId, coords]) => {
        const distance = calculateDistanceInMeters(
          booking.latitude, booking.longitude,
          coords.lat, coords.lng
        );
        
        if (distance <= 100) {
          // Send private alert to this user
          io.to(socketId).emit('nearby-emergency', {
            bookingId: booking.bookingId,
            dbId: booking._id,
            distance: Math.round(distance),
            emergencyType: booking.emergencyType,
            address: booking.address
          });
          console.log(`[Proximity Alert] Sent to ${socketId} - Distance: ${Math.round(distance)}m`);
        }
      });
    }

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
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // ✅ SEND EMAIL ONLY WHEN APPROVED
    if (status === 'APPROVED') {
      await sendApprovalEmail(booking);
    }

    // ✅ EMIT REAL-TIME STATUS UPDATE VIA SOCKET.IO
    const io = req.app && req.app.get ? req.app.get('io') : null;
    if (io) {
      io.to(`booking-${booking._id}`).emit('status-update', {
        bookingId: booking._id,
        status:    booking.status,
        updatedAt: new Date().toISOString(),
      });
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

// ===============================
// GET BOOKING BY CUSTOM BOOKING ID
// ===============================
exports.getBookingByBookingId = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });

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
// GET BOOKINGS BY PHONE
// ===============================
exports.getBookingsByPhone = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ phone: req.params.phone });

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
// GET BOOKING STATS (SUMMARY)
// ===============================
exports.getBookingStats = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    const list = Array.isArray(bookings) ? bookings : await Booking.find().sort({ createdAt: -1 });

    const stats = list.reduce(
      (acc, curr) => {
        const status = curr.status ? curr.status.toUpperCase() : 'PENDING';
        acc.total += 1;
        if (status === 'PENDING') acc.pending += 1;
        else if (status === 'APPROVED') acc.approved += 1;
        else if (status === 'DISPATCHED') acc.dispatched += 1;
        else if (status === 'COMPLETED') acc.completed += 1;
        else if (status === 'CANCELLED') acc.cancelled += 1;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, dispatched: 0, completed: 0, cancelled: 0 }
    );

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// GET PENDING BOOKINGS FOR DRIVERS
// ===============================
exports.getPendingBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ status: 'PENDING' }).sort({ createdAt: -1 });
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
// DRIVER ACCEPTS BOOKING
// ===============================
exports.acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Booking is no longer pending' });
    }

    booking.status = 'DISPATCHED';
    booking.driverId = req.user._id;
    await booking.save();

    // Alert users nearby that ambulance is dispatched
    const io = req.app.get('socketio');
    if (io) {
      io.to(`booking-${booking.bookingId}`).emit('status-update', { status: 'DISPATCHED' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking accepted successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
