import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import xss from 'xss';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
}));

// Helmet
app.use(helmet());

// Compression
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP',
});
app.use(limiter);

// HPP
app.use(hpp());

// JSON & URL Encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// XSS Sanitization
app.use((req, res, next) => {
    const sanitize = (obj: any): any => {
        if (typeof obj === 'string') {
            return xss(obj);
        }
        if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
                obj[key] = sanitize(obj[key]);
            });
        }
        return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);
    next();
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// Test Route
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
    });
});

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

export default app;