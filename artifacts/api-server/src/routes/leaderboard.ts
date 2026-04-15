import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { attempts, users } from "@workspace/db";
import { auth } from "../lib/firebase-admin";

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

    // Fetch all attempts for the test with user names
    const allAttempts = await db
      .select({
        userId: attempts.userId,
        userName: users.name,
        score: attempts.score,
        testName: attempts.testName,
        category: attempts.category,
        createdAt: attempts.createdAt,
      })
      .from(attempts)
      .innerJoin(users, eq(attempts.userId, users.id))
      .where(eq(attempts.testId, testId));

    // Group by user and get best score (highest score, earliest attempt)
    const bestByUser = new Map<
      string,
      {
        userId: string;
        userName: string;
        score: number;
        testName: string;
        category: string;
        createdAt: Date;
      }
    >();

    for (const attempt of allAttempts) {
      const key = attempt.userId;
      const existing = bestByUser.get(key);
      if (
        !existing ||
        attempt.score > existing.score ||
        (attempt.score === existing.score && attempt.createdAt < existing.createdAt)
      ) {
        bestByUser.set(key, attempt);
      }
    }

    // Sort by score desc, then by createdAt asc for tiebreaker
    const sortedBest = Array.from(bestByUser.values()).sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    // Take top 10 and add ranks
    const leaderboard = sortedBest.slice(0, 10).map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      userName: row.userName,
      score: row.score,
      testName: row.testName,
      category: row.category,
      createdAt: row.createdAt.toISOString(),
    }));

    let currentUserRank: number | null = null;

    if (currentUserId && bestByUser.has(currentUserId)) {
      const rankIndex = sortedBest.findIndex((entry) => entry.userId === currentUserId);
      if (rankIndex !== -1) {
        currentUserRank = rankIndex + 1;
      }
    }

    return res.json({ leaderboard, currentUserRank });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return res.status(500).json({ error: "Could not load leaderboard" });
  }
});

export default router;
