const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model('Booking', bookingSchema);
