import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { tests, questions, users, userTestEntitlements } from "@workspace/db";
import { Test, type TestSection } from "@workspace/api-zod";
import { buildSectionsWithQuestions } from "../lib/test-sections";
import { optionalAuthenticate } from "../middlewares/optionalAuth";
import { authenticate } from "../middlewares/auth";

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

router.get("/", async (_req, res) => {
  const allTests = await db.select().from(tests);
  const payload = allTests.map((row) => {
    const parsed = Test.parse(row);
    const normalizedSections = normalizeSections(parsed.sections);
    const access = row.access ?? "free";
    if (access === "paid") {
      return {
        ...parsed,
        access: "paid" as const,
        priceCents: row.priceCents ?? 499,
        sections: stripQuestionsFromSections(normalizedSections),
      };
    }
    return {
      ...parsed,
      access: "free" as const,
      priceCents: row.priceCents ?? null,
      sections: normalizedSections,
    };
  });
  return res.json(payload);
});

router.get("/:id", optionalAuthenticate, async (req, res) => {
  const idParam = req.params["id"];
  const id = typeof idParam === "string" ? idParam : idParam?.[0];
  if (!id) return res.status(400).json({ error: "Missing test id" });

  const testRows = await db.select().from(tests).where(eq(tests.id, id)).limit(1);
  if (testRows.length === 0) return res.status(404).json({ error: "Test not found" });

  const row = testRows[0];
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

  const testQuestions = await db.select().from(questions).where(eq(questions.testId, id));
  if (testQuestions.length === 0) {
    return res.status(404).json({
      error: "Test has no questions yet",
      code: "NO_QUESTIONS",
      testId: id,
    });
  }

  const parsedTest = Test.parse(row);
  parsedTest.sections = buildSectionsWithQuestions(parsedTest.sections, testQuestions);
  return res.json({
    ...parsedTest,
    access,
    priceCents: row.priceCents ?? null,
  });
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

export default router;
