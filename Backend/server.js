import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

console.log('Starting Online Tuition Backend Server...');

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (if you have any)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sample data (you might want to move this to a database later)
const courses = [
  {
    id: 1,
    title: "Web Development Basics",
    instructor: "John Smith",
    price: 99,
    duration: "8 weeks",
    category: "web-dev",
    level: "beginner",
    rating: 4.7,
    students: 1500,
    status: 'active'
  },
  {
    id: 2,
    title: "Python Programming",
    instructor: "Sarah Johnson", 
    price: 129,
    duration: "6 weeks",
    category: "programming",
    level: "beginner",
    rating: 4.8,
    students: 2000,
    status: 'active'
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    instructor: "Dr. Emily Chen",
    price: 199,
    duration: "10 weeks",
    category: "data-science", 
    level: "intermediate",
    rating: 4.5,
    students: 800,
    status: 'active'
  }
];

const users = [
  {
    id: 1,
    name: 'Test User',
    email: 'user@example.com',
    role: 'student',
    status: 'active',
    joinedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: new Date('2024-01-10').toISOString()
  }
];

// Make data available to routes (in a real app, use a database)
app.locals.courses = courses;
app.locals.users = users;

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Online Tuition Backend API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Public API Routes
app.get('/api/courses', (req, res) => {
  const category = req.query.category;
  const level = req.query.level;
  const search = req.query.search;
  
  let filteredCourses = courses.filter(course => course.status === 'active');
  
  if (category) {
    filteredCourses = filteredCourses.filter(course => course.category === category);
  }
  
  if (level) {
    filteredCourses = filteredCourses.filter(course => course.level === level);
  }
  
  if (search) {
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    courses: filteredCourses,
    total: filteredCourses.length
  });
});

app.get('/api/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = courses.find(c => c.id === courseId && c.status === 'active');
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  res.json({
    success: true,
    course
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email and password'
    });
  }
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    role: 'student',
    status: 'active',
    joinedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  // Find user (in real app, check password hash)
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: 'mock-jwt-token-' + Date.now()
  });
});

app.post('/api/courses/:id/enroll', (req, res) => {
  const courseId = parseInt(req.params.id);
  const { userId, userEmail } = req.body;
  
  const course = courses.find(c => c.id === courseId && c.status === 'active');
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Successfully enrolled in course',
    enrollment: {
      id: Date.now(),
      courseId: courseId,
      userId: userId,
      userEmail: userEmail,
      enrolledAt: new Date().toISOString()
    }
  });
});

// Admin Routes (Add this after all your existing routes)
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Serve static assets in production (if you have a React/Vue frontend)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully');
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('==================================================');
  console.log('ONLINE TUITION BACKEND SERVER STARTED');
  console.log('==================================================');
  console.log('Port: ' + PORT);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('Time: ' + new Date().toLocaleString());
  console.log('URL: http://localhost:' + PORT);
  console.log('API Health: http://localhost:' + PORT + '/api/health');
  console.log('Admin API: http://localhost:' + PORT + '/api/admin');
  console.log('==================================================');
});
