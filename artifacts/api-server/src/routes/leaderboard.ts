import { Router } from "express";
import { and, eq, isNull, or } from "drizzle-orm";
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

    // Fetch only REAL attempts for the test (treat NULL attemptType as REAL for legacy rows)
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
      .where(
        and(
          eq(attempts.testId, testId),
          or(eq(attempts.attemptType, "REAL"), isNull(attempts.attemptType)),
        ),
      );

    // Per user: keep the FIRST attempt only (earliest createdAt)
    const firstByUser = new Map<
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
      const existing = firstByUser.get(attempt.userId);
      if (!existing || attempt.createdAt < existing.createdAt) {
        firstByUser.set(attempt.userId, attempt);
      }
    }

    // Sort by score desc, then by createdAt asc for tiebreaker
    const sorted = Array.from(firstByUser.values()).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    // Take top 10 and add ranks
    const leaderboard = sorted.slice(0, 10).map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      userName: row.userName,
      score: row.score,
      testName: row.testName,
      category: row.category,
      createdAt: row.createdAt.toISOString(),
    }));

    let currentUserRank: number | null = null;

    if (currentUserId && firstByUser.has(currentUserId)) {
      const rankIndex = sorted.findIndex((entry) => entry.userId === currentUserId);
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
