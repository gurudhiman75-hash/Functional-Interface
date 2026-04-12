import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { tests, questions, users, userTestEntitlements } from "@workspace/db";
import { Test, type TestSection } from "@workspace/api-zod";
import { buildSectionsWithQuestions } from "../lib/test-sections";
import { optionalAuthenticate } from "../middlewares/optionalAuth";

const router: IRouter = Router();

function stripQuestionsFromSections(sections: TestSection[]): TestSection[] {
  return sections.map((section) => ({
    ...section,
    questions: [],
  }));
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
    const access = row.access ?? "free";
    if (access === "paid") {
      return {
        ...parsed,
        access: "paid" as const,
        priceCents: row.priceCents ?? 499,
        sections: stripQuestionsFromSections(parsed.sections),
      };
    }
    return {
      ...parsed,
      access: "free" as const,
      priceCents: row.priceCents ?? null,
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
    return res.status(404).json({ error: "Test has no questions yet" });
  }

  const parsedTest = Test.parse(row);
  parsedTest.sections = buildSectionsWithQuestions(parsedTest.sections, testQuestions);
  return res.json({
    ...parsedTest,
    access,
    priceCents: row.priceCents ?? null,
  });
});

export default router;
