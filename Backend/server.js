import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log("🟢 STARTING SERVER WITH WORKING ADMIN ROUTES...");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==================== ADD REQUEST LOGGING ====================
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// ==================== SIMPLE ADMIN ROUTES ====================
app.get("/api/admin/dashboard", (req, res) => {
  console.log("✅ ADMIN DASHBOARD EXECUTED");
  res.json({
    success: true,
    message: "Admin Dashboard is Working!",
    data: { users: 1250, courses: 45 }
  });
});

app.get("/api/admin/users", (req, res) => {
  console.log("✅ ADMIN USERS EXECUTED");
  res.json({
    success: true,
    message: "Admin Users is Working!",
    users: [
      { id: 1, name: "Test User 1" },
      { id: 2, name: "Test User 2" }
    ]
  });
});

app.get("/api/admin/stats", (req, res) => {
  console.log("✅ ADMIN STATS EXECUTED");
  res.json({
    success: true,
    message: "Admin Stats is Working!",
    stats: { status: "online" }
  });
});

// ==================== SIMPLE PUBLIC ROUTES ====================
app.get("/", (req, res) => {
  console.log("✅ ROOT ROUTE EXECUTED");
  res.json({
    message: "Server is running with admin routes!",
    adminEndpoints: [
      "/api/admin/dashboard",
      "/api/admin/users", 
      "/api/admin/stats"
    ]
  });
});

app.get("/api/health", (req, res) => {
  console.log("✅ HEALTH ROUTE EXECUTED");
  res.json({ status: "OK", message: "Health check working" });
});

// ==================== 404 HANDLER ====================
app.use("*", (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    requested: req.originalUrl,
    availableRoutes: [
      "GET /",
      "GET /api/health", 
      "GET /api/admin/dashboard",
      "GET /api/admin/users",
      "GET /api/admin/stats"
    ]
  });
});

app.listen(PORT, () => {
  console.log("================================================");
  console.log("🟢 SERVER RUNNING ON http://localhost:" + PORT);
  console.log("================================================");
  console.log("ADMIN ENDPOINTS (TEST THESE):");
  console.log("• http://localhost:" + PORT + "/api/admin/dashboard");
  console.log("• http://localhost:" + PORT + "/api/admin/users");
  console.log("• http://localhost:" + PORT + "/api/admin/stats");
  console.log("");
  console.log("PUBLIC ENDPOINTS:");
  console.log("• http://localhost:" + PORT + "/");
  console.log("• http://localhost:" + PORT + "/api/health");
  console.log("================================================");
});
