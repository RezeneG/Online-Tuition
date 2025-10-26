// backend/models/Enrollment.js
import mongoose from 'mongoose';
import { getNextSequenceValue } from './Counter.js';

const enrollmentSchema = new mongoose.Schema({
  enrollmentId: {
    type: Number,
    unique: true
  },
  courseId: {
    type: Number,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  
  // Enhanced enrollment details for hybrid model
  preferredMode: {
    type: String,
    enum: ['online', 'face-to-face'],
    required: true,
    default: 'online'
  },
  
  // For face-to-face attendance tracking
  attendance: [{
    sessionDate: Date,
    present: {
      type: Boolean,
      default: false
    },
    notes: String,
    sessionType: {
      type: String,
      enum: ['online', 'in-person'],
      default: 'in-person'
    }
  }],
  
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'transferred', 'waitlisted'],
    default: 'active'
  },
  
  // Payment details specific to mode
  finalPrice: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'card'
  },
  
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  certificateIssued: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-increment enrollmentId
enrollmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      this.enrollmentId = await getNextSequenceValue('enrollmentId');
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ courseId: 1, userId: 1 }, { unique: true });

// Method to mark attendance
enrollmentSchema.methods.markAttendance = function(sessionDate, present = true, notes = '', sessionType = 'in-person') {
  this.attendance.push({
    sessionDate,
    present,
    notes,
    sessionType
  });
};

// Method to calculate attendance percentage
enrollmentSchema.methods.getAttendancePercentage = function() {
  if (this.attendance.length === 0) return 0;
  
  const presentSessions = this.attendance.filter(session => session.present).length;
  return (presentSessions / this.attendance.length) * 100;
};

export default mongoose.model('Enrollment', enrollmentSchema);
