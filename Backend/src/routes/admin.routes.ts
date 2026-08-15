import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { getDashboard } from "../controller/admin_controller/dashboard.controller.js";
import {
  createAdmin,
  getAllAdmins,
  toggleAdminStatus,
  deleteAdmin,
} from '../controller/admin_controller/admin.controller.js';

const router = Router();

router.use(authenticate, isAdmin);

router.get("/dashboard", getDashboard);
router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.patch('/:adminId/toggle', toggleAdminStatus);
router.delete('/:adminId', deleteAdmin);

export default router;