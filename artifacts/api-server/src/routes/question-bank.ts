import { Router, type IRouter } from "express";
import { and, asc, count, desc, eq, ilike, inArray, max, or, sql } from "drizzle-orm";
import { db } from "../lib/db";
import { questions, testQuestions, tests, sections, topicsGlobal } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";

const router: IRouter = Router();

// ── Types ─────────────────────────────────────────────────────────────────────

type Difficulty = "Easy" | "Medium" | "Hard";

interface QuestionBankItem {
  id: number;
  text: string;
  section: string;
  sectionId: string | null;
  topic: string;
  globalTopicId: string;
  difficulty: Difficulty | null;
  options: unknown;
  correct: number;
  explanation: string;
  textHi?: string | null;
  textPa?: string | null;
  optionsHi?: unknown;
  optionsPa?: unknown;
  explanationHi?: string | null;
  explanationPa?: string | null;
  createdAt: Date;
  usageCount: number;
  lastUsedAt: Date | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build usage stats for a list of question ids */
async function fetchUsageStats(
  questionIds: number[],
): Promise<Map<number, { usageCount: number; lastUsedAt: Date | null }>> {
  if (questionIds.length === 0) return new Map();
  const rows = await db
    .select({
      questionId: testQuestions.questionId,
      usageCount: count(testQuestions.id),
      lastUsedAt: max(testQuestions.addedAt),
    })
    .from(testQuestions)
    .where(inArray(testQuestions.questionId, questionIds))
    .groupBy(testQuestions.questionId);

  const map = new Map<number, { usageCount: number; lastUsedAt: Date | null }>();
  for (const r of rows) {
    map.set(r.questionId, { usageCount: r.usageCount, lastUsedAt: r.lastUsedAt as Date | null });
  }
  return map;
}

// ── GET /question-bank ────────────────────────────────────────────────────────
/** Paginated list with filters and usage stats */
router.get("/question-bank", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.uid);

    const page = Math.max(1, parseInt((req.query.page as string) ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt((req.query.pageSize as string) ?? "20", 10)));
    const offset = (page - 1) * pageSize;

    const searchQ = req.query.search as string | undefined;
    const sectionQ = req.query.section as string | undefined;
    const topicQ = req.query.topic as string | undefined;
    const difficultyQ = req.query.difficulty as Difficulty | undefined;

    // Build filter conditions
    const conditions: ReturnType<typeof eq>[] = [];
    if (searchQ?.trim()) {
      conditions.push(
        or(
          ilike(questions.text, `%${searchQ.trim()}%`),
          ilike(questions.explanation, `%${searchQ.trim()}%`),
        ) as ReturnType<typeof eq>,
      );
    }
    if (sectionQ?.trim()) {
      conditions.push(eq(questions.section, sectionQ.trim()) as ReturnType<typeof eq>);
    }
    if (topicQ?.trim()) {
      conditions.push(eq(questions.globalTopicId, topicQ.trim()) as ReturnType<typeof eq>);
    }
    if (difficultyQ && ["Easy", "Medium", "Hard"].includes(difficultyQ)) {
      conditions.push(eq(questions.difficulty, difficultyQ) as ReturnType<typeof eq>);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalRows] = await Promise.all([
      db
        .select()
        .from(questions)
        .where(whereClause)
        .orderBy(desc(questions.createdAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ total: count() })
        .from(questions)
        .where(whereClause),
    ]);

    const usageMap = await fetchUsageStats(rows.map((r) => r.id));

    const items: QuestionBankItem[] = rows.map((q) => {
      const usage = usageMap.get(q.id) ?? { usageCount: 0, lastUsedAt: null };
      return {
        ...q,
        usageCount: usage.usageCount,
        lastUsedAt: usage.lastUsedAt,
      };
    });

    res.json({
      items,
      total: totalRows[0]?.total ?? 0,
      page,
      pageSize,
    });
  } catch (err: any) {
    if (err.message === "forbidden") return res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] GET /question-bank", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /question-bank/:id ────────────────────────────────────────────────────
router.get("/question-bank/:id", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.uid);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [q] = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
    if (!q) return res.status(404).json({ error: "Not found" });

    const usageMap = await fetchUsageStats([id]);
    const usage = usageMap.get(id) ?? { usageCount: 0, lastUsedAt: null };

    res.json({ ...q, ...usage });
  } catch (err: any) {
    if (err.message === "forbidden") return res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] GET /question-bank/:id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /question-bank/:id/tests ──────────────────────────────────────────────
/** Returns list of tests this question is used in */
router.get("/question-bank/:id/tests", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.uid);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const rows = await db
      .select({
        testId: testQuestions.testId,
        addedAt: testQuestions.addedAt,
        testName: tests.name,
        testCategory: tests.category,
        testDifficulty: tests.difficulty,
      })
      .from(testQuestions)
      .innerJoin(tests, eq(testQuestions.testId, tests.id))
      .where(eq(testQuestions.questionId, id))
      .orderBy(desc(testQuestions.addedAt));

    res.json(rows);
  } catch (err: any) {
    if (err.message === "forbidden") return res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] GET /question-bank/:id/tests", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /question-bank ───────────────────────────────────────────────────────
/** Create a bank question (standalone — not necessarily in a test) */
router.post("/question-bank", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.uid);
    const {
      text, options, correct, section, topic, globalTopicId, explanation, difficulty,
      textHi, optionsHi, explanationHi, textPa, optionsPa, explanationPa,
      sectionId, topicId,
    } = req.body;

    if (!text || !options || correct === undefined || !section || !globalTopicId || !explanation) {
      return res.status(400).json({ error: "Missing required fields: text, options, correct, section, globalTopicId, explanation" });
    }
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ error: "options must be an array of 4 strings" });
    }
    if (typeof correct !== "number" || correct < 0 || correct > 3) {
      return res.status(400).json({ error: "correct must be 0-3" });
    }
    if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({ error: "difficulty must be Easy, Medium, or Hard" });
    }

    // Bank questions use a placeholder testId to satisfy NOT NULL FK
    // We use a convention: bank questions have testId = "__bank__"
    // Note: this requires a tests row with id="__bank__" or we can use the globalTopicId test
    // Actually, looking at the schema, testId is NOT NULL. We need a real test reference.
    // For standalone bank questions, we'll use testId = "" (empty) if we modify schema,
    // but since it's NOT NULL with no default, let's accept an optional testId (defaults to "").
    // Better: let the caller pass a testId (or we accept "" and set it to empty string via the schema default "")
    const testId = req.body.testId ?? "";

    const [inserted] = await db
      .insert(questions)
      .values({
        testId,
        text: text.trim(),
        options,
        correct,
        section: section.trim(),
        sectionId: sectionId ?? null,
        topic: topic?.trim() ?? "General",
        topicId: topicId ?? null,
        globalTopicId,
        explanation: explanation.trim(),
        difficulty: difficulty ?? null,
        textHi: textHi ?? null,
        optionsHi: optionsHi ?? null,
        explanationHi: explanationHi ?? null,
        textPa: textPa ?? null,
        optionsPa: optionsPa ?? null,
        explanationPa: explanationPa ?? null,
        clientId: "",
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err: any) {
    if (err.message === "forbidden") return res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] POST /question-bank", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUT /question-bank/:id ────────────────────────────────────────────────────
router.put("/question-bank/:id", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.uid);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const {
      text, options, correct, section, sectionId, topic, topicId, globalTopicId,
      explanation, difficulty,
      textHi, optionsHi, explanationHi, textPa, optionsPa, explanationPa,
    } = req.body;

    if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({ error: "difficulty must be Easy, Medium, or Hard" });
    }

    const updateData: Partial<typeof questions.$inferInsert> = {};
    if (text !== undefined) updateData.text = text.trim();
    if (options !== undefined) updateData.options = options;
    if (correct !== undefined) updateData.correct = correct;
    if (section !== undefined) updateData.section = section.trim();
    if (sectionId !== undefined) updateData.sectionId = sectionId;
    if (topic !== undefined) updateData.topic = topic.trim();
    if (topicId !== undefined) updateData.topicId = topicId;
    if (globalTopicId !== undefined) updateData.globalTopicId = globalTopicId;
    if (explanation !== undefined) updateData.explanation = explanation.trim();
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (textHi !== undefined) updateData.textHi = textHi;
    if (optionsHi !== undefined) updateData.optionsHi = optionsHi;
    if (explanationHi !== undefined) updateData.explanationHi = explanationHi;
    if (textPa !== undefined) updateData.textPa = textPa;
    if (optionsPa !== undefined) updateData.optionsPa = optionsPa;
    if (explanationPa !== undefined) updateData.explanationPa = explanationPa;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const [updated] = await db
      .update(questions)
      .set(updateData)
      .where(eq(questions.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Question not found" });

    res.json(updated);
  } catch (err: any) {
    if (err.message === "forbidden") return res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] PUT /question-bank/:id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── DELETE /question-bank/:id ─────────────────────────────────────────────────
router.delete("/question-bank/:id", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.uid);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    // Check usage
    const usageMap = await fetchUsageStats([id]);
    const usage = usageMap.get(id);
    if (usage && usage.usageCount > 0) {
      return res.status(409).json({
        error: "Cannot delete question that is used in tests. Remove it from all tests first.",
        usageCount: usage.usageCount,
      });
    }

    await db.delete(questions).where(eq(questions.id, id));
    res.status(204).end();
  } catch (err: any) {
    if (err.message === "forbidden") return res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] DELETE /question-bank/:id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /question-bank/add-to-test ───────────────────────────────────────────
/**
 * Add one or more bank questions to a test.
 * Body: { testId: string, questionIds: number[] }
 * Returns: { added: number[], alreadyPresent: number[], errors: any[] }
 */
router.post("/question-bank/add-to-test", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.uid);
    const { testId, questionIds } = req.body as { testId: string; questionIds: number[] };

    if (!testId || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: "testId and a non-empty questionIds array are required" });
    }

    // Validate test exists
    const [testRow] = await db.select({ id: tests.id }).from(tests).where(eq(tests.id, testId)).limit(1);
    if (!testRow) return res.status(404).json({ error: "Test not found" });

    // Check which questions are already in this test
    const existing = await db
      .select({ questionId: testQuestions.questionId })
      .from(testQuestions)
      .where(and(eq(testQuestions.testId, testId), inArray(testQuestions.questionId, questionIds)));

    const alreadyPresent = existing.map((r) => r.questionId);
    const toAdd = questionIds.filter((qid) => !alreadyPresent.includes(qid));

    if (toAdd.length > 0) {
      await db.insert(testQuestions).values(
        toAdd.map((questionId) => ({ testId, questionId })),
      );
    }

    res.json({ added: toAdd, alreadyPresent, total: toAdd.length });
  } catch (err: any) {
    if (err.message === "forbidden") return res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] POST /question-bank/add-to-test", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── DELETE /question-bank/remove-from-test ────────────────────────────────────
/**
 * Remove a question from a test (test_questions row).
 * Body: { testId: string, questionId: number }
 */
router.delete("/question-bank/remove-from-test", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.uid);
    const { testId, questionId } = req.body as { testId: string; questionId: number };

    if (!testId || !questionId) {
      return res.status(400).json({ error: "testId and questionId are required" });
    }

    await db
      .delete(testQuestions)
      .where(and(eq(testQuestions.testId, testId), eq(testQuestions.questionId, questionId)));

    res.status(204).end();
  } catch (err: any) {
    if (err.message === "forbidden") return res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] DELETE /question-bank/remove-from-test", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /question-bank/smart-select ──────────────────────────────────────────
/**
 * Smart question selection for building a test.
 * Query params: testId, count (number of questions), section?, topic?
 * Rules:
 *   - Exclude questions already in the target test (hard no-dupe)
 *   - Exclude questions used in the last N=5 tests (recency filter)
 *   - Difficulty balance: Easy 30%, Medium 50%, Hard 20%
 *   - Priority: lowest usageCount first, then oldest lastUsedAt
 */
router.get("/question-bank/smart-select", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.uid);

    const targetTestId = req.query.testId as string | undefined;
    const desiredCount = Math.max(1, parseInt((req.query.count as string) ?? "10", 10));
    const sectionFilter = req.query.section as string | undefined;
    const topicFilter = req.query.topic as string | undefined;
    const RECENCY_TESTS = 5;

    // 1) Questions already in target test (hard exclude)
    const alreadyInTest: number[] = targetTestId
      ? (
          await db
            .select({ questionId: testQuestions.questionId })
            .from(testQuestions)
            .where(eq(testQuestions.testId, targetTestId))
        ).map((r) => r.questionId)
      : [];

    // 2) Questions used in the most recent N tests (recency exclude)
    const recentTests = await db
      .select({ testId: testQuestions.testId, addedAt: testQuestions.addedAt })
      .from(testQuestions)
      .orderBy(desc(testQuestions.addedAt))
      .limit(RECENCY_TESTS * 50); // over-fetch, then deduplicate

    const recentTestIds = [...new Set(recentTests.map((r) => r.testId))].slice(0, RECENCY_TESTS);

    const recentlyUsed: number[] =
      recentTestIds.length > 0
        ? (
            await db
              .select({ questionId: testQuestions.questionId })
              .from(testQuestions)
              .where(inArray(testQuestions.testId, recentTestIds))
          ).map((r) => r.questionId)
        : [];

    const hardExclude = [...new Set([...alreadyInTest, ...recentlyUsed])];

    // 3) Base filter
    const baseConds: ReturnType<typeof eq>[] = [];
    if (sectionFilter) baseConds.push(eq(questions.section, sectionFilter) as ReturnType<typeof eq>);
    if (topicFilter) baseConds.push(eq(questions.globalTopicId, topicFilter) as ReturnType<typeof eq>);

    // 4) For each difficulty bucket, fetch candidates sorted by usage (ascending)
    const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
    const ratios: Record<Difficulty, number> = { Easy: 0.3, Medium: 0.5, Hard: 0.2 };

    const allSelected: (typeof questions.$inferSelect)[] = [];

    for (const diff of difficulties) {
      const target = Math.round(desiredCount * ratios[diff]);
      if (target === 0) continue;

      const diffConds = [
        ...baseConds,
        eq(questions.difficulty, diff) as ReturnType<typeof eq>,
      ];
      const whereClause = diffConds.length > 0 ? and(...diffConds) : undefined;

      // Join with usage (left join via subquery)
      const candidates = await db
        .select({
          q: questions,
          usageCount: sql<number>`COALESCE((SELECT COUNT(*) FROM test_questions tq WHERE tq.question_id = ${questions.id}), 0)`,
          lastUsedAt: sql<Date | null>`(SELECT MAX(tq.added_at) FROM test_questions tq WHERE tq.question_id = ${questions.id})`,
        })
        .from(questions)
        .where(
          hardExclude.length > 0
            ? and(whereClause, sql`${questions.id} NOT IN (${sql.join(hardExclude.map((id) => sql`${id}`), sql`, `)})`)
            : whereClause,
        )
        .orderBy(
          asc(sql`COALESCE((SELECT COUNT(*) FROM test_questions tq WHERE tq.question_id = ${questions.id}), 0)`),
          asc(questions.createdAt),
        )
        .limit(target * 3); // fetch extra as buffer

      const picked = candidates.slice(0, target);
      allSelected.push(...picked.map((c) => c.q));
    }

    // 5) If we don't have enough, fill with any remaining questions (fallback)
    if (allSelected.length < desiredCount) {
      const selectedIds = allSelected.map((q) => q.id);
      const fallbackExclude = [...hardExclude, ...selectedIds];
      const fallbackWhere =
        baseConds.length > 0
          ? and(...baseConds)
          : undefined;

      const fallbackCandidates = await db
        .select()
        .from(questions)
        .where(
          fallbackExclude.length > 0
            ? and(fallbackWhere, sql`${questions.id} NOT IN (${sql.join(fallbackExclude.map((id) => sql`${id}`), sql`, `)})`)
            : fallbackWhere,
        )
        .orderBy(asc(questions.createdAt))
        .limit(desiredCount - allSelected.length);

      allSelected.push(...fallbackCandidates);
    }

    res.json({
      questions: allSelected,
      requestedCount: desiredCount,
      returnedCount: allSelected.length,
    });
  } catch (err: any) {
    if (err.message === "forbidden") return res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] GET /question-bank/smart-select", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
