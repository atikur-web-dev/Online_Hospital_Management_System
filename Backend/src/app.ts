import express, {  type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import session from 'express-session';
import passport from 'passport';
import { errorHandler } from "./middleware/error.middleware.js";
import dotenv from 'dotenv';
import doctorRoutes from "./routes/doctor.routes.js";
import adminRoutes from './routes/admin.routes.js';
import cookieParser from 'cookie-parser';
import profileRoutes from "./routes/profile.routes.js";
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from "./routes/appointment.routes.js";
import doctorAppointmentRoutes from "./routes/doctorAppointment.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import doctorScheduleRoutes from "./routes/doctorSchedule.routes.js";
import medicalRecordRoutes from "./routes/medicalRecord.routes.js";

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
app.use('/api/v1/admin', adminRoutes); 
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/doctor/appointments", doctorAppointmentRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/doctor-schedule", doctorScheduleRoutes);
app.use("/api/v1/medical-records", medicalRecordRoutes);

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

// Error Handler 

app.use(errorHandler);

export default app;