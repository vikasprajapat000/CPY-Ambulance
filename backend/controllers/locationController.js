// In-memory ambulance location store
// { [bookingId]: { lat, lng, speed, updatedAt } }
const locationStore = {};

// ── Update ambulance location (called by ambulance device/driver) ──
exports.updateLocation = (req, res) => {
  const { bookingId, lat, lng, speed = 0 } = req.body;

  if (!bookingId || lat === undefined || lng === undefined) {
    return res.status(400).json({ success: false, message: 'bookingId, lat, and lng are required' });
  }

  locationStore[bookingId] = { lat, lng, speed, updatedAt: new Date() };

  // Emit via socket.io to all clients watching this booking
  const io = req.app.get('io');
  if (io) {
    io.to(`booking-${bookingId}`).emit('location-update', {
      bookingId, lat, lng, speed,
      updatedAt: new Date().toISOString(),
    });
  }

  res.json({ success: true, message: 'Location updated' });
};

// ── Get current ambulance location for a booking ──
exports.getLocation = (req, res) => {
  const { bookingId } = req.params;
  const loc = locationStore[bookingId];

  if (!loc) {
    // Return a demo location if no real location tracked yet
    return res.json({
      success: true,
      data: {
        bookingId,
        lat:       28.6200,
        lng:       77.2150,
        speed:     0,
        updatedAt: new Date().toISOString(),
        isDemo:    true,
      },
    });
  }

  res.json({ success: true, data: { bookingId, ...loc } });
};
