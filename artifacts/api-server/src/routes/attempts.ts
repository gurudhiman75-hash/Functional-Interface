import { Router, type IRouter } from "express";
import { eq, and, inArray, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "../lib/db";
import { attempts, questions, responses, tests } from "@workspace/db";
import { TestAttempt } from "@workspace/api-zod";
import { authenticate } from "../middlewares/auth";
import { refreshLeaderboard } from "../lib/refresh-leaderboard";
import { cacheDel, CacheKey } from "../lib/cache";
import { getQuestionColumnState } from "../lib/question-columns";

const router: IRouter = Router();

router.get("/", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const userAttempts = await db.select().from(attempts).where(eq(attempts.userId, userId));
  return res.json(userAttempts.map(TestAttempt.parse));
});

router.get("/:id", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, req.params.id), eq(attempts.userId, userId)))
    .limit(1);

  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  return res.json(TestAttempt.parse(attempt));
});

/**
 * POST /attempts
 *
 * Accepts raw response data from the client.
 * Fetches correct answers from the DB, calculates score server-side,
 * and saves the attempt + responses atomically.
 *
 * Body:
 *   testId        — string
 *   testName      — string
 *   category      — string
 *   attemptType   — "REAL" | "PRACTICE"
 *   timeSpent     — number (minutes)
 *   responses     — { questionId: number, selectedOption: number | null, timeTaken: number }[]
 *   flags         — Record<number, boolean>  (optional)
 *   sectionTimeSpent — { name: string, minutesSpent: number }[]  (optional)
 *   originalAttemptId — string  (optional, practice mode)
 */
router.post("/", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
  const {
    testId,
    testName,
    category,
    attemptType,
    timeSpent,
    responses: responseItems,
    flags = {},
    sectionTimeSpent,
  } = req.body as {
    testId: string;
    testName: string;
    category: string;
    attemptType: "REAL" | "PRACTICE";
    timeSpent: number;
    responses: { questionId: number; selectedOption: number | null; timeTaken: number }[];
    flags?: Record<number, boolean>;
    sectionTimeSpent?: { name: string; minutesSpent: number }[];
    originalAttemptId?: string;
  };

  if (!testId || typeof testId !== "string") {
    return res.status(400).json({ error: "Missing testId" });
  }
  if (!testName || typeof testName !== "string") {
    return res.status(400).json({ error: "Missing testName" });
  }
  if (!category || typeof category !== "string") {
    return res.status(400).json({ error: "Missing category" });
  }
  if (attemptType !== "REAL" && attemptType !== "PRACTICE") {
    return res.status(400).json({ error: "attemptType must be REAL or PRACTICE" });
  }
  if (typeof timeSpent !== "number" || timeSpent < 0) {
    return res.status(400).json({ error: "timeSpent must be a non-negative number" });
  }
  if (!Array.isArray(responseItems)) {
    return res.status(400).json({ error: "responses must be an array" });
  }

  // Verify the test exists in the DB (avoids FK violation on insert)
  const [testRow] = await db
    .select({ id: tests.id })
    .from(tests)
    .where(eq(tests.id, testId))
    .limit(1);
  if (!testRow) {
    return res.status(404).json({ error: `Test "${testId}" not found in database. Ensure the test has been synced before taking it.` });
  }

  // Fetch authoritative question data from the database
  const questionIds = responseItems.map((r) => r.questionId);
  const columns = await getQuestionColumnState();
  const dbQuestions: {
    id: number; correct: number; section: string; text: string;
    options: unknown; explanation: string;
    textHi?: string | null; optionsHi?: unknown; explanationHi?: string | null;
    textPa?: string | null; optionsPa?: unknown; explanationPa?: string | null;
  }[] =
    questionIds.length > 0
      ? (await db.execute(sql`
          SELECT
            id, correct, section, text, options, explanation
            ${columns.hasTextHi ? sql`, text_hi AS "textHi"` : sql`, NULL::text AS "textHi"`}
            ${columns.hasOptionsHi ? sql`, options_hi AS "optionsHi"` : sql`, NULL::jsonb AS "optionsHi"`}
            ${columns.hasExplanationHi ? sql`, explanation_hi AS "explanationHi"` : sql`, NULL::text AS "explanationHi"`}
            ${columns.hasTextPa ? sql`, text_pa AS "textPa"` : sql`, NULL::text AS "textPa"`}
            ${columns.hasOptionsPa ? sql`, options_pa AS "optionsPa"` : sql`, NULL::jsonb AS "optionsPa"`}
            ${columns.hasExplanationPa ? sql`, explanation_pa AS "explanationPa"` : sql`, NULL::text AS "explanationPa"`}
          FROM questions
          WHERE id IN (${sql.join(questionIds.map(id => sql`${id}`), sql`, `)})
          AND (
            test_id = ${testId}
            OR id IN (SELECT question_id FROM test_questions WHERE test_id = ${testId})
          )
        `) as any[])
      : [];

  const questionMap = new Map(dbQuestions.map((q) => [q.id, q]));

  // Build answer map from client payload
  const answerMap = new Map(
    responseItems.map((r) => [r.questionId, r.selectedOption ?? null]),
  );

  // ── Score calculation (server-authoritative) ────────────────────────
  let correct = 0;
  let wrong = 0;

  for (const q of dbQuestions) {
    const selected = answerMap.get(q.id) ?? null;
    if (selected === null) continue; // unanswered
    if (selected === q.correct) {
      correct++;
    } else {
      wrong++;
    }
  }

  const totalQuestions = dbQuestions.length;
  const unanswered = totalQuestions - correct - wrong;
  const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  // ── Section stats ────────────────────────────────────────────────────
  const sectionMap = new Map<
    string,
    { correct: number; wrong: number; unanswered: number; totalQuestions: number }
  >();

  for (const q of dbQuestions) {
    if (!sectionMap.has(q.section)) {
      sectionMap.set(q.section, { correct: 0, wrong: 0, unanswered: 0, totalQuestions: 0 });
    }
    const s = sectionMap.get(q.section)!;
    s.totalQuestions++;
    const selected = answerMap.get(q.id) ?? null;
    if (selected === null) {
      s.unanswered++;
    } else if (selected === q.correct) {
      s.correct++;
    } else {
      s.wrong++;
    }
  }

  const sectionStats = Array.from(sectionMap.entries()).map(([name, s]) => {
    const answered = s.correct + s.wrong;
    return {
      name,
      correct: s.correct,
      wrong: s.wrong,
      unanswered: s.unanswered,
      totalQuestions: s.totalQuestions,
      accuracy: answered > 0 ? Math.round((s.correct / answered) * 100) : 0,
    };
  });

  // ── Question review (built from DB data + client selections) ─────────
  const questionReview = dbQuestions.map((q) => ({
    questionId: q.id,
    section: q.section,
    text: q.text,
    options: q.options,
    ...(q.textHi ? { textHi: q.textHi } : {}),
    ...(q.textPa ? { textPa: q.textPa } : {}),
    ...(q.optionsHi ? { optionsHi: q.optionsHi } : {}),
    ...(q.optionsPa ? { optionsPa: q.optionsPa } : {}),
    ...(q.explanationHi ? { explanationHi: q.explanationHi } : {}),
    ...(q.explanationPa ? { explanationPa: q.explanationPa } : {}),
    selected: answerMap.get(q.id) ?? null,
    correct: q.correct,
    flagged: Boolean(flags[q.id]),
    explanation: q.explanation,
  }));

  // ── Persist attempt + responses atomically ────────────────────────────
  const attemptId = randomUUID();

  const result = await db.transaction(async (tx) => {
    const [savedAttempt] = await tx
      .insert(attempts)
      .values({
        id: attemptId,
        userId,
        testId,
        testName,
        category,
        score,
        correct,
        wrong,
        unanswered,
        totalQuestions,
        timeSpent,
        attemptType,
        sectionStats,
        sectionTimeSpent: sectionTimeSpent ?? null,
        questionReview,
        createdAt: new Date(),
        date: new Date().toISOString().split("T")[0],
      })
      .returning();

    if (responseItems.length > 0) {
      // Only insert responses for questions that exist in the DB (avoids FK violation)
      const validQuestionIds = new Set(dbQuestions.map((q) => q.id));
      const responseRows = responseItems
        .filter((r) => validQuestionIds.has(r.questionId))
        .map(({ questionId, selectedOption, timeTaken }) => ({
          attemptId,
          questionId,
          selectedOption: selectedOption ?? null,
          timeTaken: timeTaken ?? 0,
        }));
      if (responseRows.length > 0) {
        await tx.insert(responses).values(responseRows);
      }
    }

    return savedAttempt;
  });

  // Refresh leaderboard asynchronously — don't block the response
  refreshLeaderboard(testId, db).catch((err) =>
    console.error("[leaderboard] refresh failed for test", testId, err),
  );

  // Invalidate cached data that depends on this attempt
  const attemptUserId = result.userId;
  cacheDel(
    CacheKey.leaderboard(testId),
    CacheKey.analytics(attemptUserId),
    CacheKey.analyticsWeakAreas(attemptUserId),
  ).catch(() => {});

  return res.status(201).json(TestAttempt.parse(result));
  } catch (err) {
    console.error("[attempts] POST /attempts error:", err);
    return res.status(500).json({ error: "Failed to save attempt", detail: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
