import { Router, type IRouter } from "express";
import { eq, desc, avg, max, count } from "drizzle-orm";
import { db } from "../lib/db";
import { attempts, tests } from "@workspace/db";
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

    // Compute statistics in the database and fetch only the latest 10 attempts
    const statsResult = await db
      .select({
        averageScore: avg(attempts.score).as("averageScore"),
        highestScore: max(attempts.score).as("highestScore"),
        totalAttempts: count().as("totalAttempts"),
      })
      .from(attempts)
      .where(eq(attempts.userId, userId));

    const stats = statsResult[0] ?? {
      averageScore: 0,
      highestScore: 0,
      totalAttempts: 0,
    };

    const recentAttempts = await db
      .select({
        testName: attempts.testName,
        score: attempts.score,
        date: attempts.date,
      })
      .from(attempts)
      .where(eq(attempts.userId, userId))
      .orderBy(desc(attempts.createdAt))
      .limit(10);

    const averageScore = stats.averageScore ? Math.round(Number(stats.averageScore)) : 0;
    const highestScore = stats.highestScore ? Number(stats.highestScore) : 0;
    const totalAttempts = Number(stats.totalAttempts ?? 0);

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
