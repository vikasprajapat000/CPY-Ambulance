const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Use default local MongoDB if no env variable set
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cpy-ambulance';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Connected:', uri.includes('atlas') ? 'MongoDB Atlas' : 'Local MongoDB (127.0.0.1:27017)');
    isConnected = true;
    return true;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.warn('⚠️  Running in IN-MEMORY MOCK mode (data lost on restart)');
    console.warn('💡  To use real DB: install MongoDB locally or set MONGODB_URI in backend/.env');
    isConnected = false;
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
