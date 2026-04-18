import { Router } from "express";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { tests, leaderboard } from "@workspace/db";
import { cacheGet, cacheSet, CacheKey, TTL } from "../lib/cache";

const router = Router();

/**
 * GET /api/daily-challenge
 *
 * Returns the daily challenge test for the current UTC day.
 * Selection is purely deterministic:
 *   dayIndex = floor(Date.now() / 86400000) % totalFreeTests
 * The same result is returned for the entire UTC day with no DB writes.
 *
 * Response: { testId, testName, date, totalParticipants }
 *   totalParticipants — number of leaderboard entries for today's test (optional context).
 */
router.get("/", async (_req, res) => {
  try {
    const todayUtc = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const cacheKey = CacheKey.dailyChallenge(todayUtc);

    type DailyPayload = { testId: string; testName: string; date: string; totalParticipants: number };
    const cached = await cacheGet<DailyPayload>(cacheKey);
    if (cached) return res.json(cached);

    // Fetch all free test IDs ordered deterministically (by id)
    const freeTests = await db
      .select({ id: tests.id, name: tests.name })
      .from(tests)
      .where(and(eq(tests.access, "free")))
      .orderBy(asc(tests.id));

    if (freeTests.length === 0) {
      return res.status(404).json({ error: "No free tests available" });
    }

    // Deterministic daily rotation based on UTC day number
    const dayNumber = Math.floor(Date.now() / 86_400_000);
    const picked = freeTests[dayNumber % freeTests.length];

    // Count participants for this test from the leaderboard table
    const lbRows = await db
      .select({ userId: leaderboard.userId })
      .from(leaderboard)
      .where(eq(leaderboard.testId, picked.id));

    const payload: DailyPayload = {
      testId: picked.id,
      testName: picked.name,
      date: todayUtc,
      totalParticipants: lbRows.length,
    };

    // Cache until midnight UTC (remaining seconds in the day)
    const now = Date.now();
    const midnight = (Math.floor(now / 86_400_000) + 1) * 86_400_000;
    const remainingSecs = Math.max(60, Math.floor((midnight - now) / 1000));
    await cacheSet(cacheKey, payload, remainingSecs);

    return res.json(payload);
  } catch (err) {
    console.error("[daily-challenge] error", err);
    return res.status(500).json({ error: "Could not load daily challenge" });
  }
}

);

export default router;
