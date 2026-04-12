import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { categories, questions, subcategories, tests, users } from "@workspace/db";
import { authenticate } from "../middlewares/auth";

type AdminCategory = {
  id: string;
  name: string;
  description: string;
  testsCount: number;
};

type AdminSubcategory = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
};

type AdminTest = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  access: "free" | "paid";
  kind: "full-length" | "sectional" | "topic-wise";
  duration: number;
  totalQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  showDifficulty: boolean;
  sections: string[];
  sectionSettings: { name: string; locked: boolean }[];
  sectionTimingMode: "none" | "fixed";
  sectionTimings: { name: string; minutes: number }[];
  attempts: number;
  avgScore: number;
};

type AdminQuestion = {
  id: string;
  testId: string;
  section: string;
  text: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
  createdAt: number;
};

type AdminSnapshot = {
  categories: AdminCategory[];
  subcategories: AdminSubcategory[];
  tests: AdminTest[];
  questions: AdminQuestion[];
};

const router: IRouter = Router();

async function assertAdmin(userId: string) {
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (rows.length === 0 || rows[0].role !== "admin") {
    throw new Error("forbidden");
  }
  return;
}

function defaultCategoryIcon(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("neet")) return { icon: "Heart", color: "emerald" };
  if (normalized.includes("cat")) return { icon: "BarChart3", color: "violet" };
  if (normalized.includes("upsc")) return { icon: "Building2", color: "amber" };
  if (normalized.includes("gate")) return { icon: "Wrench", color: "orange" };
  if (normalized.includes("ssc")) return { icon: "FileText", color: "rose" };
  if (normalized.includes("bank")) return { icon: "Banknote", color: "indigo" };
  if (normalized.includes("punjab")) return { icon: "MapPin", color: "red" };
  return { icon: "BookOpen", color: "blue" };
}

async function buildSnapshot(): Promise<AdminSnapshot> {
  const [categoryRows, subcategoryRows, testRows, questionRows] = await Promise.all([
    db.select().from(categories),
    db.select().from(subcategories),
    db.select().from(tests),
    db.select().from(questions).orderBy(asc(questions.id)),
  ]);

  const categoryCounts = new Map<string, number>();
  for (const test of testRows) {
    categoryCounts.set(test.categoryId, (categoryCounts.get(test.categoryId) ?? 0) + 1);
  }

  return {
    categories: categoryRows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      testsCount: categoryCounts.get(row.id) ?? row.testsCount ?? 0,
    })),
    subcategories: subcategoryRows.map((row) => ({
      id: row.id,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      name: row.name,
      description: row.description,
    })),
    tests: testRows.map((row) => ({
      id: row.id,
      name: row.name,
      categoryId: row.categoryId,
      categoryName: row.category,
      subcategoryId: row.subcategoryId ?? "",
      subcategoryName: row.subcategoryName ?? "",
      access: row.access ?? "free",
      kind: row.kind ?? "full-length",
      duration: row.duration,
      totalQuestions: row.totalQuestions,
      difficulty: row.difficulty,
      showDifficulty: true,
      sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
      sectionSettings: Array.isArray(row.sectionSettings)
        ? (row.sectionSettings as { name: string; locked: boolean }[])
        : [],
      sectionTimingMode: row.sectionTimingMode ?? "none",
      sectionTimings: Array.isArray(row.sectionTimings)
        ? (row.sectionTimings as { name: string; minutes: number }[])
        : [],
      attempts: row.attempts,
      avgScore: row.avgScore,
    })),
    questions: questionRows.map((row) => ({
      id: row.clientId || `q-${row.id}`,
      testId: row.testId,
      section: row.section,
      text: row.text,
      options: row.options as [string, string, string, string],
      correct: row.correct,
      explanation: row.explanation,
      createdAt: row.createdAt.getTime(),
    })),
  };
}

router.get("/", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    await assertAdmin(req.user.id);
    return res.json(await buildSnapshot());
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return res.status(403).json({ error: "Admin access required" });
    }
    return res.status(500).json({ error: "Could not load admin data" });
  }
});

router.put("/", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    await assertAdmin(req.user.id);

    const snapshot = req.body as AdminSnapshot;
    const existingCategories = await db.select().from(categories);
    const existingCategoryMap = new Map(existingCategories.map((cat) => [cat.id, cat]));

    await db.transaction(async (tx) => {
      await tx.execute(`DELETE FROM "questions"`);
      await tx.execute(`DELETE FROM "tests"`);
      await tx.execute(`DELETE FROM "subcategories"`);
      await tx.execute(`DELETE FROM "categories"`);

      for (const category of snapshot.categories ?? []) {
        const defaults = defaultCategoryIcon(category.name);
        const prior = existingCategoryMap.get(category.id);
        await tx.insert(categories).values({
          id: category.id,
          name: category.name,
          description: category.description,
          icon: prior?.icon ?? defaults.icon,
          color: prior?.color ?? defaults.color,
          testsCount: 0,
        });
      }

      for (const subcategory of snapshot.subcategories ?? []) {
        await tx.insert(subcategories).values({
          id: subcategory.id,
          categoryId: subcategory.categoryId,
          categoryName: subcategory.categoryName,
          name: subcategory.name,
          description: subcategory.description,
        });
      }

      for (const test of snapshot.tests ?? []) {
        await tx.insert(tests).values({
          id: test.id,
          name: test.name,
          category: test.categoryName,
          categoryId: test.categoryId,
          subcategoryId: test.subcategoryId ?? "",
          subcategoryName: test.subcategoryName ?? "",
          access: test.access ?? "free",
          kind: test.kind ?? "full-length",
          duration: test.duration,
          totalQuestions: test.totalQuestions,
          attempts: test.attempts ?? 0,
          avgScore: test.avgScore ?? 0,
          difficulty: test.difficulty,
          sectionTimingMode: test.sectionTimingMode ?? "none",
          sectionTimings: test.sectionTimings ?? [],
          sectionSettings: test.sectionSettings ?? [],
          sections: test.sections ?? [],
        });
      }

      for (const question of snapshot.questions ?? []) {
        await tx.insert(questions).values({
          clientId: question.id,
          testId: question.testId,
          text: question.text,
          options: question.options,
          correct: question.correct,
          section: question.section,
          explanation: question.explanation,
        });
      }

      const refreshedTests = await tx.select().from(tests);
      const countByCategory = new Map<string, number>();
      for (const test of refreshedTests) {
        countByCategory.set(test.categoryId, (countByCategory.get(test.categoryId) ?? 0) + 1);
      }

      for (const [categoryId, testsCount] of countByCategory.entries()) {
        await tx.update(categories).set({ testsCount }).where(eq(categories.id, categoryId));
      }
    });

    return res.json(await buildSnapshot());
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return res.status(403).json({ error: "Admin access required" });
    }
    return res.status(500).json({ error: "Could not save admin data" });
  }
});

export default router;
