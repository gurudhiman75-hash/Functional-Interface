import { Router, type IRouter } from "express";
import { asc, eq, isNull, or, and, sql } from "drizzle-orm";
import { db } from "../lib/db";
import { attempts, questions, responses, sections, topicsGlobal } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { cacheGet, cacheSet, CacheKey, TTL } from "../lib/cache";
import { aggregateSectionsByAttempt, computeSectionRanking, computeSectionTrend, generateRecommendations, trendLabel } from "../lib/section-aggregation";

const router: IRouter = Router();

interface AnalyticsResponse {
  averageScore: number;
  highestScore: number;
  totalAttempts: number;
  recentAttempts: {
    testName: string;
    score: number;
    createdAt: string;
  }[];
}

router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const cached = await cacheGet<AnalyticsResponse>(CacheKey.analytics(userId));
    if (cached) return res.json(cached);

    // Fetch all REAL attempts for the user ordered oldest-first
    // (treat NULL attemptType as REAL for legacy rows)
    const rawAttempts = await db
      .select({
        testId: attempts.testId,
        testName: attempts.testName,
        score: attempts.score,
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
      .map((a) => ({ testName: a.testName, score: a.score, createdAt: a.createdAt.toISOString() }));

    const response: AnalyticsResponse = {
      averageScore,
      highestScore,
      totalAttempts,
      recentAttempts,
    };

    await cacheSet(CacheKey.analytics(userId), response, TTL.ANALYTICS);
    return res.json(response);
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;

// ── Types ────────────────────────────────────────────────────────────────────

interface SectionStat {
  name: string;
  correct: number;
  wrong: number;
  unanswered: number;
  totalQuestions: number;
  accuracy: number;
}

interface SectionAgg {
  totalCorrect: number;
  totalWrong: number;
  totalUnanswered: number;
  totalQuestions: number;
  totalTimeSecs: number;
  attemptCount: number;
}

interface WeakAreaSection {
  section: string;
  accuracy: number;       // 0–100
  avgTimeSecs: number;    // avg seconds spent per question in this section
  totalQuestions: number; // across all counted attempts
  trend?: "improving" | "declining" | "stable";
  trendLabel?: string;
}

interface WeakAreaTopic {
  topic: string;
  section: string;
  accuracy: number;       // 0–100
  totalQuestions: number;
}

interface WeakAreasResponse {
  weakestSections: WeakAreaSection[];
  strongestSections: WeakAreaSection[];
  weakestTopics: WeakAreaTopic[];
  strongestTopics: WeakAreaTopic[];
  recommendations: string[];
}

// ── GET /analytics/weak-areas ────────────────────────────────────────────────
// With ?attemptId: analyses a single attempt.
// Without:        aggregates across all user attempts.

router.get("/weak-areas", authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // ── Per-attempt analysis ─────────────────────────────────────────────────
    const { attemptId } = req.query;
    if (attemptId && typeof attemptId === "string") {
      // Verify the attempt belongs to the authenticated user
      const [attempt] = await db
        .select({ id: attempts.id })
        .from(attempts)
        .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)))
        .limit(1);

      if (!attempt) return res.status(404).json({ error: "Attempt not found" });

      const sectionData = await aggregateSectionsByAttempt(attemptId);
      const { weakestSections, strongestSections } = computeSectionRanking(sectionData);

      // ── Topic-level accuracy for this attempt ────────────────────────────
      const topicAgg = new Map<string, { section: string; topicName: string; correct: number; total: number }>();
      {
        const topicRows = await db
          .select({
            globalTopicId: questions.globalTopicId,
            sectionId: questions.sectionId,
            topicStr: questions.topic,
            sectionStr: questions.section,
            correct: questions.correct,
            selectedOption: responses.selectedOption,
            sectionName: sql<string | null>`${sections.name}`.as("sectionName"),
            globalTopicName: topicsGlobal.name,
          })
          .from(responses)
          .innerJoin(questions, eq(responses.questionId, questions.id))
          .leftJoin(sections, eq(questions.sectionId, sections.id))
          .leftJoin(topicsGlobal, eq(questions.globalTopicId, topicsGlobal.id))
          .where(eq(responses.attemptId, attemptId));

        for (const row of topicRows) {
          const grpSection = row.sectionId ?? row.sectionStr;
          const grpTopic = row.globalTopicId ?? row.topicStr ?? "Unknown";
          const key = `${grpSection}||${grpTopic}`;
          const resolvedSection = row.sectionName ?? row.sectionStr ?? "";
          const resolvedTopic = row.globalTopicName ?? row.topicStr ?? "Unknown";
          const entry = topicAgg.get(key) ?? { section: resolvedSection, topicName: resolvedTopic, correct: 0, total: 0 };
          entry.total++;
          if (row.selectedOption !== null && row.selectedOption === row.correct) entry.correct++;
          topicAgg.set(key, entry);
        }
      }
      const topicResults: WeakAreaTopic[] = Array.from(topicAgg.values()).map((agg) => ({
        topic: agg.topicName,
        section: agg.section,
        accuracy: agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0,
        totalQuestions: agg.total,
      }));
      const topicSorted = [...topicResults].sort((a, b) => a.accuracy - b.accuracy);
      const weakestTopics = topicSorted.slice(0, 5);
      const strongestTopics = [...topicSorted].reverse().slice(0, 5);

      // ── Historical trend: last 5 REAL attempts for the same test ──────────
      // Fetch the testId for the current attempt so we can find sibling attempts.
      const [attemptRow] = await db
        .select({ testId: attempts.testId, createdAt: attempts.createdAt })
        .from(attempts)
        .where(eq(attempts.id, attemptId))
        .limit(1);

      // Map of section → ordered accuracy values (oldest → newest)
      const sectionHistoryMap = new Map<string, number[]>();

      if (attemptRow) {
        const { inArray } = await import("drizzle-orm");
        const { desc } = await import("drizzle-orm");

        // Get last 5 REAL attempts for this test by this user (newest first)
        const history = await db
          .select({ id: attempts.id })
          .from(attempts)
          .where(
            and(
              eq(attempts.userId, userId),
              eq(attempts.testId, attemptRow.testId),
              or(eq(attempts.attemptType, "REAL"), isNull(attempts.attemptType)),
            ),
          )
          .orderBy(desc(attempts.createdAt))
          .limit(5);

        if (history.length >= 2) {
          const historyIds = history.map((h) => h.id).reverse(); // oldest → newest

          // Fetch responses for all history attempts in one query
          const histRows = await db
            .select({
              attemptId: responses.attemptId,
              section: questions.section,
              correct: questions.correct,
              selectedOption: responses.selectedOption,
            })
            .from(responses)
            .innerJoin(questions, eq(responses.questionId, questions.id))
            .where(inArray(responses.attemptId, historyIds));

          // Group by attemptId → section → { total, correct }
          const byAttempt = new Map<string, Map<string, { total: number; correct: number }>>();
          for (const row of histRows) {
            let secMap = byAttempt.get(row.attemptId);
            if (!secMap) { secMap = new Map(); byAttempt.set(row.attemptId, secMap); }
            const entry = secMap.get(row.section) ?? { total: 0, correct: 0 };
            entry.total++;
            if (row.selectedOption !== null && row.selectedOption === row.correct) entry.correct++;
            secMap.set(row.section, entry);
          }

          // Build ordered accuracy arrays per section
          for (const aId of historyIds) {
            const secMap = byAttempt.get(aId);
            if (!secMap) continue;
            for (const [sec, agg] of secMap.entries()) {
              const acc = agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0;
              const arr = sectionHistoryMap.get(sec) ?? [];
              arr.push(acc);
              sectionHistoryMap.set(sec, arr);
            }
          }
        }
      }

      const AVG_TIME_THRESHOLD_SECS = 120; // >2 min/question = slow

      // Map to the WeakAreaSection shape expected by this route's response type
      const toWeakArea = (m: (typeof weakestSections)[number]): WeakAreaSection => {
        const accuracies = sectionHistoryMap.get(m.section) ?? [];
        const trend = computeSectionTrend(accuracies);
        return {
          section: m.section,
          accuracy: m.accuracy,
          avgTimeSecs: m.avgTime,
          totalQuestions: m.total,
          trend,
          trendLabel: trendLabel(trend),
        };
      };

      // All sections (weak + strong) are passed to generateRecommendations;
      // deduplicate by section name before passing.
      const allMetrics = [...weakestSections, ...strongestSections].filter(
        (s, i, arr) => arr.findIndex((x) => x.section === s.section) === i,
      );
      const recommendations = generateRecommendations(allMetrics);
      if (recommendations.length === 0) {
        recommendations.push("Good attempt! Keep practising to maintain and improve your scores.");
      }

      return res.json({
        weakestSections: weakestSections.map(toWeakArea),
        strongestSections: strongestSections.map(toWeakArea),
        weakestTopics,
        strongestTopics,
        recommendations,
      } satisfies WeakAreasResponse);
    }
    // ── End per-attempt branch ───────────────────────────────────────────────

    const cached = await cacheGet<WeakAreasResponse>(CacheKey.analyticsWeakAreas(userId));
    if (cached) return res.json(cached);

    // ── 1. Pull all REAL attempts with sectionStats + sectionTimeSpent ──────
    const userAttempts = await db
      .select({
        id: attempts.id,
        sectionStats: attempts.sectionStats,
        sectionTimeSpent: attempts.sectionTimeSpent,
      })
      .from(attempts)
      .where(
        and(
          eq(attempts.userId, userId),
          or(eq(attempts.attemptType, "REAL"), isNull(attempts.attemptType)),
        ),
      );

    if (userAttempts.length === 0) {
      const empty: WeakAreasResponse = {
        weakestSections: [],
        strongestSections: [],
        recommendations: ["Complete at least one exam to see your weak area analysis."],
      };
      return res.json(empty);
    }

    // ── 2. Aggregate sectionStats across all attempts ────────────────────────
    const sectionAgg = new Map<string, SectionAgg>();

    for (const attempt of userAttempts) {
      const stats = attempt.sectionStats as SectionStat[] | null;
      const timeSpent = attempt.sectionTimeSpent as { name: string; minutesSpent: number }[] | null;

      // Build a time-per-section lookup for this attempt
      const timeMap = new Map<string, number>();
      if (Array.isArray(timeSpent)) {
        for (const t of timeSpent) {
          timeMap.set(t.name, Math.round(t.minutesSpent * 60));
        }
      }

      if (!Array.isArray(stats)) continue;

      for (const s of stats) {
        if (!s.name) continue;
        const agg = sectionAgg.get(s.name) ?? {
          totalCorrect: 0,
          totalWrong: 0,
          totalUnanswered: 0,
          totalQuestions: 0,
          totalTimeSecs: 0,
          attemptCount: 0,
        };
        agg.totalCorrect += s.correct;
        agg.totalWrong += s.wrong;
        agg.totalUnanswered += s.unanswered;
        agg.totalQuestions += s.totalQuestions;
        agg.totalTimeSecs += timeMap.get(s.name) ?? 0;
        agg.attemptCount++;
        sectionAgg.set(s.name, agg);
      }
    }

    // ── 3. Compute per-section accuracy & avg time ───────────────────────────
    const attemptIds = userAttempts.map((a) => a.id);

    // For each section: avg time per question = totalTimeSecs / totalQuestions
    const sectionResults: WeakAreaSection[] = Array.from(sectionAgg.entries()).map(
      ([section, agg]) => {
        const answered = agg.totalCorrect + agg.totalWrong;
        const accuracy = answered > 0 ? Math.round((agg.totalCorrect / answered) * 100) : 0;
        const avgTimeSecs =
          agg.totalQuestions > 0
            ? Math.round(agg.totalTimeSecs / agg.totalQuestions)
            : 0;
        return { section, accuracy, avgTimeSecs, totalQuestions: agg.totalQuestions };
      },
    );

    // ── 4. Topic-level accuracy via responses + questions join ───────────────
    const aggTopicMap = new Map<string, { section: string; topicName: string; correct: number; total: number }>();

    if (attemptIds.length > 0) {
      const { inArray } = await import("drizzle-orm");
      const BATCH = 500;
      for (let i = 0; i < attemptIds.length; i += BATCH) {
        const batch = attemptIds.slice(i, i + BATCH);
        const rows = await db
          .select({
            globalTopicId: questions.globalTopicId,
            sectionId: questions.sectionId,
            topicStr: questions.topic,
            sectionStr: questions.section,
            selectedOption: responses.selectedOption,
            correct: questions.correct,
            sectionName: sql<string | null>`${sections.name}`.as("sectionName"),
            globalTopicName: topicsGlobal.name,
          })
          .from(responses)
          .innerJoin(questions, eq(responses.questionId, questions.id))
          .leftJoin(sections, eq(questions.sectionId, sections.id))
          .leftJoin(topicsGlobal, eq(questions.globalTopicId, topicsGlobal.id))
          .where(inArray(responses.attemptId, batch));

        for (const row of rows) {
          const grpSection = row.sectionId ?? row.sectionStr;
          const grpTopic = row.globalTopicId ?? row.topicStr ?? "Unknown";
          const key = `${grpSection}||${grpTopic}`;
          const resolvedSection = row.sectionName ?? row.sectionStr ?? "";
          const resolvedTopic = row.globalTopicName ?? row.topicStr ?? "Unknown";
          const entry = aggTopicMap.get(key) ?? { section: resolvedSection, topicName: resolvedTopic, correct: 0, total: 0 };
          entry.total++;
          if (row.selectedOption !== null && row.selectedOption === row.correct) entry.correct++;
          aggTopicMap.set(key, entry);
        }
      }
    }

    const aggTopicResults: WeakAreaTopic[] = Array.from(aggTopicMap.values()).map((agg) => ({
      topic: agg.topicName,
      section: agg.section,
      accuracy: agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0,
      totalQuestions: agg.total,
    }));
    const aggTopicSorted = [...aggTopicResults].sort((a, b) => a.accuracy - b.accuracy);
    const weakestTopics = aggTopicSorted.slice(0, 5);
    const strongestTopics = [...aggTopicSorted].reverse().slice(0, 5);

    // Top incorrect topics for recommendations
    const topIncorrectTopics = aggTopicSorted
      .slice(0, 3)
      .map((t) => `${t.topic} (${t.section})`);

    // ── 5. Sort sections ─────────────────────────────────────────────────────
    const sorted = [...sectionResults].sort((a, b) => a.accuracy - b.accuracy);
    const weakestSections = sorted.slice(0, 5);
    const strongestSections = [...sorted].reverse().slice(0, 5);

    // ── 6. Generate recommendations ──────────────────────────────────────────
    const recommendations: string[] = [];

    for (const s of weakestSections.slice(0, 3)) {
      if (s.accuracy < 50) {
        recommendations.push(
          `Your accuracy in "${s.section}" is ${s.accuracy}% — focus on concept revision and practice more questions in this area.`,
        );
      } else if (s.accuracy < 70) {
        recommendations.push(
          `"${s.section}" accuracy is ${s.accuracy}% — aim to improve by reviewing mistakes from past attempts.`,
        );
      }
    }

    for (const topic of topIncorrectTopics) {
      if (!recommendations.some((r) => r.includes(`"${topic}"`))) {
        recommendations.push(
          `"${topic}" has the most incorrect responses across your attempts — dedicate extra practice time here.`,
        );
      }
    }

    for (const s of sectionResults) {
      if (s.avgTimeSecs > 0 && s.avgTimeSecs > 120) {
        recommendations.push(
          `You're spending over ${Math.round(s.avgTimeSecs / 60)} min per question in "${s.section}" — work on speed through timed drills.`,
        );
        break; // one time-based recommendation is enough
      }
    }

    if (recommendations.length === 0 && strongestSections.length > 0) {
      recommendations.push(
        `Great performance across sections! Keep practising to maintain your accuracy above ${strongestSections[0].accuracy}%.`,
      );
    }

    const result: WeakAreasResponse = {
      weakestSections,
      strongestSections,
      weakestTopics,
      strongestTopics,
      recommendations,
    };

    await cacheSet(CacheKey.analyticsWeakAreas(userId), result, TTL.ANALYTICS_WEAK_AREAS);
    return res.json(result);
  } catch (error) {
    console.error("Weak areas analytics error:", error);
    return res.status(500).json({ error: "Failed to compute weak area analysis" });
  }
});
