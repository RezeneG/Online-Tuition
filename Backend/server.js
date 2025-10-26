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

// ==========================================
// ADMIN ROUTES - ADDED DIRECTLY TO SERVER.JS
// ==========================================

// Admin Dashboard
app.get('/api/admin/dashboard', (req, res) => {
  console.log('✅ Admin dashboard accessed');
  res.json({
    success: true,
    message: 'Admin dashboard working!',
    data: {
      totalUsers: 1250,
      totalCourses: courses.length,
      totalRevenue: 75420,
      activeEnrollments: 3890,
      recentActivities: [
        { action: 'New user registered', time: '2 hours ago' },
        { action: 'Course created', time: '4 hours ago' },
        { action: 'Payment received', time: '5 hours ago' }
      ]
    }
  });
});

// Admin Users
app.get('/api/admin/users', (req, res) => {
  console.log('✅ Admin users accessed');
  res.json({
    success: true,
    users: [
      { 
        id: 1, 
        name: 'John Student', 
        email: 'john@example.com', 
        role: 'student', 
        status: 'active',
        joined: '2024-01-15'
      },
      { 
        id: 2, 
        name: 'Admin User', 
        email: 'admin@example.com', 
        role: 'admin', 
        status: 'active',
        joined: '2024-01-10'
      },
      { 
        id: 3, 
        name: 'Sarah Learner', 
        email: 'sarah@example.com', 
        role: 'student', 
        status: 'active',
        joined: '2024-01-20'
      }
    ],
    total: 3
  });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  console.log('✅ Admin stats accessed');
  res.json({
    success: true,
    stats: {
      serverStatus: 'online',
      uptime: '2 days, 5 hours',
      memoryUsage: '45%',
      cpuUsage: '12%',
      databaseConnections: 28,
      responseTime: '125ms'
    }
  });
});

// ==========================================
// EXISTING PUBLIC ROUTES
// ==========================================

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Online Tuition Backend API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString(),
    endpoints: {
      admin: [
        '/api/admin/dashboard',
        '/api/admin/users', 
        '/api/admin/stats'
      ],
      public: [
        '/api/health',
        '/api/courses',
        '/api/auth/login',
        '/api/auth/register'
      ]
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Get all courses
app.get('/api/courses', (req, res) => {
  const { category, level, search } = req.query;
  
  let filteredCourses = courses;
  
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

// Get single course
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

// User registration
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

// User login
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

// Course enrollment
app.post('/api/courses/:id/enroll', (req, res) => {
  const courseId = parseInt(req.params.id);
  const { userId, userEmail } = req.body;
  
  const course = courses.find(c => c.id === courseId);
  
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

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler for undefined routes
app.use('*', (req, res) => {
  console.log('❌ Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
    availableEndpoints: {
      admin: [
        'GET /api/admin/dashboard',
        'GET /api/admin/users',
        'GET /api/admin/stats'
      ],
      public: [
        'GET /',
        'GET /api/health',
        'GET /api/courses',
        'GET /api/courses/:id',
        'POST /api/auth/login',
        'POST /api/auth/register',
        'POST /api/courses/:id/enroll'
      ]
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('==================================================');
  console.log('✅ ONLINE TUITION BACKEND SERVER STARTED');
  console.log('==================================================');
  console.log('Port: ' + PORT);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('Time: ' + new Date().toLocaleString());
  console.log('URL: http://localhost:' + PORT);
  console.log('');
  console.log('📊 ADMIN ENDPOINTS:');
  console.log('   http://localhost:' + PORT + '/api/admin/dashboard');
  console.log('   http://localhost:' + PORT + '/api/admin/users');
  console.log('   http://localhost:' + PORT + '/api/admin/stats');
  console.log('');
  console.log('🌐 PUBLIC ENDPOINTS:');
  console.log('   http://localhost:' + PORT + '/');
  console.log('   http://localhost:' + PORT + '/api/health');
  console.log('   http://localhost:' + PORT + '/api/courses');
  console.log('==================================================');
});
