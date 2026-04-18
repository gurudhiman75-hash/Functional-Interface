import { Request, Response, NextFunction } from "express";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ---------------------------------------------------------------------------
// Redis client — lazy singleton. Falls back to a no-op if env vars are absent
// (e.g. local dev without Upstash configured).
// Required env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
// ---------------------------------------------------------------------------

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

// ---------------------------------------------------------------------------
// Internal limiter factory using a sliding window algorithm.
// Sliding window prevents burst abuse at window boundaries and is accurate
// across restarts and multiple server instances.
// ---------------------------------------------------------------------------

function makeLimiter(maxRequests: number, windowSecs: number, prefix: string) {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSecs} s`),
    prefix: `rl:${prefix}`,
    analytics: false,
  });
}

// ---------------------------------------------------------------------------
// Middleware builder — key = IP + route path
// ---------------------------------------------------------------------------

export function rateLimit(maxRequests: number, windowSecs: number, prefix: string) {
  const limiter = makeLimiter(maxRequests, windowSecs, prefix);

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!limiter) return next(); // Redis not configured — skip (dev fallback)

    const ip =
      (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
      req.ip ??
      "unknown";

    const route = req.baseUrl + req.path;
    const { success, limit, remaining, reset } = await limiter.limit(`${ip}:${route}`);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res.status(429).json({
        error: "Too many requests, please try again later",
        retryAfter,
      });
    }

    return next();
  };
}

// ---------------------------------------------------------------------------
// Pre-configured limiters (drop-in replacements for the old exports)
// ---------------------------------------------------------------------------

/** General API — 100 req / 15 min */
export const apiRateLimit = rateLimit(100, 15 * 60, "api");

/** Payment endpoints (create-order, verify) — 5 req / 10 min */
export const paymentRateLimit = rateLimit(5, 10 * 60, "payment");

/** Auth / login — 10 req / 15 min */
export const loginRateLimit = rateLimit(10, 15 * 60, "login");

/** Razorpay webhook — 200 req / 1 min */
export const webhookRateLimit = rateLimit(200, 60, "webhook");