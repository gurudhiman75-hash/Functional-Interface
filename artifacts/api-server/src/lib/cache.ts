import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Redis client — same env vars as the rate limiter.
// Returns null when env vars are absent so caching degrades gracefully in dev.
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
// TTLs (seconds)
// ---------------------------------------------------------------------------

export const TTL = {
  TESTS_LIST: 120,          // test catalogue changes rarely
  TEST_DETAIL: 120,
  LEADERBOARD: 60,          // refreshed after every attempt
  ANALYTICS: 300,           // per-user; 5 min is fine
  ANALYTICS_WEAK_AREAS: 300,
  DAILY_CHALLENGE: 3600,    // re-validated per remaining-day calc anyway
} as const;

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Read a cached value. Returns `null` on miss or when Redis is unavailable.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    if (!redis) return null;
    const raw = await redis.get<T>(key);
    return raw ?? null;
  } catch (err) {
    console.warn("[cache] get error", key, err);
    return null;
  }
}

/**
 * Write a value with an expiry (seconds). Silently no-ops when Redis is
 * unavailable so cache failures never break the request path.
 */
export async function cacheSet(key: string, value: unknown, ttlSecs: number): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) return;
    await redis.set(key, JSON.stringify(value), { ex: ttlSecs });
  } catch (err) {
    console.warn("[cache] set error", key, err);
  }
}

/**
 * Delete one or more keys. Used for cache invalidation on mutations.
 */
export async function cacheDel(...keys: string[]): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis || keys.length === 0) return;
    await redis.del(...keys);
  } catch (err) {
    console.warn("[cache] del error", keys, err);
  }
}

/**
 * Delete all keys matching a pattern (uses SCAN, safe for production).
 */
export async function cacheDelPattern(pattern: string): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) return;
    let cursor = 0;
    do {
      const [next, keys] = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = Number(next);
      if (keys.length > 0) await redis.del(...keys);
    } while (cursor !== 0);
  } catch (err) {
    console.warn("[cache] delPattern error", pattern, err);
  }
}

// ---------------------------------------------------------------------------
// Named key builders — single place to own key shapes
// ---------------------------------------------------------------------------

export const CacheKey = {
  testsList: () => "tests:list",
  testDetail: (testId: string) => `tests:detail:${testId}`,
  leaderboard: (testId: string) => `leaderboard:${testId}`,
  analytics: (userId: string) => `analytics:${userId}`,
  analyticsWeakAreas: (userId: string) => `analytics:weak-areas:${userId}`,
  dailyChallenge: (date: string) => `daily-challenge:${date}`,
} as const;
