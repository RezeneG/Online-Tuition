// backend/models/Admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getNextSequenceValue } from './Counter.js';

const adminSchema = new mongoose.Schema({
  adminId: {
    type: Number,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  permissions: {
    manageUsers: { type: Boolean, default: true },
    manageCourses: { type: Boolean, default: true },
    managePayments: { type: Boolean, default: true },
    manageContent: { type: Boolean, default: true },
    viewAnalytics: { type: Boolean, default: true }
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    phone: String
  },
  lastLogin: Date,
  loginHistory: [{
    timestamp: Date,
    ipAddress: String,
    userAgent: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-increment adminId
adminSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      this.adminId = await getNextSequenceValue('adminId');
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
adminSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to log login activity
adminSchema.methods.logLogin = function(ipAddress, userAgent) {
  this.lastLogin = new Date();
  this.loginHistory.push({
    timestamp: new Date(),
    ipAddress,
    userAgent
  });
  
  // Keep only last 10 login records
  if (this.loginHistory.length > 10) {
    this.loginHistory = this.loginHistory.slice(-10);
  }
};

export default mongoose.model('Admin', adminSchema);
