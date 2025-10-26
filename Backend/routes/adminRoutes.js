import express from 'express';
import { authenticateAdmin, authorizeAdmin } from '../middleware/authMiddleware.js';
import {
  getAdminDashboard,
  getAllUsers,
  manageUser,
  getSystemStats
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and authorization
router.use(authenticateAdmin, authorizeAdmin);

// Admin dashboard routes
router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.put('/users/:userId', manageUser);
router.get('/stats', getSystemStats);

export default router;
