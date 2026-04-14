import { Request, Response, NextFunction } from "express";

// Simple in-memory rate limiter (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 requests per window

export function rateLimit(maxRequests: number = RATE_LIMIT_MAX_REQUESTS, windowMs: number = RATE_LIMIT_WINDOW_MS) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}-${req.path}`;
    const now = Date.now();
    const windowData = rateLimitStore.get(key);

    if (!windowData || now > windowData.resetTime) {
      // New window or expired window
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (windowData.count >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests, please try again later",
        retryAfter: Math.ceil((windowData.resetTime - now) / 1000)
      });
    }

    windowData.count++;
    next();
  };
}

// Specific rate limits for payment endpoints
export const paymentRateLimit = rateLimit(5, 10 * 60 * 1000); // 5 requests per 10 minutes for payments
export const webhookRateLimit = rateLimit(100, 60 * 1000); // 100 requests per minute for webhooks