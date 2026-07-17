const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const http       = require('http');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const bookingRoutes  = require('./routes/bookingRoutes');
const locationRoutes = require('./routes/locationRoutes');
const authRoutes     = require('./routes/authRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const errorHandler   = require('./middleware/errorHandler');

const Booking = require('./models/Booking');
const { calculateDistanceInMeters } = require('./utils/geoUtils');

dotenv.config();

const app    = express();
const server = http.createServer(app);

// ── Socket.io ──
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible from controllers
app.set('io', io);

// Store active users for proximity alerts
const activeUsers = {};
app.set('activeUsers', activeUsers);

// ── Security ──
app.use(helmet({ contentSecurityPolicy: false }));

// ── CORS ──
app.use(cors({
  origin: true,
  credentials: true,
}));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// ── Body parsers ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Morgan HTTP Logging ──
app.use(morgan('dev'));

// ── Connect to MongoDB ──
connectDB();

// ── Health Check ──
app.get('/health', (req, res) => {
  res.status(200).json({
    success:     true,
    message:     'CPY Ambulance API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp:   new Date().toISOString(),
    uptime:      process.uptime().toFixed(1) + 's',
  });
});

// ── Routes ──
app.use('/api/bookings', bookingRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ── Global Error Handler ──
app.use(errorHandler);

// ── Socket.io Events ──
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('join-booking', (bookingId) => {
    socket.join(`booking-${bookingId}`);
    console.log(`[Socket] ${socket.id} joined room: booking-${bookingId}`);
  });

  socket.on('update-user-location', async (coords) => {
    if (coords && coords.lat && coords.lng) {
      activeUsers[socket.id] = { lat: coords.lat, lng: coords.lng };
      
      // Retroactive Emergency Scanner: 
      // Check if there are any active bookings near this user RIGHT NOW
      try {
        const activeBookings = await Booking.find({
          status: { $in: ['PENDING', 'APPROVED', 'DISPATCHED', 'EN_ROUTE', 'ARRIVING'] }
        });

        activeBookings.forEach(booking => {
          if (booking.latitude && booking.longitude) {
            const distance = calculateDistanceInMeters(
              booking.latitude, booking.longitude,
              coords.lat, coords.lng
            );

            if (distance <= 100) {
              // Fire alert directly to this newly connected user
              io.to(socket.id).emit('nearby-emergency', {
                bookingId: booking.bookingId,
                dbId: booking._id,
                distance: Math.round(distance),
                emergencyType: booking.emergencyType,
                address: booking.address
              });
            }
          }
        });
      } catch (err) {
        console.error('[Socket] Error scanning retroactive emergencies:', err);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
    delete activeUsers[socket.id];
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║       🚑 CPY Ambulance Backend           ║
╠══════════════════════════════════════════╣
║  🌐 Port        : ${PORT}                    ║
║  🌱 Environment : ${process.env.NODE_ENV || 'development'}          ║
║  🔒 Helmet      : Active                 ║
║  ⚡ Socket.io   : Active                 ║
║  📊 Rate Limit  : 200 req / 15 min       ║
╚══════════════════════════════════════════╝
  `);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ ERROR: Port ${PORT} is already in use.`);
    console.error(`Please kill the existing process on port ${PORT} and try again.`);
    process.exit(1);
  } else {
    console.error(err);
  }
});
