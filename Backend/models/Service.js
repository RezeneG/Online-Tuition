// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  providerId: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['web-development', 'it-support', 'software-testing', 'game-development', 'mobile-development', 'cybersecurity']
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['fixed-price', 'hourly', 'project-based', 'consultation']
  },
  pricing: {
    model: {
      type: String,
      required: true,
      enum: ['fixed', 'hourly', 'quote']
    },
    amount: Number,
    rate: Number,
    currency: {
      type: String,
      default: 'GBP'
    },
    minHours: Number
  },
  deliveryTime: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/images/service-default.jpg'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  features: [String],
  status: {
    type: String,
    enum: ['available', 'unavailable', 'coming-soon'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Service', serviceSchema);
