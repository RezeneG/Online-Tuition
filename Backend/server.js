import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Service from "./models/Service.js"; // Added Service import

dotenv.config();

console.log("🟢 Starting Online Tuition Backend with Enhanced Database...");

// Connect to database
const dbConnected = await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - ORDER IS IMPORTANT!
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public folder

// Request logging middleware
app.use((req, res, next) => {
  console.log(`➡️ ${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// ==================== SERVICES API ROUTES ====================
// Get all services with optional filtering
app.get("/api/services", async (req, res) => {
  try {
    console.log("✅ SERVICES LIST ACCESSED");
    const { category, serviceType, limit = 10, page = 1 } = req.query;
    
    let services;
    if (dbConnected) {
      let filter = {};
      if (category) filter.category = category;
      if (serviceType) filter.serviceType = serviceType;
      
      services = await Service.find(filter)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .sort({ rating: -1, createdAt: -1 });
      
      const total = await Service.countDocuments(filter);
      
      res.json({
        success: true,
        services,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } else {
      // In-memory services fallback
      const sampleServices = [
        {
          id: 101,
          title: 'Website Development Service',
          description: 'Professional website development for businesses.',
          provider: 'Tech Solutions Ltd',
          category: 'web-development',
          serviceType: 'fixed-price',
          pricing: { model: 'fixed', amount: 999 },
          deliveryTime: '2-3 weeks',
          rating: 4.8,
          features: ['Custom design', 'SEO optimization', '1 month support']
        },
        {
          id: 102,
          title: 'IT Support & Maintenance',
          description: 'Ongoing IT support and troubleshooting.',
          provider: 'Tech Solutions Ltd',
          category: 'it-support',
          serviceType: 'hourly',
          pricing: { model: 'hourly', rate: 45, minHours: 2 },
          deliveryTime: 'Same day',
          rating: 4.6,
          features: ['Hardware support', 'Software installation', 'Remote assistance']
        }
      ];
      
      // Apply filtering to in-memory data
      let filteredServices = sampleServices;
      if (category) {
        filteredServices = filteredServices.filter(service => service.category === category);
      }
      if (serviceType) {
        filteredServices = filteredServices.filter(service => service.serviceType === serviceType);
      }
      
      res.json({
        success: true,
        services: filteredServices,
        pagination: {
          page: 1,
          limit: filteredServices.length,
          total: filteredServices.length,
          pages: 1
        }
      });
    }
  } catch (error) {
    console.error("Services error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching services",
      error: error.message
    });
  }
});

// Get single service by ID
app.get("/api/services/:id", async (req, res) => {
  try {
    console.log("✅ SINGLE SERVICE ACCESSED");
    
    let service;
    if (dbConnected) {
      service = await Service.findById(req.params.id);
    } else {
      // In-memory fallback
      const sampleServices = [
        {
          id: 101,
          title: 'Website Development Service',
          description: 'Professional website development for businesses.',
          provider: 'Tech Solutions Ltd',
          category: 'web-development',
          serviceType: 'fixed-price',
          pricing: { model: 'fixed', amount: 999, currency: 'GBP' },
          deliveryTime: '2-3 weeks',
          rating: 4.8,
          completedProjects: 47,
          features: ['Custom design', 'SEO optimization', '1 month support']
        }
      ];
      service = sampleServices.find(s => s.id === parseInt(req.params.id));
    }
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }
    
    res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error("Single service error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching service",
      error: error.message
    });
  }
});

// Get service categories
app.get("/api/services/categories/all", async (req, res) => {
  try {
    console.log("✅ SERVICE CATEGORIES ACCESSED");
    
    let categories;
    if (dbConnected) {
      categories = await Service.distinct('category');
    } else {
      categories = ['web-development', 'it-support', 'software-testing', 'game-development'];
    }
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error("Service categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching service categories",
      error: error.message
    });
  }
});

// ==================== ENHANCED ADMIN ROUTES ====================
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    console.log("✅ ADMIN DASHBOARD ACCESSED");
    
    let totalUsers, totalCourses, totalServices, totalRevenue, activeInstructors, totalEnrollments;
    let teachingModeStats = { online: 0, 'face-to-face': 0, hybrid: 0 };
    let serviceCategoryStats = {};
    let locationStats = {};
    let categoryStats = {};
    let recentEnrollments = [];
    
    if (dbConnected) {
      // Use real database with enhanced metrics
      totalUsers = await User.countDocuments({ isActive: true });
      totalCourses = await Course.countDocuments({ isPublished: true });
      totalServices = await Service.countDocuments({ status: 'available' });
      
      // Calculate revenue from course prices and enrollments
      const courses = await Course.find({ isPublished: true });
      totalRevenue = courses.reduce((sum, course) => 
        sum + (course.price * course.studentsEnrolled), 0
      );
      
      // Add service revenue
      const services = await Service.find({ status: 'available' });
      const serviceRevenue = services.reduce((sum, service) => {
        if (service.pricing.model === 'fixed' && service.pricing.amount) {
          return sum + (service.pricing.amount * service.completedProjects);
        } else if (service.pricing.model === 'hourly' && service.pricing.rate) {
          return sum + (service.pricing.rate * 10 * service.completedProjects); // Estimate 10 hours per project
        }
        return sum;
      }, 0);
      totalRevenue += serviceRevenue;
      
      activeInstructors = await User.countDocuments({ role: 'instructor', isActive: true });
      totalEnrollments = courses.reduce((sum, course) => sum + course.studentsEnrolled, 0);
      
      // Teaching mode statistics
      teachingModeStats.online = await Course.countDocuments({ teachingMode: 'online', isPublished: true });
      teachingModeStats['face-to-face'] = await Course.countDocuments({ teachingMode: 'face-to-face', isPublished: true });
      teachingModeStats.hybrid = await Course.countDocuments({ teachingMode: 'hybrid', isPublished: true });
      
      // Service category statistics
      const serviceCategories = await Service.distinct('category', { status: 'available' });
      for (const category of serviceCategories) {
        serviceCategoryStats[category] = await Service.countDocuments({ 
          category: category, 
          status: 'available' 
        });
      }
      
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
      
      // Course category statistics
      const categories = await Course.distinct('category', { isPublished: true });
      for (const category of categories) {
        categoryStats[category] = await Course.countDocuments({ 
          category: category, 
          isPublished: true 
        });
      }
      
    } else {
      // Use in-memory data
      const { inMemoryData } = await import('./config/database.js');
      const publishedCourses = inMemoryData.courses.filter(c => c.isPublished);
      const activeUsers = inMemoryData.users.filter(u => u.isActive);
      
      totalUsers = activeUsers.length;
      totalCourses = publishedCourses.length;
      totalServices = 4; // Mock services count
      totalRevenue = publishedCourses.reduce((sum, course) => 
        sum + (course.price * course.studentsEnrolled), 0
      ) + 25000; // Add mock service revenue
      
      activeInstructors = activeUsers.filter(u => u.role === 'instructor').length;
      totalEnrollments = publishedCourses.reduce((sum, course) => 
        sum + course.studentsEnrolled, 0
      );
      
      // Teaching mode, location, and category stats
      publishedCourses.forEach(course => {
        teachingModeStats[course.teachingMode]++;
        categoryStats[course.category] = (categoryStats[course.category] || 0) + 1;
        if (course.location?.city) {
          locationStats[course.location.city] = (locationStats[course.location.city] || 0) + 1;
        }
      });
      
      // Service category stats (mock)
      serviceCategoryStats = {
        'web-development': 1,
        'it-support': 1,
        'software-testing': 1,
        'game-development': 1
      };
      
      // Mock recent enrollments
      recentEnrollments = [
        {
          studentName: 'Emma Wilson',
          courseTitle: 'Web Development Bootcamp',
          teachingMode: 'hybrid',
          enrolledAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          studentName: 'James Brown',
          courseTitle: 'Advanced Python Programming',
          teachingMode: 'online',
          enrolledAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
          studentName: 'Sarah Johnson',
          courseTitle: 'Face-to-Face Mathematics Tutoring',
          teachingMode: 'face-to-face',
          enrolledAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
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
          totalServices,
          totalRevenue: `£${totalRevenue.toLocaleString()}`,
          activeInstructors,
          totalEnrollments,
          averageRevenuePerCourse: totalCourses > 0 ? `£${Math.round(totalRevenue / totalCourses)}` : '£0'
        },
        teachingModeDistribution: {
          counts: teachingModeStats,
          percentages: teachingModePercentages
        },
        serviceDistribution: serviceCategoryStats,
        locationDistribution: locationStats,
        categoryDistribution: categoryStats,
        recentEnrollments: recentEnrollments,
        performanceMetrics: {
          enrollmentRate: '15%',
          completionRate: '78%',
          studentSatisfaction: '4.8/5.0',
          revenueGrowth: '23%',
          serviceBookings: '45'
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
        providers: enhancedUsers.filter(u => u.role === 'provider').length,
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

app.get("/api/admin/services", async (req, res) => {
  try {
    console.log("✅ ADMIN SERVICES ACCESSED");
    
    let services;
    if (dbConnected) {
      services = await Service.find().sort({ createdAt: -1 });
    } else {
      // Mock services data
      services = [
        {
          id: 101,
          title: 'Website Development Service',
          provider: 'Tech Solutions Ltd',
          category: 'web-development',
          serviceType: 'fixed-price',
          pricing: { model: 'fixed', amount: 999 },
          status: 'available',
          rating: 4.8,
          completedProjects: 47
        },
        {
          id: 102,
          title: 'IT Support & Maintenance',
          provider: 'Tech Solutions Ltd',
          category: 'it-support',
          serviceType: 'hourly',
          pricing: { model: 'hourly', rate: 45 },
          status: 'available',
          rating: 4.6,
          completedProjects: 89
        }
      ];
    }
    
    res.json({
      success: true,
      message: `Services loaded from ${dbConnected ? 'MongoDB' : 'In-Memory'} database`,
      services,
      total: services.length,
      stats: {
        available: services.filter(s => s.status === 'available').length,
        unavailable: services.filter(s => s.status === 'unavailable').length,
        webDevelopment: services.filter(s => s.category === 'web-development').length,
        itSupport: services.filter(s => s.category === 'it-support').length,
        softwareTesting: services.filter(s => s.category === 'software-testing').length,
        gameDevelopment: services.filter(s => s.category === 'game-development').length
      }
    });
  } catch (error) {
    console.error("Admin services error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching services"
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
        serviceMarketplace: true,
        realTimeAnalytics: true,
        userManagement: true,
        courseManagement: true,
        serviceManagement: true,
        paymentProcessing: true,
        reporting: true
      },
      version: "4.0.0"
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

// Create new course (Admin/Instructor only)
app.post("/api/courses", async (req, res) => {
  try {
    console.log("✅ COURSE CREATION ACCESSED");
    const courseData = req.body;
    
    if (dbConnected) {
      const course = await Course.create(courseData);
      res.status(201).json({
        success: true,
        message: "Course created successfully",
        course
      });
    } else {
      // In-memory course creation
      const newCourse = {
        ...courseData,
        courseId: Date.now(),
        createdAt: new Date(),
        isPublished: true
      };
      
      const { inMemoryData } = await import('./config/database.js');
      inMemoryData.courses.push(newCourse);
      
      res.status(201).json({
        success: true,
        message: "Course created successfully (in-memory)",
        course: newCourse
      });
    }
  } catch (error) {
    console.error("Course creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating course"
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
    message: "Online Tuition Backend API with Training & Services Marketplace",
    version: "4.0.0",
    status: "Running",
    database: dbConnected ? "MongoDB Connected" : "In-Memory Data",
    timestamp: new Date().toISOString(),
    endpoints: {
      services: [
        "GET /api/services",
        "GET /api/services/:id",
        "GET /api/services/categories/all"
      ],
      admin: [
        "GET /api/admin/dashboard",
        "GET /api/admin/users",
        "GET /api/admin/courses",
        "GET /api/admin/services",
        "GET /api/admin/stats"
      ],
      courses: [
        "GET /api/courses",
        "GET /api/courses/:id",
        "GET /api/courses/filters/options",
        "POST /api/courses"
      ],
      auth: [
        "POST /api/auth/register",
        "POST /api/auth/login"
      ],
      public: [
        "GET /",
        "GET /api/health",
        "GET /admin",
        "GET /adminDashboard.html"
      ]
    }
  });
});

app.get("/admin", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Admin Portal - Online Tuition</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0; 
                padding: 0; 
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container { 
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 600px;
            }
            h1 { color: #333; margin-bottom: 10px; }
            p { color: #666; margin-bottom: 30px; }
            .btn { 
                display: inline-block; 
                padding: 15px 30px; 
                margin: 10px; 
                background: #667eea; 
                color: white; 
                text-decoration: none; 
                border-radius: 8px;
                font-weight: 600;
                transition: transform 0.2s;
            }
            .btn:hover { 
                transform: translateY(-2px);
                background: #5a6fd8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎯 Online Tuition & Services Admin Portal</h1>
            <p>Access platform analytics and management tools for Training & Services</p>
            <div>
                <a href="/adminDashboard.html" class="btn">📊 Analytics Dashboard</a>
                <a href="/api/admin/dashboard" class="btn">📈 API Data</a>
                <a href="/api/admin/users" class="btn">👥 Users</a>
                <a href="/api/admin/courses" class="btn">📚 Courses</a>
                <a href="/api/admin/services" class="btn">🛠️ Services</a>
            </div>
        </div>
    </body>
    </html>
  `);
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
      "GET /admin",
      "GET /adminDashboard.html",
      "GET /api/health",
      "GET /api/services",
      "GET /api/services/:id",
      "GET /api/services/categories/all",
      "GET /api/courses",
      "GET /api/courses/:id",
      "GET /api/courses/filters/options",
      "POST /api/courses",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/admin/dashboard",
      "GET /api/admin/users",
      "GET /api/admin/courses",
      "GET /api/admin/services",
      "GET /api/admin/stats"
    ]
  });
});

app.listen(PORT, () => {
  console.log("==================================================");
  console.log("🟢 ONLINE TUITION & SERVICES MARKETPLACE BACKEND");
  console.log("==================================================");
  console.log("Port: " + PORT);
  console.log("Environment: " + (process.env.NODE_ENV || "development"));
  console.log("Database: " + (dbConnected ? "MongoDB Connected" : "In-Memory Data"));
  console.log("Time: " + new Date().toLocaleString());
  console.log("URL: http://localhost:" + PORT);
  console.log("");
  console.log("🛠️  NEW SERVICES MARKETPLACE:");
  console.log("   📋 http://localhost:" + PORT + "/api/services");
  console.log("   🗂️  http://localhost:" + PORT + "/api/services/categories/all");
  console.log("");
  console.log("📊 ADMIN DASHBOARD:");
  console.log("   🌐 http://localhost:" + PORT + "/adminDashboard.html");
  console.log("   🎯 http://localhost:" + PORT + "/admin");
  console.log("");
  console.log("📊 ADMIN API ENDPOINTS:");
  console.log("   📈 http://localhost:" + PORT + "/api/admin/dashboard");
  console.log("   👥 http://localhost:" + PORT + "/api/admin/users");
  console.log("   📚 http://localhost:" + PORT + "/api/admin/courses");
  console.log("   🛠️  http://localhost:" + PORT + "/api/admin/services");
  console.log("   ⚙️  http://localhost:" + PORT + "/api/admin/stats");
  console.log("");
  console.log("🌐 PUBLIC ENDPOINTS:");
  console.log("   🏠 http://localhost:" + PORT + "/");
  console.log("   🩺 http://localhost:" + PORT + "/api/health");
  console.log("   📚 http://localhost:" + PORT + "/api/courses");
  console.log("==================================================");
});
