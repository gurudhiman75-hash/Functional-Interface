import { Router, type IRouter } from "express";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../lib/db";
import { tests, questions, users, userTestEntitlements, subcategories, diSets } from "@workspace/db";
import { Test, type TestSection } from "@workspace/api-zod";
import { buildSectionsWithQuestions } from "../lib/test-sections";
import { optionalAuthenticate } from "../middlewares/optionalAuth";
import { authenticate } from "../middlewares/auth";
import { cacheGet, cacheSet, CacheKey, TTL } from "../lib/cache";
import { getQuestionColumnState, buildQuestionSelectSql } from "../lib/question-columns";

const router: IRouter = Router();

function stripQuestionsFromSections(sections: TestSection[]): TestSection[] {
  return sections.map((section) => ({
    ...section,
    questions: [],
  }));
}

function normalizeSections(rawSections: unknown): TestSection[] {
  if (!Array.isArray(rawSections)) return [];
  return rawSections
    .filter((item): item is Record<string, unknown> | string => 
      (typeof item === "object" && item !== null && "name" in item) || typeof item === "string"
    )
    .map((item, idx) => {
      if (typeof item === "string") {
        return {
          id: `${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${idx}`,
          name: item,
          questions: [],
        };
      }
      return {
        id: typeof item.id === "string" && item.id ? item.id : `section-${idx}`,
        name: String(item.name ?? `Section ${idx + 1}`),
        questions: [],
      };
    });
}

async function canAccessPaidTest(userId: string | undefined, testId: string): Promise<boolean> {
  if (!userId) return false;
  const profile = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (profile[0]?.role === "admin") return true;
  const ent = await db
    .select()
    .from(userTestEntitlements)
    .where(and(eq(userTestEntitlements.userId, userId), eq(userTestEntitlements.testId, testId)))
    .limit(1);
  return ent.length > 0;
}

// GET /api/tests/category-free-ids?category=SSC
// Returns IDs+names of all free tests in a given category (lightweight, no questions)
router.get("/category-free-ids", async (req, res) => {
  const category = req.query.category as string | undefined;
  if (!category) return res.status(400).json({ error: "category query param is required" });

  const rows = await db
    .select({ id: tests.id, name: tests.name })
    .from(tests)
    .where(and(eq(tests.category, category), eq(tests.access, "free")));

  return res.json(rows);
});

router.get("/", async (_req, res) => {
  const cacheKey = CacheKey.testsList();
  const cached = await cacheGet<unknown[]>(cacheKey);
  if (cached) return res.json(cached);

  const allTests = await db
    .select({ test: tests, subcategoryLanguages: subcategories.languages })
    .from(tests)
    .leftJoin(subcategories, eq(tests.subcategoryId, subcategories.id));
  const payload = allTests.map(({ test: row, subcategoryLanguages }) => {
    const parsed = Test.parse(row);
    const normalizedSections = normalizeSections(parsed.sections);
    const access = row.access ?? "free";
    const langs = Array.isArray(subcategoryLanguages) ? subcategoryLanguages as string[] : ["en"];
    if (access === "paid") {
      return {
        ...parsed,
        access: "paid" as const,
        priceCents: row.priceCents ?? 499,
        sections: stripQuestionsFromSections(normalizedSections),
        languages: langs,
      };
    }
    return {
      ...parsed,
      access: "free" as const,
      priceCents: row.priceCents ?? null,
      sections: normalizedSections,
      languages: langs,
    };
  });
  await cacheSet(cacheKey, payload, TTL.TESTS_LIST);
  return res.json(payload);
});

router.get("/my-tests", authenticate, async (req, res) => {
  const userId = req.user!.id;

  try {
    // Get all purchased tests for the user
    const purchasedTests = await db
      .select({
        testId: userTestEntitlements.testId,
        purchasedAt: userTestEntitlements.createdAt,
        source: userTestEntitlements.source,
        razorpayOrderId: userTestEntitlements.razorpayOrderId,
        razorpayPaymentId: userTestEntitlements.razorpayPaymentId,
        // Join with tests table
        name: tests.name,
        category: tests.category,
        categoryId: tests.categoryId,
        subcategoryId: tests.subcategoryId,
        subcategoryName: tests.subcategoryName,
        access: tests.access,
        priceCents: tests.priceCents,
        kind: tests.kind,
        duration: tests.duration,
        totalQuestions: tests.totalQuestions,
        attempts: tests.attempts,
        avgScore: tests.avgScore,
        difficulty: tests.difficulty,
      })
      .from(userTestEntitlements)
      .innerJoin(tests, eq(userTestEntitlements.testId, tests.id))
      .where(eq(userTestEntitlements.userId, userId))
      .orderBy(userTestEntitlements.createdAt);

    return res.json({
      purchasedTests: purchasedTests.map(test => ({
        id: test.testId,
        name: test.name,
        category: test.category,
        categoryId: test.categoryId,
        subcategoryId: test.subcategoryId,
        subcategoryName: test.subcategoryName,
        access: test.access,
        priceCents: test.priceCents,
        kind: test.kind,
        duration: test.duration,
        totalQuestions: test.totalQuestions,
        attempts: test.attempts,
        avgScore: test.avgScore,
        difficulty: test.difficulty,
        purchasedAt: test.purchasedAt,
        source: test.source,
        razorpayOrderId: test.razorpayOrderId,
        razorpayPaymentId: test.razorpayPaymentId,
      }))
    });

  } catch (error) {
    console.error("Error fetching user's purchased tests:", error);
    return res.status(500).json({ error: "Failed to fetch purchased tests" });
  }
});

router.get("/:id", optionalAuthenticate, async (req, res) => {
  const idParam = req.params["id"];
  const id = typeof idParam === "string" ? idParam : idParam?.[0];
  if (!id) return res.status(400).json({ error: "Missing test id" });

  try {
  const testRows = await db
    .select({ test: tests, subcategoryLanguages: subcategories.languages })
    .from(tests)
    .leftJoin(subcategories, eq(tests.subcategoryId, subcategories.id))
    .where(eq(tests.id, id))
    .limit(1);
  if (testRows.length === 0) return res.status(404).json({ error: "Test not found" });

  const { test: row, subcategoryLanguages } = testRows[0];
  const access = row.access ?? "free";

  if (access === "paid") {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: "Sign in required to open this paid test",
        code: "LOGIN_REQUIRED",
        testId: id,
        priceCents: row.priceCents ?? 499,
      });
    }
    const allowed = await canAccessPaidTest(userId, id);
    if (!allowed) {
      return res.status(403).json({
        error: "Purchase required to access this test",
        code: "PAYMENT_REQUIRED",
        testId: id,
        priceCents: row.priceCents ?? 499,
      });
    }
  }

  const columns = await getQuestionColumnState();
  const selectCols = buildQuestionSelectSql(columns);
  const testQuestions = await db.execute(
    sql`SELECT ${selectCols} FROM questions
        WHERE test_id = ${id}
           OR id IN (SELECT question_id FROM test_questions WHERE test_id = ${id})`
  ) as any[];
  if (testQuestions.length === 0) {
    return res.status(404).json({
      error: "Test has no questions yet",
      code: "NO_QUESTIONS",
      testId: id,
    });
  }

  // Build di_set lookup for questions that reference one
  let diSetMap = new Map<number, { title: string; imageUrl: string | null; description: string | null }>();
  if (columns.hasDiSetId) {
    const diSetIds = [...new Set(
      testQuestions.map((q: any) => q.di_set_id ?? null).filter((x: any) => x != null) as number[]
    )];
    if (diSetIds.length > 0) {
      try {
        const dsRows = await db.select().from(diSets).where(sql`id IN (${sql.join(diSetIds.map(id => sql`${id}`), sql`, `)})`);
        for (const ds of dsRows) {
          diSetMap.set(ds.id, { title: ds.title, imageUrl: ds.imageUrl ?? null, description: ds.description ?? null });
        }
      } catch {
        // di_sets not yet migrated — ignore
      }
    }
  }

  // Attach di_set info to each question row
  const augmentedQuestions = testQuestions.map((q: any) => {
    const diSetId = q.di_set_id ?? null;
    if (diSetId && diSetMap.has(Number(diSetId))) {
      const ds = diSetMap.get(Number(diSetId))!;
      return { ...q, diSetTitle: ds.title, diSetImageUrl: ds.imageUrl, diSetDescription: ds.description };
    }
    return q;
  });

  const parsedTest = Test.parse(row);
  parsedTest.sections = buildSectionsWithQuestions(parsedTest.sections, augmentedQuestions);
  const langs = Array.isArray(subcategoryLanguages) ? subcategoryLanguages as string[] : ["en"];
  return res.json({
    ...parsedTest,
    access,
    priceCents: row.priceCents ?? null,
    languages: langs,
  });
  } catch (err) {
    console.error(`[tests] GET /:id error for id=${id}:`, err);
    return res.status(500).json({ error: "Failed to load test", detail: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
