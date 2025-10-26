import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

console.log('🟢 STARTING SERVER WITH ADMIN ROUTES...');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/dashboard', (req, res) => {
  console.log('✅ ADMIN DASHBOARD HIT!');
  res.json({
    success: true,
    message: 'ADMIN DASHBOARD WORKING!',
    data: {
      totalUsers: 1250,
      totalCourses: 45,
      totalRevenue: 75420,
      activeEnrollments: 3890
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  console.log('✅ ADMIN USERS HIT!');
  res.json({
    success: true,
    message: 'ADMIN USERS WORKING!',
    users: [
      { id: 1, name: 'John Student', email: 'john@example.com', role: 'student' },
      { id: 2, name: 'Admin User', email: 'admin@example.com', role: 'admin' }
    ]
  });
});

app.get('/api/admin/stats', (req, res) => {
  console.log('✅ ADMIN STATS HIT!');
  res.json({
    success: true,
    message: 'ADMIN STATS WORKING!',
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
    message: '✅ SERVER WITH ADMIN ROUTES IS RUNNING!',
    version: '1.0.0',
    status: 'All Routes Active',
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

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requested: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log('==============================================');
  console.log('✅ SERVER WITH ADMIN ROUTES RUNNING!');
  console.log('==============================================');
  console.log('Port: ' + PORT);
  console.log('Time: ' + new Date().toLocaleString());
  console.log('');
  console.log('📋 TEST THESE ADMIN ENDPOINTS:');
  console.log('   👨‍💼 http://localhost:' + PORT + '/api/admin/dashboard');
  console.log('   👥 http://localhost:' + PORT + '/api/admin/users');
  console.log('   📊 http://localhost:' + PORT + '/api/admin/stats');
  console.log('');
  console.log('🌐 TEST THESE PUBLIC ENDPOINTS:');
  console.log('   🏠 http://localhost:' + PORT + '/');
  console.log('   🩺 http://localhost:' + PORT + '/api/health');
  console.log('==============================================');
});
