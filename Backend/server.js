// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

console.log('🎯 Starting Online Tuition Backend Server...');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Immediate test route (before DB connection)
app.get('/test', (req, res) => {
  res.json({ 
    message: '✅ Online Tuition Backend is responding!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'
  });
});

// Connect to Database
const connectDB = async () => {
  try {
    console.log('📡 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online-tuition', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

// Import routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Online Tuition Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Online Tuition Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      payments: '/api/payments',
      health: '/api/health',
      test: '/test'
    }
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Online Tuition API',
    documentation: 'Visit /api for available endpoints'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    console.log('🔄 Initializing server...');
    
    // Connect to database (but don't block server start)
    connectDB().then(() => {
      console.log('✅ Database connection established');
    }).catch(err => {
      console.log('⚠️ Database connection failed, but server will continue');
    });

    const server = app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 ONLINE TUITION BACKEND SERVER STARTED!');
      console.log('='.repeat(60));
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🕐 Started: ${new Date().toLocaleString()}`);
      console.log('');
      console.log('🔗 Test URLs:');
      console.log(`   http://localhost:${PORT}/`);
      console.log(`   http://localhost:${PORT}/test`);
      console.log(`   http://localhost:${PORT}/api/health`);
      console.log('='.repeat(60) + '\n');
    });

    return server;
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
