const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('\n⚠️  No MONGODB_URI found. Running in IN-MEMORY MOCK DATABASE mode.');
    isConnected = false;
    return false;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('\n✅ MongoDB Connected Successfully');
    isConnected = true;
    return true;
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed:', error.message);
    console.log('⚠️  Falling back to IN-MEMORY MOCK DATABASE mode.');
    isConnected = false;
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };

