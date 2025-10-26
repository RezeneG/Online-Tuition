@'
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log("🟢 Starting Online Tuition Backend with Admin Routes...");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log("➡️ " + new Date().toLocaleTimeString() + " " + req.method + " " + req.url);
  next();
});

// ==================== ADMIN ROUTES ====================
app.get("/api/admin/dashboard", (req, res) => {
  console.log("✅ ADMIN DASHBOARD ACCESSED");
  res.json({
    success: true,
    message: "Admin dashboard working!",
    data: {
      totalUsers: 1250,
      totalCourses: 45,
      totalRevenue: 75420,
      activeEnrollments: 3890
    }
  });
});

app.get("/api/admin/users", (req, res) => {
  console.log("✅ ADMIN USERS ACCESSED");
  res.json({
    success: true,
    users: [
      { id: 1, name: "John Student", email: "john@example.com", role: "student" },
      { id: 2, name: "Admin User", email: "admin@example.com", role: "admin" }
    ]
  });
});

app.get("/api/admin/stats", (req, res) => {
  console.log("✅ ADMIN STATS ACCESSED");
  res.json({
    success: true,
    stats: {
      serverStatus: "online",
      uptime: "2 days",
      memoryUsage: "45%"
    }
  });
});

// Your existing routes here (courses, auth, etc.)
app.get("/", (req, res) => {
  res.json({
    message: "Online Tuition Backend API",
    version: "1.0.0",
    status: "Running",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// Add your existing course and auth routes here...

app.listen(PORT, () => {
  console.log("================================================");
  console.log("🟢 SERVER WITH ADMIN ROUTES RUNNING ON PORT " + PORT);
  console.log("================================================");
  console.log("ADMIN ENDPOINTS:");
  console.log("• http://localhost:" + PORT + "/api/admin/dashboard");
  console.log("• http://localhost:" + PORT + "/api/admin/users");
  console.log("• http://localhost:" + PORT + "/api/admin/stats");
  console.log("================================================");
});
'@ | Out-File -FilePath server.js -Encoding UTF8
