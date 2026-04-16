import { Router, type IRouter } from "express";
import { asc, eq, isNull, or, and } from "drizzle-orm";
import { db } from "../lib/db";
import { attempts } from "@workspace/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

interface AnalyticsResponse {
  averageScore: number;
  highestScore: number;
  totalAttempts: number;
  recentAttempts: {
    testName: string;
    score: number;
    date: string;
  }[];
}

router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // Fetch all REAL attempts for the user ordered oldest-first
    // (treat NULL attemptType as REAL for legacy rows)
    const rawAttempts = await db
      .select({
        testId: attempts.testId,
        testName: attempts.testName,
        score: attempts.score,
        date: attempts.date,
        createdAt: attempts.createdAt,
      })
      .from(attempts)
      .where(
        and(
          eq(attempts.userId, userId),
          or(eq(attempts.attemptType, "REAL"), isNull(attempts.attemptType)),
        ),
      )
      .orderBy(asc(attempts.createdAt));

    // Deduplicate: keep only the FIRST attempt per testId
    const seenTests = new Set<string>();
    const firstPerTest: typeof rawAttempts = [];
    for (const attempt of rawAttempts) {
      if (!seenTests.has(attempt.testId)) {
        seenTests.add(attempt.testId);
        firstPerTest.push(attempt);
      }
    }

    const scores = firstPerTest.map((a) => a.score);
    const averageScore = scores.length
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : 0;
    const highestScore = scores.length ? Math.max(...scores) : 0;
    const totalAttempts = firstPerTest.length;

    // Recent = last 10 in completion order
    const recentAttempts = firstPerTest
      .slice(-10)
      .reverse()
      .map((a) => ({ testName: a.testName, score: a.score, date: a.date }));

    const response: AnalyticsResponse = {
      averageScore,
      highestScore,
      totalAttempts,
      recentAttempts,
    };

    return res.json(response);
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
