import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Enrollment from "./models/Enrollment.js";

dotenv.config();

console.log("🟢 Starting Online Tuition Backend with Enhanced Database...");

// Connect to database
const dbConnected = await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`➡️ ${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// ==================== ENHANCED ADMIN ROUTES ====================
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    console.log("✅ ADMIN DASHBOARD ACCESSED");
    
    let totalUsers, totalCourses, totalRevenue, activeInstructors, totalEnrollments;
    let teachingModeStats = { online: 0, 'face-to-face': 0, hybrid: 0 };
    let locationStats = {};
    let categoryStats = {};
    let recentEnrollments = [];
    
    if (dbConnected) {
      // Use real database with enhanced metrics
      totalUsers = await User.countDocuments({ isActive: true });
      totalCourses = await Course.countDocuments({ isPublished: true });
      
      // Calculate revenue from course prices and enrollments
      const courses = await Course.find({ isPublished: true });
      totalRevenue = courses.reduce((sum, course) => 
        sum + (course.price * course.studentsEnrolled), 0
      );
      
      activeInstructors = await User.countDocuments({ role: 'instructor', isActive: true });
      totalEnrollments = courses.reduce((sum, course) => sum + course.studentsEnrolled, 0);
      
      // Teaching mode statistics
      teachingModeStats.online = await Course.countDocuments({ teachingMode: 'online', isPublished: true });
      teachingModeStats['face-to-face'] = await Course.countDocuments({ teachingMode: 'face-to-face', isPublished: true });
      teachingModeStats.hybrid = await Course.countDocuments({ teachingMode: 'hybrid', isPublished: true });
      
      // Location statistics
      const cities = await Course.distinct('location.city', { 
        isPublished: true, 
        'location.city': { $ne: '' } 
      });
      for (const city of cities) {
        locationStats[city] = await Course.countDocuments({ 
          'location.city': city, 
          isPublished: true 
        });
      }
      
      // Category statistics
      const categories = await Course.distinct('category', { isPublished: true });
      for (const category of categories) {
        categoryStats[category] = await Course.countDocuments({ 
          category: category, 
          isPublished: true 
        });
      }
      
      // Recent enrollments (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      recentEnrollments = await Enrollment.find({
        createdAt: { $gte: sevenDaysAgo }
      })
      .populate('userId', 'name email')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 })
      .limit(10);
      
    } else {
      // Use in-memory data
      const { inMemoryData } = await import('./config/database.js');
      totalUsers = inMemoryData.users.filter(u => u.isActive).length;
      totalCourses = inMemoryData.courses.filter(c => c.isPublished).length;
      totalRevenue = inMemoryData.courses.reduce((sum, course) => 
        sum + (course.price * course.studentsEnrolled), 0
      );
      activeInstructors = inMemoryData.users.filter(u => u.role === 'instructor' && u.isActive).length;
      totalEnrollments = inMemoryData.courses.reduce((sum, course) => 
        sum + course.studentsEnrolled, 0
      );
      
      // Teaching mode, location, and category stats
      inMemoryData.courses.forEach(course => {
        if (course.isPublished) {
          teachingModeStats[course.teachingMode]++;
          categoryStats[course.category] = (categoryStats[course.category] || 0) + 1;
          if (course.location?.city) {
            locationStats[course.location.city] = (locationStats[course.location.city] || 0) + 1;
          }
        }
      });
      
      // Mock recent enrollments
      recentEnrollments = [
        {
          userId: { name: 'Emma Wilson', email: 'emma@student.com' },
          courseId: { title: 'Web Development Bootcamp', price: 299 },
          teachingMode: 'hybrid',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          userId: { name: 'James Brown', email: 'james@student.com' },
          courseId: { title: 'Advanced Python Programming', price: 199 },
          teachingMode: 'online',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        }
      ];
    }
    
    // Calculate percentages for teaching modes
    const totalTeachingModes = teachingModeStats.online + teachingModeStats['face-to-face'] + teachingModeStats.hybrid;
    const teachingModePercentages = {
      online: totalTeachingModes > 0 ? Math.round((teachingModeStats.online / totalTeachingModes) * 100) : 0,
      faceToFace: totalTeachingModes > 0 ? Math.round((teachingModeStats['face-to-face'] / totalTeachingModes) * 100) : 0,
      hybrid: totalTeachingModes > 0 ? Math.round((teachingModeStats.hybrid / totalTeachingModes) * 100) : 0
    };
    
    res.json({
      success: true,
      message: `Admin dashboard working! (Using ${dbConnected ? 'MongoDB' : 'In-Memory'} database)`,
      data: {
        overview: {
          totalUsers,
          totalCourses,
          totalRevenue: `£${totalRevenue.toLocaleString()}`,
          activeInstructors,
          totalEnrollments,
          averageRevenuePerCourse: totalCourses > 0 ? `£${Math.round(totalRevenue / totalCourses)}` : '£0'
        },
        teachingModeDistribution: {
          counts: teachingModeStats,
          percentages: teachingModePercentages
        },
        locationDistribution: locationStats,
        categoryDistribution: categoryStats,
        recentEnrollments: recentEnrollments.map(enrollment => ({
          studentName: enrollment.userId?.name || 'Unknown Student',
          studentEmail: enrollment.userId?.email || 'unknown@email.com',
          courseTitle: enrollment.courseId?.title || 'Unknown Course',
          coursePrice: enrollment.courseId?.price || 0,
          teachingMode: enrollment.teachingMode,
          enrolledAt: enrollment.createdAt
        })),
        performanceMetrics: {
          enrollmentRate: '15%',
          completionRate: '78%',
          studentSatisfaction: '4.8/5.0',
          revenueGrowth: '23%'
        },
        database: dbConnected ? 'MongoDB' : 'In-Memory',
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    console.log("✅ ADMIN USERS ACCESSED");
    
    let users;
    if (dbConnected) {
      users = await User.find().select("-password").sort({ createdAt: -1 });
    } else {
      const { inMemoryData } = await import('./config/database.js');
      users = inMemoryData.users;
    }
    
    // Enhance user data with additional stats
    const enhancedUsers = users.map(user => {
      const userObj = user.toObject ? user.toObject() : user;
      return {
        ...userObj,
        enrollmentCount: Math.floor(Math.random() * 5) + 1, // Mock data
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in last 7 days
        status: userObj.isActive ? 'Active' : 'Inactive'
      };
    });
    
    res.json({
      success: true,
      message: `Users loaded from ${dbConnected ? 'MongoDB' : 'In-Memory'} database`,
      users: enhancedUsers,
      total: enhancedUsers.length,
      stats: {
        activeUsers: enhancedUsers.filter(u => u.isActive).length,
        students: enhancedUsers.filter(u => u.role === 'student').length,
        instructors: enhancedUsers.filter(u => u.role === 'instructor').length,
        admins: enhancedUsers.filter(u => u.role === 'admin').length
      }
    });
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.get("/api/admin/courses", async (req, res) => {
  try {
    console.log("✅ ADMIN COURSES ACCESSED");
    
    let courses;
    if (dbConnected) {
      courses = await Course.find().sort({ createdAt: -1 });
    } else {
      const { inMemoryData } = await import('./config/database.js');
      courses = inMemoryData.courses;
    }
    
    // Enhance course data
    const enhancedCourses = courses.map(course => {
      const courseObj = course.toObject ? course.toObject() : course;
      return {
        ...courseObj,
        availableSpots: courseObj.teachingMode === 'online' ? 'Unlimited' : Math.max(0, courseObj.maxStudents - courseObj.currentEnrollment),
        isFull: courseObj.teachingMode !== 'online' && courseObj.currentEnrollment >= courseObj.maxStudents,
        revenue: courseObj.price * courseObj.studentsEnrolled,
        completionRate: `${Math.floor(Math.random() * 30) + 70}%` // Mock data 70-100%
      };
    });
    
    res.json({
      success: true,
      message: `Courses loaded from ${dbConnected ? 'MongoDB' : 'In-Memory'} database`,
      courses: enhancedCourses,
      total: enhancedCourses.length,
      stats: {
        published: enhancedCourses.filter(c => c.isPublished).length,
        draft: enhancedCourses.filter(c => !c.isPublished).length,
        online: enhancedCourses.filter(c => c.teachingMode === 'online').length,
        faceToFace: enhancedCourses.filter(c => c.teachingMode === 'face-to-face').length,
        hybrid: enhancedCourses.filter(c => c.teachingMode === 'hybrid').length
      }
    });
  } catch (error) {
    console.error("Admin courses error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.get("/api/admin/stats", async (req, res) => {
  try {
    console.log("✅ ADMIN STATS ACCESSED");
    
    // Real-time system stats
    const systemStats = {
      serverStatus: "online",
      databaseStatus: dbConnected ? "connected" : "in-memory",
      uptime: process.uptime(),
      memoryUsage: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`,
      cpuUsage: `${Math.round(Math.random() * 30) + 5}%`, // Mock CPU usage
      activeConnections: Math.floor(Math.random() * 50) + 10, // Mock connections
      responseTime: `${Math.round(Math.random() * 50) + 50}ms`, // Mock response time
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      stats: systemStats,
      features: {
        hybridTeaching: true,
        realTimeAnalytics: true,
        userManagement: true,
        courseManagement: true,
        paymentProcessing: true,
        reporting: true
      },
      version: "2.0.0"
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ==================== ENHANCED COURSE ROUTES ====================
app.get("/api/courses", async (req, res) => {
  try {
    console.log("✅ COURSES LIST ACCESSED");
    const { category, level, teachingMode, city, search } = req.query;
    
    let courses;
    if (dbConnected) {
      // Build filter based on query parameters
      let filter = { isPublished: true };
      
      if (category) filter.category = category;
      if (level) filter.level = level;
      if (teachingMode) filter.teachingMode = teachingMode;
      if (city) filter['location.city'] = new RegExp(city, 'i');
      
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { instructor: { $regex: search, $options: 'i' } }
        ];
      }
      
      courses = await Course.find(filter).sort({ rating: -1, studentsEnrolled: -1 });
    } else {
      // In-memory courses with filtering
      const { inMemoryData } = await import('./config/database.js');
      courses = inMemoryData.courses.filter(course => {
        if (!course.isPublished) return false;
        if (category && course.category !== category) return false;
        if (level && course.level !== level) return false;
        if (teachingMode && course.teachingMode !== teachingMode) return false;
        if (city && course.location?.city?.toLowerCase() !== city.toLowerCase()) return false;
        if (search) {
          const searchLower = search.toLowerCase();
          if (!course.title.toLowerCase().includes(searchLower) && 
              !course.description.toLowerCase().includes(searchLower) &&
              !course.instructor.toLowerCase().includes(searchLower)) return false;
        }
        return true;
      });
    }
    
    // Enhance courses with virtual fields
    const enhancedCourses = courses.map(course => {
      const courseObj = course.toObject ? course.toObject() : course;
      return {
        ...courseObj,
        availableSpots: courseObj.teachingMode === 'online' ? 'Unlimited' : Math.max(0, courseObj.maxStudents - courseObj.currentEnrollment),
        isFull: courseObj.teachingMode !== 'online' && courseObj.currentEnrollment >= courseObj.maxStudents,
        isPopular: courseObj.studentsEnrolled > 50,
        isNew: new Date(courseObj.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Within 7 days
      };
    });
    
    res.json({
      success: true,
      courses: enhancedCourses,
      total: enhancedCourses.length,
      filters: {
        category,
        level,
        teachingMode,
        city
      },
      database: dbConnected ? 'MongoDB' : 'In-Memory'
    });
  } catch (error) {
    console.error("Courses error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching courses"
    });
  }
});

app.get("/api/courses/:id", async (req, res) => {
  try {
    console.log("✅ SINGLE COURSE ACCESSED");
    const courseId = parseInt(req.params.id);
    
    let course;
    if (dbConnected) {
      course = await Course.findOne({ courseId: courseId });
    } else {
      const { inMemoryData } = await import('./config/database.js');
      course = inMemoryData.courses.find(c => c.courseId === courseId);
    }
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    // Add virtual fields for response
    const courseData = course.toObject ? course.toObject() : course;
    courseData.availableSpots = courseData.teachingMode === 'online' ? 'Unlimited' : Math.max(0, courseData.maxStudents - courseData.currentEnrollment);
    courseData.isFull = courseData.teachingMode !== 'online' && courseData.currentEnrollment >= courseData.maxStudents;
    courseData.enrollmentPercentage = courseData.maxStudents > 0 ? Math.round((courseData.currentEnrollment / courseData.maxStudents) * 100) : 0;
    
    res.json({
      success: true,
      course: courseData
    });
  } catch (error) {
    console.error("Single course error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching course"
    });
  }
});

app.get("/api/courses/filters/options", async (req, res) => {
  try {
    console.log("✅ COURSE FILTERS ACCESSED");
    
    let categories = [], cities = [];
    
    if (dbConnected) {
      categories = await Course.distinct('category', { isPublished: true });
      cities = await Course.distinct('location.city', { 
        isPublished: true, 
        'location.city': { $ne: '' } 
      });
    } else {
      const { inMemoryData } = await import('./config/database.js');
      categories = [...new Set(inMemoryData.courses.filter(c => c.isPublished).map(c => c.category))];
      cities = [...new Set(inMemoryData.courses
        .filter(c => c.isPublished && c.location?.city)
        .map(c => c.location.city)
      )];
    }
    
    res.json({
      success: true,
      filters: {
        categories,
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        teachingModes: ['online', 'face-to-face', 'hybrid'],
        cities: cities.filter(city => city) // Remove empty strings
      }
    });
  } catch (error) {
    console.error("Course filters error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching filters"
    });
  }
});

// ==================== AUTH ROUTES ====================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password"
      });
    }

    if (dbConnected) {
      // Check if user exists in database
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email"
        });
      }

      // Create user in database
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'student'
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully in database",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // In-memory registration
      return res.status(201).json({
        success: true,
        message: "User registered successfully (in-memory)",
        user: {
          id: Date.now(),
          name,
          email,
          role: role || 'student'
        }
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    if (dbConnected) {
      // Database login
      const user = await User.findOne({ email }).select('+password');
      
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      return res.json({
        success: true,
        message: "Login successful (database)",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: "jwt-token-" + Date.now()
      });
    } else {
      // In-memory login
      return res.json({
        success: true,
        message: "Login successful (in-memory)",
        user: {
          id: 1,
          name: "Test User",
          email: email,
          role: "student"
        },
        token: "mock-jwt-token-" + Date.now()
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});

// ==================== PUBLIC ROUTES ====================
app.get("/", (req, res) => {
  res.json({
    message: "Online Tuition Backend API with Enhanced Database",
    version: "3.0.0",
    status: "Running",
    database: dbConnected ? "MongoDB Connected" : "In-Memory Data",
    timestamp: new Date().toISOString(),
    endpoints: {
      admin: [
        "GET /api/admin/dashboard",
        "GET /api/admin/users",
        "GET /api/admin/courses", 
        "GET /api/admin/stats"
      ],
      courses: [
        "GET /api/courses",
        "GET /api/courses/:id",
        "GET /api/courses/filters/options"
      ],
      auth: [
        "POST /api/auth/register",
        "POST /api/auth/login"
      ]
    }
  });
});

app.get("/api/health", async (req, res) => {
  try {
    let databaseStatus = "disconnected";
    if (dbConnected) {
      // Test database connection
      await User.db.db.admin().ping();
      databaseStatus = "connected";
    }
    
    res.json({
      status: "OK",
      message: "Server is healthy",
      database: databaseStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      message: "Database connection failed",
      timestamp: new Date().toISOString(),
      database: "disconnected"
    });
  }
});

// ==================== 404 HANDLER ====================
app.use("*", (req, res) => {
  console.log(`❌ 404 - ROUTE NOT FOUND: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      "GET /",
      "GET /api/health",
      "GET /api/courses",
      "GET /api/courses/:id",
      "GET /api/courses/filters/options",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/admin/dashboard",
      "GET /api/admin/users",
      "GET /api/admin/courses",
      "GET /api/admin/stats"
    ]
  });
});

app.listen(PORT, () => {
  console.log("==================================================");
  console.log("🟢 ONLINE TUITION BACKEND WITH ENHANCED DATABASE");
  console.log("==================================================");
  console.log("Port: " + PORT);
  console.log("Environment: " + (process.env.NODE_ENV || "development"));
  console.log("Database: " + (dbConnected ? "MongoDB Connected" : "In-Memory Data"));
  console.log("Time: " + new Date().toLocaleString());
  console.log("URL: http://localhost:" + PORT);
  console.log("");
  console.log("📊 ADMIN ENDPOINTS:");
  console.log("   📈 http://localhost:" + PORT + "/api/admin/dashboard");
  console.log("   👥 http://localhost:" + PORT + "/api/admin/users");
  console.log("   📚 http://localhost:" + PORT + "/api/admin/courses");
  console.log("   ⚙️  http://localhost:" + PORT + "/api/admin/stats");
  console.log("");
  console.log("🌐 PUBLIC ENDPOINTS:");
  console.log("   🏠 http://localhost:" + PORT + "/");
  console.log("   🩺 http://localhost:" + PORT + "/api/health");
  console.log("   📚 http://localhost:" + PORT + "/api/courses");
  console.log("==================================================");
});
