// Backend/src/routes/admin.routes.ts
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import {
  createAdmin,
  getAllAdmins,
  toggleAdminStatus,
  deleteAdmin,
} from '../controller/admin_controller/admin.controller.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

// Get all admins
router.get('/', getAllAdmins);

// Create new admin
router.post('/', createAdmin);

// Toggle admin status (activate/deactivate)
router.patch('/:adminId/toggle', toggleAdminStatus);

// Delete admin
router.delete('/:adminId', deleteAdmin);

export default router;