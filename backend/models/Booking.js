const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: String,
    patientName: String,
    phone: String,
    emergencyType: String,
    address: String,
    latitude: Number,
    longitude: Number,
    additionalInfo: String,

    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'DISPATCHED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

// ✅ Auto-generate a beautiful human-readable booking ID before saving in mongoose
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.bookingId = `AMB-${randomNum}`;
  }
  next();
});

const MongooseBooking = mongoose.model('Booking', bookingSchema);

// ==========================================
// 🚨 IN-MEMORY STORAGE & CRUD FOR MOCK MODE
// ==========================================
const mockBookings = [];

class MockBookingModel {
  static async create(data) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const id = 'mock_' + Math.random().toString(36).substring(2, 11);
    const now = new Date();
    
    const newBooking = {
      _id: id,
      bookingId: data.bookingId || `AMB-${randomNum}`,
      patientName: data.patientName,
      phone: data.phone,
      emergencyType: data.emergencyType,
      address: data.address,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      additionalInfo: data.additionalInfo || '',
      status: data.status || 'PENDING',
      createdAt: now,
      updatedAt: now
    };
    
    mockBookings.push(newBooking);
    console.log(`[Mock DB] Created booking: ${newBooking.bookingId}`);
    return newBooking;
  }

  static find(query = {}) {
    // Basic filtering support for queries like { phone }
    let list = [...mockBookings];
    if (query && typeof query === 'object') {
      const keys = Object.keys(query);
      if (keys.length > 0) {
        list = list.filter(item => {
          return keys.every(key => String(item[key]) === String(query[key]));
        });
      }
    }

    // Return chainable object mimicking Mongoose query builder (specifically sort)
    return {
      sort: (sortOption) => {
        list.sort((a, b) => b.createdAt - a.createdAt);
        return list;
      },
      // If used as promise directly
      then: (resolve) => resolve(list),
      catch: (reject) => {}
    };
  }

  static async findById(id) {
    const booking = mockBookings.find(b => b._id === id || b.bookingId === id);
    console.log(`[Mock DB] findById(${id}) -> ${booking ? booking.bookingId : 'Not Found'}`);
    return booking;
  }

  static async findOne(query) {
    let booking = null;
    if (query.bookingId) {
      booking = mockBookings.find(b => b.bookingId === query.bookingId);
    } else if (query.phone) {
      booking = mockBookings.find(b => b.phone === query.phone);
    } else {
      const keys = Object.keys(query);
      booking = mockBookings.find(b => {
        return keys.every(key => String(b[key]) === String(query[key]));
      });
    }
    console.log(`[Mock DB] findOne(${JSON.stringify(query)}) -> ${booking ? booking.bookingId : 'Not Found'}`);
    return booking;
  }

  static async findByIdAndUpdate(id, update, options) {
    const booking = mockBookings.find(b => b._id === id || b.bookingId === id);
    if (!booking) {
      console.log(`[Mock DB] findByIdAndUpdate(${id}) -> Not Found`);
      return null;
    }
    
    if (update && typeof update === 'object') {
      // If we are passing standard mongoose updates like { status }
      Object.keys(update).forEach(key => {
        if (key === 'status') {
          booking.status = update.status.toUpperCase();
        } else {
          booking[key] = update[key];
        }
      });
    }
    booking.updatedAt = new Date();
    console.log(`[Mock DB] findByIdAndUpdate(${id}) -> Updated Status to ${booking.status}`);
    return booking;
  }
}

// Proxy wrapper to dynamically route calls to either Mongoose or Mock Model
const BookingProxy = new Proxy({}, {
  get(target, prop) {
    if (getIsConnected()) {
      return MongooseBooking[prop];
    } else {
      return MockBookingModel[prop];
    }
  }
});

module.exports = BookingProxy;

