import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import type { Request, Response, NextFunction } from 'express';

// CORS কনফিগারেশন
export const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    credentials: true,
    maxAge: 86400 // 24 ঘন্টা
};

// রেট লিমিট কনফিগারেশন
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 মিনিট
    max: 100, // প্রতি IP থেকে ১০০ রিকোয়েস্ট
    message: 'Too many requests from this IP, please try again later.',
    keyGenerator: (req: Request) => {
        return req.ip || req.socket.remoteAddress || 'unknown';
    }
});

// স্ট্রিক্ট রেট লিমিট (অথেন্টিকেশন রাউটের জন্য)
export const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // ১ ঘন্টা
    max: 10, // প্রতি IP থেকে ১০ রিকোয়েস্ট
    message: 'Too many authentication attempts, please try again after an hour.'
});

// সিকিউরিটি মিডলওয়্যার কম্বাইন
export const securityMiddleware = [
    helmet(({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", "https:", "data:"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        // cast to any to avoid TS type mismatch for certain helmet options
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: { policy: "same-site" },
        dnsPrefetchControl: true,
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
        hsts: true,
        ieNoOpen: true,
        noSniff: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        xssFilter: true,
    } as any)),
    cors(corsOptions),
    hpp(),
    limiter,
];

// XSS স্যানিটাইজেশন মিডলওয়্যার
export const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
    const sanitize = (obj: any): any => {
        if (typeof obj === 'string') {
            return obj
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
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
};

// SQL ইনজেকশন প্রোটেকশন (বেসিক)
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
    const sqlPattern = /(\b(select|insert|update|delete|drop|union|alter|create|truncate|exec|declare|xp_cmdshell)\b)|([';])/i;
    
    const checkValue = (value: any): boolean => {
        if (typeof value === 'string') {
            return sqlPattern.test(value);
        }
        if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(v => checkValue(v));
        }
        return false;
    };

    const bodyCheck = checkValue(req.body);
    const queryCheck = checkValue(req.query);
    const paramsCheck = checkValue(req.params);

    if (bodyCheck || queryCheck || paramsCheck) {
        return res.status(400).json({
            success: false,
            message: 'Potential SQL injection detected'
        });
    }
    next();
};