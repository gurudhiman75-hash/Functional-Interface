import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { tests, questions } from "@workspace/db";
import { Test } from "@workspace/api-zod";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const allTests = await db.select().from(tests);
  return res.json(allTests.map(Test.parse));
});

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const test = await db.select().from(tests).where(eq(tests.id, id)).limit(1);
  if (test.length === 0) return res.status(404).json({ error: "Test not found" });

  const testQuestions = await db.select().from(questions).where(eq(questions.testId, id));
  const parsedTest = Test.parse(test[0]);
  // Attach questions to sections
  parsedTest.sections = parsedTest.sections.map(section => ({
    ...section,
    questions: testQuestions.filter(q => q.section === section.name).map(q => ({
      id: q.id,
      text: q.text,
      options: q.options as string[],
      correct: q.correct,
      section: q.section,
      explanation: q.explanation,
    })),
  }));
  return res.json(parsedTest);
});

export default router;
