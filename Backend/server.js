import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

console.log('🟢 NEW SERVER STARTING WITH ALL ROUTES...');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/dashboard', (req, res) => {
  console.log('🟢 ADMIN DASHBOARD ACCESSED');
  res.json({
    success: true,
    message: 'Admin Dashboard Working!',
    data: {
      totalUsers: 1250,
      totalCourses: 45,
      totalRevenue: 75420,
      activeEnrollments: 3890
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  console.log('🟢 ADMIN USERS ACCESSED');
  res.json({
    success: true,
    users: [
      { id: 1, name: 'John Student', email: 'john@example.com', role: 'student' },
      { id: 2, name: 'Admin User', email: 'admin@example.com', role: 'admin' }
    ],
    total: 2
  });
});

app.get('/api/admin/stats', (req, res) => {
  console.log('🟢 ADMIN STATS ACCESSED');
  res.json({
    success: true,
    stats: {
      serverStatus: 'online',
      uptime: '2 days',
      memoryUsage: '45%'
    }
  });
});

// ==================== PUBLIC ROUTES ====================
app.get('/', (req, res) => {
  res.json({
    message: '✅ NEW SERVER WITH ALL ROUTES!',
    version: '2.0.0',
    status: 'All Routes Active',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/admin/dashboard',
      'GET /api/admin/users',
      'GET /api/admin/stats',
      'GET /api/health',
      'GET /api/courses'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy with all routes',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    courses: [
      { id: 1, title: 'Web Development', instructor: 'John Smith', price: 99 },
      { id: 2, title: 'Python Programming', instructor: 'Sarah Johnson', price: 129 }
    ],
    total: 2
  });
});

// ==================== 404 HANDLER ====================
app.use('*', (req, res) => {
  console.log('🔴 404:', req.originalUrl);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requested: req.originalUrl,
    availableRoutes: [
      '/',
      '/api/health',
      '/api/courses',
      '/api/admin/dashboard',
      '/api/admin/users',
      '/api/admin/stats'
    ]
  });
});

app.listen(PORT, () => {
  console.log('==============================================');
  console.log('✅ NEW SERVER RUNNING WITH ALL ROUTES!');
  console.log('==============================================');
  console.log('Port: ' + PORT);
  console.log('Time: ' + new Date().toLocaleString());
  console.log('');
  console.log('📋 AVAILABLE ENDPOINTS:');
  console.log('   🌐 http://localhost:' + PORT + '/');
  console.log('   🩺 http://localhost:' + PORT + '/api/health');
  console.log('   📚 http://localhost:' + PORT + '/api/courses');
  console.log('   👨‍💼 http://localhost:' + PORT + '/api/admin/dashboard');
  console.log('   👥 http://localhost:' + PORT + '/api/admin/users');
  console.log('   📊 http://localhost:' + PORT + '/api/admin/stats');
  console.log('==============================================');
});
