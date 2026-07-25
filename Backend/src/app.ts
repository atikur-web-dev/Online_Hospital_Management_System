import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

// ================= Middleware =================

// CORS
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  }),
);

// Helmet
app.use(helmet());

// Compression
app.use(compression());

// Rate Limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP',
  }),
);

// HPP
app.use(hpp());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ================= Routes =================

app.use("/api/v1/auth", authRoutes);

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ================= 404 =================

app.use((_req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ================= Error Handler =================

app.use(
  (
    err: Error & { status?: number },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    console.error(err);

    return res.status(err.status ?? 500).json({
      success: false,
      message: err.message ?? 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
    });
  },
);

export default app;