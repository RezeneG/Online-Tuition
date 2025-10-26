const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import our database setup
const { connectDB, inMemoryData } = require("./config/database");
const User = require("./models/User");
const Course = require("./models/Course");

console.log("🟢 Starting Online Tuition Backend with Database...");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// Initialize database (will use in-memory if MongoDB fails)
let dbConnected = false;

const initializeApp = async () => {
  dbConnected = await connectDB();
  if (dbConnected) {
    console.log("✅ Using MongoDB database");
  } else {
    console.log("✅ Using in-memory database for development");
  }
};

initializeApp();

// ==================== ADMIN ROUTES ====================
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    console.log("✅ ADMIN DASHBOARD ACCESSED");
    
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalRevenue = await Course.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    
    res.json({
      success: true,
      message: `Admin dashboard working! (Using ${dbConnected ? 'MongoDB' : 'In-Memory'} database)`,
      data: {
        totalUsers,
        totalCourses,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeEnrollments: 3890,
        database: dbConnected ? 'MongoDB' : 'In-Memory',
        recentActivities: [
          { action: "New user registered", time: "2 hours ago" },
          { action: "Course created", time: "4 hours ago" },
          { action: "Payment received", time: "5 hours ago" }
        ]
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
    const users = await User.find();
    
    res.json({
      success: true,
      message: `Users loaded from ${dbConnected ? 'MongoDB' : 'In-Memory'} database`,
      users,
      total: users.length
    });
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.get("/api/admin/stats", async (req, res) => {
  try {
    console.log("✅ ADMIN STATS ACCESSED");
    
    res.json({
      success: true,
      stats: {
        serverStatus: "online",
        databaseStatus: dbConnected ? "connected" : "in-memory",
        uptime: process.uptime(),
        memoryUsage: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
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

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: Date.now(),
        name,
        email,
        role: role || 'student'
      }
    });
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

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: 1,
        name: 'Test User',
        email: email,
        role: 'student'
      },
      token: "mock-jwt-token-" + Date.now()
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});

// ==================== COURSE ROUTES ====================
app.get("/api/courses", async (req, res) => {
  try {
    const { category, level, search } = req.query;
    
    let filter = { status: 'active' };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter);
    
    res.json({
      success: true,
      courses,
      total: courses.length
    });
  } catch (error) {
    console.error("Courses error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching courses"
    });
  }
});

// ==================== PUBLIC ROUTES ====================
app.get("/", (req, res) => {
  res.json({
    message: "Online Tuition Backend API",
    version: "2.0.0",
    status: "Running",
    database: dbConnected ? "MongoDB Connected" : "In-Memory Data",
    timestamp: new Date().toISOString(),
    endpoints: {
      admin: [
        "GET /api/admin/dashboard",
        "GET /api/admin/users", 
        "GET /api/admin/stats"
      ],
      auth: [
        "POST /api/auth/register",
        "POST /api/auth/login"
      ],
      courses: [
        "GET /api/courses"
      ]
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
    database: dbConnected ? "MongoDB Connected" : "In-Memory Data",
    timestamp: new Date().toISOString()
  });
});

// ==================== 404 HANDLER ====================
app.use("*", (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      "GET /",
      "GET /api/health",
      "GET /api/courses",
      "GET /api/admin/dashboard",
      "GET /api/admin/users",
      "GET /api/admin/stats",
      "POST /api/auth/register",
      "POST /api/auth/login"
    ]
  });
});

app.listen(PORT, () => {
  console.log("================================================");
  console.log("🟢 SERVER RUNNING ON PORT", PORT);
  console.log("================================================");
  console.log("ADMIN ENDPOINTS:");
  console.log("• http://localhost:" + PORT + "/api/admin/dashboard");
  console.log("• http://localhost:" + PORT + "/api/admin/users");
  console.log("• http://localhost:" + PORT + "/api/admin/stats");
  console.log("");
  console.log("Test these URLs in your browser!");
  console.log("================================================");
});
