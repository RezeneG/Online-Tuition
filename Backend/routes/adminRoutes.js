import express from 'express';
const router = express.Router();

// Admin dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard data loaded successfully',
    data: {
      totalUsers: 1250,
      totalCourses: 45,
      totalRevenue: 75420,
      activeEnrollments: 3890,
      pendingApprovals: 12,
      recentActivities: [
        { action: 'New user registration', time: '2 hours ago' },
        { action: 'Course enrollment', time: '4 hours ago' },
        { action: 'Payment received', time: '5 hours ago' }
      ]
    }
  });
});

// Get all users
router.get('/users', (req, res) => {
  res.json({
    success: true,
    users: [
      { 
        id: 1, 
        name: 'John Student', 
        email: 'john@example.com', 
        role: 'student', 
        status: 'active',
        joined: '2024-01-15',
        coursesEnrolled: 3
      },
      { 
        id: 2, 
        name: 'Admin User', 
        email: 'admin@example.com', 
        role: 'admin', 
        status: 'active',
        joined: '2024-01-10',
        coursesEnrolled: 0
      },
      { 
        id: 3, 
        name: 'Sarah Learner', 
        email: 'sarah@example.com', 
        role: 'student', 
        status: 'active',
        joined: '2024-01-20',
        coursesEnrolled: 1
      }
    ],
    total: 3
  });
});

// Get system statistics
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      serverStatus: 'online',
      databaseConnections: 28,
      memoryUsage: '45%',
      cpuUsage: '12%',
      uptime: '2 days, 5 hours',
      responseTime: '125ms'
    }
  });
});

export default router;
