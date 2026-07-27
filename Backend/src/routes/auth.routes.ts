import { Router } from 'express';

import {
  register,
  login,
  refreshToken,
  logout,
  me,
  emailVerify,
} from '../controller/auth.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

console.log("✅ auth.routes loaded");

const router = Router();

// ============ Public Routes ============
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get("/verify/:token", (req, res) => {
  console.log("VERIFY ROUTE HIT");
  res.send("Verify route working");
});

// ============ Protected Routes ============
router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);

export default router;