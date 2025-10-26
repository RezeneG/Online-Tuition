const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

console.log('🟢 STARTING FRESH SERVER WITH ADMIN ROUTES...');

app.use(cors());
app.use(express.json());

// Log ALL requests
app.use((req, res, next) => {
  console.log(`➡️ [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/dashboard', (req, res) => {
  console.log('✅ ADMIN DASHBOARD ROUTE EXECUTED');
  res.json({
    success: true,
    message: 'ADMIN DASHBOARD IS WORKING!',
    data: {
      totalUsers: 1250,
      totalCourses: 45,
      totalRevenue: 75420
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  console.log('✅ ADMIN USERS ROUTE EXECUTED');
  res.json({
    success: true,
    message: 'ADMIN USERS IS WORKING!',
    users: [
      { id: 1, name: 'John Student', email: 'john@example.com' },
      { id: 2, name: 'Admin User', email: 'admin@example.com' }
    ]
  });
});

app.get('/api/admin/stats', (req, res) => {
  console.log('✅ ADMIN STATS ROUTE EXECUTED');
  res.json({
    success: true,
    message: 'ADMIN STATS IS WORKING!',
    stats: {
      serverStatus: 'online',
      uptime: '2 days',
      memoryUsage: '45%'
    }
  });
});

// ==================== PUBLIC ROUTES ====================
app.get('/', (req, res) => {
  console.log('✅ ROOT ROUTE EXECUTED');
  res.json({
    message: '✅ SERVER IS RUNNING WITH ADMIN ROUTES!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/admin/dashboard',
      'GET /api/admin/users',
      'GET /api/admin/stats',
      'GET /api/health'
    ]
  });
});

app.get('/api/health', (req, res) => {
  console.log('✅ HEALTH ROUTE EXECUTED');
  res.json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// ==================== 404 HANDLER ====================
app.use('*', (req, res) => {
  console.log(`❌ 404 - NO ROUTE FOUND: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/admin/dashboard',
      'GET /api/admin/users', 
      'GET /api/admin/stats'
    ]
  });
});

app.listen(PORT, () => {
  console.log('==============================================');
  console.log('🟢 FRESH SERVER RUNNING ON PORT', PORT);
  console.log('==============================================');
  console.log('TEST THESE ADMIN ENDPOINTS IN YOUR BROWSER:');
  console.log('1. http://localhost:5000/');
  console.log('2. http://localhost:5000/api/admin/dashboard');
  console.log('3. http://localhost:5000/api/admin/users');
  console.log('4. http://localhost:5000/api/admin/stats');
  console.log('5. http://localhost:5000/api/health');
  console.log('==============================================');
});
