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
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
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
    default: 'LearnX Team'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  studentsEnrolled: {
    type: Number,
    default: 0
  },
  isActive: {
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

export default mongoose.model('Course', courseSchema);
