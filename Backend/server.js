// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

console.log('🔧 Starting Online-Tailicon Backend Server...');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
const connectDB = async () => {
  try {
    console.log('📡 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnx', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Import routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// API info route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Online-Tailicon Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      payments: '/api/payments',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Online-Tailicon API',
    documentation: 'Visit /api for available endpoints',
    status: 'Server is running 🚀'
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
      'POST /api/auth/login'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.message);
  console.error(err.stack);
  
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
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

// Initialize counters after DB connection
const initializeCounters = async () => {
  try {
    const Counter = mongoose.model('Counter');
    const counters = ['courseId', 'userId', 'enrollmentId'];
    
    for (const counter of counters) {
      const exists = await Counter.findById(counter);
      if (!exists) {
        await Counter.create({ _id: counter, sequence_value: 0 });
        console.log(`✅ Counter initialized: ${counter}`);
      }
    }
    console.log('📊 All counters initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing counters:', error.message);
  }
};

// Start server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Initialize counters
    mongoose.connection.once('open', async () => {
      await initializeCounters();
    });

    const server = app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 ONLINE-TAILICON BACKEND SERVER STARTED SUCCESSFULLY!');
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

const server = startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.then(s => {
    s.close(() => {
      console.log('💤 Process terminated.');
      mongoose.connection.close();
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  server.then(s => {
    s.close(() => {
      console.log('💤 Process terminated.');
      mongoose.connection.close();
      process.exit(0);
    });
  });
});

export default app;
