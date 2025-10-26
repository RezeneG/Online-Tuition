// fresh-server.js - COMPLETELY NEW SERVER
const express = require('express');
const app = express();
const PORT = 5000;

console.log('🟢 FRESH SERVER STARTING...');

app.use(express.json());

// SUPER SIMPLE LOGGING
app.use((req, res, next) => {
  console.log(`➡️ [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// TEST ROUTE - SIMPLEST POSSIBLE
app.get('/test', (req, res) => {
  console.log('✅ TEST ROUTE HIT!');
  res.json({ message: 'TEST WORKS!', server: 'fresh-server.js' });
});

// ADMIN DASHBOARD - SIMPLEST POSSIBLE
app.get('/api/admin/dashboard', (req, res) => {
  console.log('✅ ADMIN DASHBOARD HIT!');
  res.json({ 
    success: true, 
    message: 'ADMIN DASHBOARD WORKS IN FRESH SERVER!',
    data: { test: 'success' }
  });
});

// ADMIN USERS - SIMPLEST POSSIBLE
app.get('/api/admin/users', (req, res) => {
  console.log('✅ ADMIN USERS HIT!');
  res.json({ 
    success: true, 
    message: 'ADMIN USERS WORKS IN FRESH SERVER!',
    users: [{ id: 1, name: 'Test User' }]
  });
});

// ADMIN STATS - SIMPLEST POSSIBLE
app.get('/api/admin/stats', (req, res) => {
  console.log('✅ ADMIN STATS HIT!');
  res.json({ 
    success: true, 
    message: 'ADMIN STATS WORKS IN FRESH SERVER!',
    stats: { status: 'online' }
  });
});

// ROOT ROUTE
app.get('/', (req, res) => {
  console.log('✅ ROOT ROUTE HIT!');
  res.json({ 
    message: 'FRESH SERVER IS RUNNING!',
    endpoints: [
      '/test',
      '/api/admin/dashboard',
      '/api/admin/users',
      '/api/admin/stats'
    ]
  });
});

// 404 HANDLER
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    requested: req.originalUrl,
    method: req.method,
    available: [
      'GET /',
      'GET /test', 
      'GET /api/admin/dashboard',
      'GET /api/admin/users',
      'GET /api/admin/stats'
    ]
  });
});

app.listen(PORT, () => {
  console.log('=========================================');
  console.log('🟢 FRESH SERVER RUNNING ON PORT', PORT);
  console.log('=========================================');
  console.log('TEST THESE URLS IN YOUR BROWSER:');
  console.log('1. http://localhost:5000/');
  console.log('2. http://localhost:5000/test');
  console.log('3. http://localhost:5000/api/admin/dashboard');
  console.log('4. http://localhost:5000/api/admin/users');
  console.log('5. http://localhost:5000/api/admin/stats');
  console.log('=========================================');
});
