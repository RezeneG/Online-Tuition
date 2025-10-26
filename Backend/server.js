import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting Online Tuition Backend Server...');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
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
    students: 1500
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
    students: 2000
  }
];

// Basic admin routes (directly in server.js for now)
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard working!',
    data: {
      totalUsers: 1250,
      totalCourses: courses.length,
      totalRevenue: 75420,
      activeEnrollments: 3890
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json({
    success: true,
    users: [
      { id: 1, name: 'John Student', email: 'john@example.com', role: 'student' },
      { id: 2, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      { id: 3, name: 'Sarah Learner', email: 'sarah@example.com', role: 'student' }
    ],
    total: 3
  });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      serverStatus: 'online',
      uptime: '2 days, 5 hours',
      memoryUsage: '45%',
      responseTime: '125ms'
    }
  });
});

// Your existing routes
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
    timestamp: new Date().toISOString()
  });
});

app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    courses: courses,
    total: courses.length
  });
});

app.get('/api/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = courses.find(c => c.id === courseId);
  
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
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: Date.now(),
      name: name,
      email: email,
      role: 'student'
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
  
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: 1,
      name: 'Test User',
      email: email,
      role: 'student'
    },
    token: 'mock-jwt-token-' + Date.now()
  });
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
  console.log('Admin Dashboard: http://localhost:' + PORT + '/api/admin/dashboard');
  console.log('==================================================');
});
