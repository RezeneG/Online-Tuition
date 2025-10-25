// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

console.log('🔧 Starting Online-Tuition Backend Server...');
console.log('📁 Current directory:', process.cwd());

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import models (this ensures they're registered with mongoose)
import './models/Counter.js';
import './models/User.js';
import './models/Course.js';
import './models/Enrollment.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Initialize counters after DB connection is established
const initializeCounters = async () => {
  try {
    console.log('📊 Initializing counters...');
    const Counter = mongoose.model('Counter');
    const counters = ['courseId', 'userId', 'enrollmentId'];
    
    for (const counter of counters) {
      const exists = await Counter.findById(counter);
      if (!exists) {
        await Counter.create({ _id: counter, sequence_value: 0 });
        console.log(`✅ Counter initialized: ${counter}`);
      }
    }
    console.log('🎯 All counters initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing counters:', error.message);
  }
};

// Connect to Database first, then setup routes
const setupServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Wait for connection to be established
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('open', resolve);
      });
    }

    // Initialize counters
    await initializeCounters();

    // Setup routes after DB is connected
    app.use('/api/auth', authRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/payments', paymentRoutes);

    console.log('✅ All routes initialized successfully');

  } catch (error) {
    console.error('💥 Server setup failed:', error);
    process.exit(1);
  }
};

// Basic test route (available before DB connection)
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Online-Tailicon API Server is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  });
});

// API info route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Online-Tailicon Backend API',
    version: '1.0.0',
    status: 'Operational',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      payments: '/api/payments',
      health: '/api/health'
    },
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /',
      'GET /api',
      'GET /api/health',
      'GET /api/courses',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/courses/seed'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global Error Handler:', err.message);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate field value: ${field}. Please use another value.`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired. Please log in again.'
    });
  }
  
  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await setupServer();
    
    const server = app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 ONLINE-TUITION BACKEND SERVER STARTED SUCCESSFULLY!');
      console.log('='.repeat(60));
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
      console.log(`🕐 Started: ${new Date().toLocaleString()}`);
      console.log('');
      console.log('🔗 Available Endpoints:');
      console.log(`   http://localhost:${PORT}/`);
      console.log(`   http://localhost:${PORT}/api`);
      console.log(`   http://localhost:${PORT}/api/health`);
      console.log(`   http://localhost:${PORT}/api/courses`);
      console.log(`   http://localhost:${PORT}/api/auth/register`);
      console.log(`   http://localhost:${PORT}/api/auth/login`);
      console.log('='.repeat(60));
      console.log('💡 Tip: Run POST /api/courses/seed to add sample courses');
      console.log('='.repeat(60) + '\n');
    });

    return server;
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
const server = startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  const s = await server;
  s.close(() => {
    console.log('💤 HTTP server closed.');
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  const s = await server;
  s.close(() => {
    console.log('💤 HTTP server closed.');
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  });
});

export default app;
