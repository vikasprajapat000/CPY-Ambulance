const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['USER', 'DRIVER', 'ADMIN'],
    default: 'USER',
  },
  isApproved: {
    type: Boolean,
    default: function() {
      // Users and Admins are approved by default. Drivers need manual admin approval.
      return this.role !== 'DRIVER';
    }
  }
}, { timestamps: true });

// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// For testing purposes, let's create a MockUserModel to fallback if DB is not connected
const MockUserModel = {
  create: async (data) => {
    return { ...data, _id: 'mock-id-' + Date.now(), isApproved: data.role !== 'DRIVER' };
  },
  findOne: async (query) => {
    // Just a dummy return for mock
    return null;
  },
  find: async (query) => {
    return [];
  },
  findByIdAndUpdate: async (id, update) => {
    return { _id: id, ...update };
  }
};

const MongooseUser = mongoose.model('User', userSchema);

// Check if mongoose is connected
const getIsConnected = () => mongoose.connection.readyState === 1;

const UserProxy = new Proxy({}, {
  get(target, prop) {
    if (getIsConnected()) {
      const value = MongooseUser[prop];
      return typeof value === 'function' ? value.bind(MongooseUser) : value;
    } else {
      const value = MockUserModel[prop];
      return typeof value === 'function' ? value.bind(MockUserModel) : value;
    }
  }
});

module.exports = UserProxy;
