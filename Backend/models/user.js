// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getNextSequenceValue } from './Counter.js';

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true,
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
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  
  // Enhanced profile for hybrid platform
  profile: {
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    location: {
      city: {
        type: String,
        default: ''
      },
      postcode: {
        type: String,
        default: ''
      }
    },
    preferences: {
      teachingMode: {
        type: String,
        enum: ['online', 'face-to-face', 'both'],
        default: 'both'
      },
      notification: {
        type: Boolean,
        default: true
      }
    }
  },
  
  enrolledCourses: [{
    courseId: Number,
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    preferredMode: {
      type: String,
      enum: ['online', 'face-to-face'],
      default: 'online'
    },
    progress: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-increment userId
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      this.userId = await getNextSequenceValue('userId');
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
