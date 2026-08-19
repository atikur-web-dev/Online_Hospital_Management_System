import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  me,
  emailVerify,
} from '../controller/auth.controller.js';
import {
  googleLogin,
  googleCallback,
} from '../controller/auth-google.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public Routes 
router.post('/register', register);
router.post('/login', login);
router.get('/google', googleLogin);
router.post('/refresh-token', refreshToken);
router.get('/verify/:token', emailVerify);
router.get('/google/callback', googleCallback);

// Protected Routes 
router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);

export default router;
