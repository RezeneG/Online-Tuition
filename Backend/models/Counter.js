// backend/models/Course.js
import mongoose from 'mongoose';
import { getNextSequenceValue } from './Counter.js';

const courseSchema = new mongoose.Schema({
  courseId: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['web-dev', 'programming', 'data-science', 'mobile-dev', 'cybersecurity', 'digital-literacy', 'math', 'science', 'languages', 'business', 'creative-arts']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  
  // Teaching Mode - NEW FIELD
  teachingMode: {
    type: String,
    required: true,
    enum: ['online', 'face-to-face', 'hybrid'],
    default: 'online'
  },
  
  // Location for Face-to-Face - NEW FIELDS
  location: {
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    postcode: {
      type: String,
      default: ''
    }
  },
  
  // Schedule for Face-to-Face - NEW FIELD
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String,
    endTime: String,
    frequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly'],
      default: 'weekly'
    }
  }],
  
  // Online Platform - NEW FIELD
  onlinePlatform: {
    type: String,
    enum: ['zoom', 'teams', 'google-meet', 'skype', 'custom', ''],
    default: ''
  },
  
  // Class capacity for face-to-face - NEW FIELD
  maxStudents: {
    type: Number,
    default: 20
  },
  currentEnrollment: {
    type: Number,
    default: 0
  },
  
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: 'Self-paced'
  },
  instructor: {
    type: String,
    default: 'Online Tuition Team'
  },
  instructorId: {
    type: Number,
    default: 1
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  studentsEnrolled: {
    type: Number,
    default: 0
  },
  
  // Additional fields for enhanced functionality
  learningObjectives: [{
    type: String
  }],
  requirements: [{
    type: String
  }],
  
  badge: {
    type: String,
    enum: ['Bestseller', 'New', 'Trending', 'Popular', ''],
    default: ''
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-increment courseId before saving
courseSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      this.courseId = await getNextSequenceValue('courseId');
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Virtual for available spots
courseSchema.virtual('availableSpots').get(function() {
  if (this.teachingMode === 'online') {
    return 'Unlimited';
  }
  return Math.max(0, this.maxStudents - this.currentEnrollment);
});

// Method to check if class is full
courseSchema.methods.isFull = function() {
  if (this.teachingMode === 'online') {
    return false;
  }
  return this.currentEnrollment >= this.maxStudents;
};

// Index for location-based searches
courseSchema.index({ 'location.city': 1 });
courseSchema.index({ teachingMode: 1 });
courseSchema.index({ category: 1, teachingMode: 1 });

export default mongoose.model('Course', courseSchema);
