// Backend/src/routes/auth.routes.ts
import express from 'express';
import {
  registerUser,
  loginUser,
  refreshTokenService,
  logoutUser,
  getMe,
} from '../services/auth.service.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// ============ Public Routes ============

// Register
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: getErrorMessage(error) || 'Registration failed',
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error: unknown) {
    res.status(401).json({
      success: false,
      message: getErrorMessage(error) || 'Login failed',
    });
  }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    const result = await refreshTokenService(refreshToken);
    res.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    res.status(401).json({
      success: false,
      message: getErrorMessage(error) || 'Refresh token failed',
    });
  }
});

// ============ Protected Routes ============

// Get Current User
router.get('/me', authenticate, async (req, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const user = await getMe(req.user.id);

    res.json({
      success: true,
      data: user,
    });
    return;
  } catch (error: unknown) {
    res.status(404).json({
      success: false,
      message: getErrorMessage(error),
    });
    return;
  }
});
// Logout
router.post('/logout', authenticate, async (req, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    await logoutUser(req.user.id);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
    return;
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error),
    });
    return;
  }
});

export default router;
