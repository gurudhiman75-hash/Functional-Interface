import { Router } from "express";
import { asc, count, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { leaderboard } from "@workspace/db";
import { auth } from "../lib/firebase-admin";
import { cacheGet, cacheSet, CacheKey, TTL } from "../lib/cache";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const testId = String(req.query.testId ?? "").trim();
    if (!testId) {
      return res.status(400).json({ error: "Missing testId query parameter" });
    }

    const authHeader = req.headers.authorization;
    let currentUserId: string | null = null;

    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const decodedToken = await auth.verifyIdToken(token);
        currentUserId = String(decodedToken.uid);
      } catch {
        currentUserId = null;
      }
    }

    // Leaderboard top-10 + totalParticipants is cached; currentUserRank is appended per-request
    // from the same cached row data so we don't need a separate user query.
    const cacheKey = CacheKey.leaderboard(testId);

    type CachedLeaderboard = { top10: LeaderboardRow[]; totalParticipants: number };
    type LeaderboardRow = { rank: number; userId: string; userName: string; score: number; createdAt: string };
    let cached = await cacheGet<CachedLeaderboard>(cacheKey);

    if (!cached) {
      // Single query: ORDER BY rank, no LIMIT so we get the full count cheaply
      const rows = await db
        .select()
        .from(leaderboard)
        .where(eq(leaderboard.testId, testId))
        .orderBy(asc(leaderboard.rank));

      const top10 = rows.slice(0, 10).map((row) => ({
        rank: row.rank,
        userId: row.userId,
        userName: row.userName,
        score: row.score,
        createdAt: row.createdAt.toISOString(),
      }));
      cached = { top10, totalParticipants: rows.length };
      await cacheSet(cacheKey, cached, TTL.LEADERBOARD);
    }

    const { top10, totalParticipants } = cached;

    let currentUserRank: number | null = null;
    if (currentUserId) {
      const userEntry = top10.find((r) => r.userId === currentUserId);
      if (userEntry) currentUserRank = userEntry.rank;
    }

    return res.json({ leaderboard: top10, currentUserRank, totalParticipants });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return res.status(500).json({ error: "Could not load leaderboard" });
  }
});

export default router;
