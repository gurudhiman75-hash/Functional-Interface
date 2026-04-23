import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { sql as rawSql } from "drizzle-orm";
import { db } from "../lib/db";
import { categories, questions, subcategories, tests, users, sections, topicsGlobal, diSets } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { cacheDel, CacheKey } from "../lib/cache";

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
  languages?: string[];
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
  sectionIds?: string[];
  sectionSettings: { name: string; locked: boolean }[];
  sectionTimingMode: "none" | "fixed";
  sectionTimings: { name: string; minutes: number }[];
  attempts: number;
  avgScore: number;
  priceCents?: number | null;
  topicId?: string | null;
  topicName?: string | null;
  marksPerQuestion?: number;
  negativeMarks?: number;
  unattemptedMarks?: number;
};

type AdminQuestion = {
  id: string;
  testId: string;
  section: string;
  sectionId?: string;
  topic?: string;
  topicId?: string;
  text: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
  textHi?: string;
  optionsHi?: [string, string, string, string];
  explanationHi?: string;
  textPa?: string;
  optionsPa?: [string, string, string, string];
  explanationPa?: string;
  imageUrl?: string;
  questionType?: "text" | "image" | "di";
  diSetId?: number;
  /** Denormalized DI set fields (read-only from snapshot; not persisted directly) */
  diSetTitle?: string;
  diSetImageUrl?: string;
  diSetDescription?: string;
  createdAt: number;
};

type AdminSnapshot = {
  categories: AdminCategory[];
  subcategories: AdminSubcategory[];
  tests: AdminTest[];
  questions: AdminQuestion[];
};

const router: IRouter = Router();

const INSERT_CHUNK = 400;

export async function assertAdmin(userId: string) {
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
  if (normalized.includes("punjab")) return { icon: "MapPin", color: "blue" };
  return { icon: "BookOpen", color: "blue" };
}

async function buildSnapshot(): Promise<AdminSnapshot> {
  // Fetch questions with raw SQL — try full column list first, fall back to base columns
  // if optional columns (global_topic_id, difficulty) haven't been migrated yet.
  let questionRowsRaw: any[];
  try {
    questionRowsRaw = (await db.execute(rawSql`
      SELECT id, client_id, test_id, text, options, correct, section,
             COALESCE(topic, 'General') AS topic, explanation,
             section_id, topic_id, global_topic_id, difficulty,
             text_hi, options_hi, explanation_hi, text_pa, options_pa, explanation_pa,
             image_url, question_type, di_set_id,
             created_at
      FROM questions ORDER BY id ASC
    `)) as any[];
  } catch {
    // Some optional columns may be missing on older DBs — fall back to a safe select
    try {
      questionRowsRaw = (await db.execute(rawSql`
        SELECT id, client_id, test_id, text, options, correct, section,
               COALESCE(topic, 'General') AS topic, explanation,
               section_id, topic_id, global_topic_id, difficulty,
               text_hi, options_hi, explanation_hi, text_pa, options_pa, explanation_pa,
               NULL::text AS image_url, 'text'::text AS question_type, NULL::integer AS di_set_id,
               created_at
        FROM questions ORDER BY id ASC
      `)) as any[];
    } catch {
      // global_topic_id or difficulty column missing — fetch without them
      questionRowsRaw = (await db.execute(rawSql`
        SELECT id, client_id, test_id, text, options, correct, section,
               COALESCE(topic, 'General') AS topic, explanation,
               section_id, topic_id,
               NULL::text AS global_topic_id, NULL::text AS difficulty,
               text_hi, options_hi, explanation_hi, text_pa, options_pa, explanation_pa,
               NULL::text AS image_url, 'text'::text AS question_type, NULL::integer AS di_set_id,
               created_at
        FROM questions ORDER BY id ASC
      `)) as any[];
    }
  }

  // Build a DI set lookup map for denormalizing into question rows
  let diSetMap = new Map<number, { title: string; imageUrl: string | null; description: string | null }>();
  try {
    const diSetRows = await db.select().from(diSets);
    for (const ds of diSetRows) {
      diSetMap.set(ds.id, { title: ds.title, imageUrl: ds.imageUrl ?? null, description: ds.description ?? null });
    }
  } catch {
    // di_sets table not yet migrated — safe to ignore
  }

  const [categoryRows, subcategoryRows, testRows] = await Promise.all([
    db.select().from(categories),
    db.select().from(subcategories),
    db.select().from(tests),
  ]);

  const categoryCounts = new Map<string, number>();
  for (const test of testRows) {
    categoryCounts.set((test as any).categoryId, (categoryCounts.get((test as any).categoryId) ?? 0) + 1);
  }

  return {
    categories: (categoryRows as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      testsCount: categoryCounts.get(row.id) ?? row.testsCount ?? 0,
    })),
    subcategories: (subcategoryRows as any[]).map((row) => ({
      id: row.id,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      name: row.name,
      description: row.description,
      languages: Array.isArray(row.languages) ? (row.languages as string[]) : ["en"],
    })),
    tests: (testRows as any[]).map((row) => ({
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
      priceCents: row.priceCents ?? null,
      topicId: row.topicId ?? null,
      topicName: row.topicName ?? null,
      marksPerQuestion: row.marksPerQuestion ?? 1,
      negativeMarks: row.negativeMarks ?? 0,
      unattemptedMarks: row.unattemptedMarks ?? 0,
      languages: Array.isArray(row.languages) ? (row.languages as string[]) : null,
    })),
    questions: questionRowsRaw.map((row) => {
      const diSet = row.di_set_id ? diSetMap.get(Number(row.di_set_id)) : undefined;
      return {
        id: row.client_id || `q-${row.id}`,
        testId: row.test_id,
        section: row.section,
        sectionId: row.section_id ?? undefined,
        topic: row.topic ?? undefined,
        topicId: row.global_topic_id ?? undefined,
        text: row.text,
        options: row.options as [string, string, string, string],
        correct: row.correct,
        explanation: row.explanation,
        textHi: row.text_hi ?? undefined,
        optionsHi: row.options_hi ? (row.options_hi as [string, string, string, string]) : undefined,
        explanationHi: row.explanation_hi ?? undefined,
        textPa: row.text_pa ?? undefined,
        optionsPa: row.options_pa ? (row.options_pa as [string, string, string, string]) : undefined,
        explanationPa: row.explanation_pa ?? undefined,
        imageUrl: row.image_url ?? undefined,
        questionType: row.question_type ?? "text",
        diSetId: row.di_set_id ?? undefined,
        diSetTitle: diSet?.title ?? undefined,
        diSetImageUrl: diSet?.imageUrl ?? undefined,
        diSetDescription: diSet?.description ?? undefined,
        createdAt: new Date(row.created_at).getTime(),
      };
    }),
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
    console.error("[admin-data] GET / error:", error);
    const detail = error instanceof Error
      ? `${error.message}${(error as any).cause ? ` | cause: ${(error as any).cause}` : ""}${(error as any).detail ? ` | detail: ${(error as any).detail}` : ""}`
      : String(error);
    return res.status(500).json({ error: "Could not load admin data", detail });
  }
});

router.put("/", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    await assertAdmin(req.user.id);

    const snapshot = req.body as AdminSnapshot;
    const [existingCategories, existingSubcategories] = await Promise.all([
      db.select().from(categories),
      db.select().from(subcategories),
    ]);
    const existingCategoryMap = new Map(existingCategories.map((cat) => [cat.id, cat]));
    const existingSubcategoryMap = new Map(existingSubcategories.map((sub) => [sub.id, sub]));

    await db.transaction(async (tx) => {
      await tx.execute(rawSql`DELETE FROM "questions"`);
      await tx.execute(rawSql`DELETE FROM "tests"`);
      await tx.execute(rawSql`DELETE FROM "subcategories"`);
      await tx.execute(rawSql`DELETE FROM "categories"`);

      const categoryRows = (snapshot.categories ?? []).map((category) => {
        const defaults = defaultCategoryIcon(category.name);
        const prior = existingCategoryMap.get(category.id);
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          icon: prior?.icon ?? defaults.icon,
          color: prior?.color ?? defaults.color,
          testsCount: 0,
        };
      });
      if (categoryRows.length > 0) {
        await tx.insert(categories).values(categoryRows);
      }

      const subcategoryRows = (snapshot.subcategories ?? []).map((subcategory) => ({
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        categoryName: subcategory.categoryName,
        name: subcategory.name,
        description: subcategory.description,
        // Preserve existing languages from DB if the snapshot doesn't have them set
        languages: subcategory.languages ?? existingSubcategoryMap.get(subcategory.id)?.languages ?? null,
      }));
      if (subcategoryRows.length > 0) {
        await tx.insert(subcategories).values(subcategoryRows);
      }

      // ── Validate test kind/section/topic combinations ────────────────────
      const allSectionsForTests = await tx.select().from(sections);
      const sectionIdSet = new Set(allSectionsForTests.map((s) => s.id));
      const allTopicsGlobalForTests = await tx.select().from(topicsGlobal);
      const topicGlobalMap = new Map(allTopicsGlobalForTests.map((t) => [t.id, t]));

      const testValidationErrors: string[] = [];
      for (const test of snapshot.tests ?? []) {
        const sectionIds = test.sectionIds ?? [];
        const hasSection = sectionIds.length > 0 || (test.sections ?? []).length > 0;

        if (test.kind === "sectional" && !hasSection) {
          testValidationErrors.push(`Test "${test.name}" (id: ${test.id}): sectional tests require at least one section.`);
        }
        if (test.kind === "topic-wise") {
          if (!hasSection) {
            testValidationErrors.push(`Test "${test.name}" (id: ${test.id}): topic-wise tests require a section.`);
          }
          if (!test.topicId) {
            testValidationErrors.push(`Test "${test.name}" (id: ${test.id}): topic-wise tests require a topicId.`);
          }
          // Validate topicId exists in global topics table
          if (test.topicId && !topicGlobalMap.has(test.topicId)) {
            testValidationErrors.push(`Test "${test.name}" (id: ${test.id}): topicId "${test.topicId}" not found in global topics table.`);
          }
        }
        // Validate any provided sectionIds exist in master table
        for (const sid of sectionIds) {
          if (!sectionIdSet.has(sid)) {
            testValidationErrors.push(`Test "${test.name}" (id: ${test.id}): sectionId "${sid}" not found in master sections table.`);
          }
        }
      }
      if (testValidationErrors.length > 0) {
        throw Object.assign(new Error("test-validation-error"), { details: testValidationErrors });
      }

      const testRows = (snapshot.tests ?? []).map((test) => ({
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
        priceCents: test.priceCents ?? (test.access === "paid" ? 499 : null),
        topicId: test.topicId ?? null,
        topicName: test.topicName ?? null,
        marksPerQuestion: test.marksPerQuestion ?? 1,
        negativeMarks: test.negativeMarks ?? 0,
        unattemptedMarks: test.unattemptedMarks ?? 0,
        languages: Array.isArray((test as any).languages) ? (test as any).languages : null,
      }));
      if (testRows.length > 0) {
        await tx.insert(tests).values(testRows);
      }

      // Load sections & topics_global to resolve IDs and display names.
      // topics_global is section-independent — no sectionId cross-check.
      const allSections = allSectionsForTests;
      const sectionById = new Map(allSections.map((s) => [s.id, s.name]));
      const globalTopicById = new Map(allTopicsGlobalForTests.map((t) => [t.id, t.name]));

      const questionValidationErrors: string[] = [];
      const questionRows = (snapshot.questions ?? []).map((question, idx) => {
        const resolvedSectionId: string | null = question.sectionId ?? null;
        // question.topicId is the globalTopicId (mapped from buildSnapshot for backward compat)
        const resolvedGlobalTopicId: string | null = question.topicId ?? null;

        // Validate globalTopicId if provided — it must exist in topics_global
        if (resolvedGlobalTopicId && !globalTopicById.has(resolvedGlobalTopicId)) {
          questionValidationErrors.push(
            `Question ${idx + 1} (id: ${question.id}): topicId "${resolvedGlobalTopicId}" not found in topics_global.`
          );
        }

        // Resolve display names from master tables where IDs are present
        const resolvedSectionName = resolvedSectionId
          ? sectionById.get(resolvedSectionId) ?? question.section
          : question.section;
        const resolvedTopicName = resolvedGlobalTopicId
          ? (globalTopicById.get(resolvedGlobalTopicId) ?? question.topic ?? "General")
          : (question.topic ?? "General");

        return {
          clientId: question.id,
          testId: question.testId,
          text: question.text,
          options: question.options,
          correct: question.correct,
          section: resolvedSectionName,
          sectionId: resolvedSectionId,
          topic: resolvedTopicName,
          topicId: null,                         // old FK column — no longer populated
          globalTopicId: resolvedGlobalTopicId,  // preferred FK (NOT NULL)
          explanation: question.explanation,
          textHi: question.textHi ?? null,
          optionsHi: question.optionsHi ?? null,
          explanationHi: question.explanationHi ?? null,
          textPa: question.textPa ?? null,
          optionsPa: question.optionsPa ?? null,
          explanationPa: question.explanationPa ?? null,
          imageUrl: question.imageUrl ?? null,
          questionType: question.questionType ?? "text",
          diSetId: question.diSetId ?? null,
        };
      });
      if (questionValidationErrors.length > 0) {
        throw Object.assign(new Error("section-topic-mismatch"), { details: questionValidationErrors });
      }

      for (let i = 0; i < questionRows.length; i += INSERT_CHUNK) {
        const chunk = questionRows.slice(i, i + INSERT_CHUNK);
        if (chunk.length > 0) {
          await tx.insert(questions).values(chunk);
        }
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

    // Invalidate the tests list cache so the next request fetches fresh data
    await cacheDel(CacheKey.testsList());

    return res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return res.status(403).json({ error: "Admin access required" });
    }
    if (error instanceof Error && error.message === "section-topic-mismatch") {
      return res.status(422).json({
        error: "Section/topic mismatch: topicId does not belong to the specified sectionId",
        details: (error as any).details ?? [],
      });
    }
    if (error instanceof Error && error.message === "test-validation-error") {
      return res.status(422).json({
        error: "Test validation failed: invalid kind/section/topic combination",
        details: (error as any).details ?? [],
      });
    }
    console.error("[admin-data] PUT / error:", error);
    const detail = error instanceof Error
      ? `${error.message}${(error as any).cause ? ` | cause: ${(error as any).cause}` : ""}${(error as any).detail ? ` | detail: ${(error as any).detail}` : ""}`
      : String(error);
    return res.status(500).json({ error: "Could not save admin data", detail });
  }
});

/**
 * DELETE /admin-data/categories/:id
 *
 * Deletes a single category plus all of its subcategories, tests, and questions.
 * Only validates that categoryId exists — no create/update field validation.
 */
router.delete("/categories/:id", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    await assertAdmin(req.user.id);

    const categoryId = req.params.id as string;
    if (!categoryId) return res.status(400).json({ error: "categoryId is required" });

    const existing = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Category "${categoryId}" not found` });
    }

    await db.transaction(async (tx) => {
      // Gather child IDs so we can cascade manually
      const childSubcats = await tx.select({ id: subcategories.id }).from(subcategories).where(eq(subcategories.categoryId, categoryId));
      const subcatIds = childSubcats.map((s) => s.id);

      const childTests = await tx.select({ id: tests.id }).from(tests).where(eq(tests.categoryId, categoryId));
      const testIds = childTests.map((t) => t.id);

      if (testIds.length > 0) {
        const { inArray } = await import("drizzle-orm");
        await tx.delete(questions).where(inArray(questions.testId, testIds));
        await tx.delete(tests).where(inArray(tests.id, testIds));
      }
      if (subcatIds.length > 0) {
        const { inArray } = await import("drizzle-orm");
        await tx.delete(subcategories).where(inArray(subcategories.id, subcatIds));
      }
      await tx.delete(categories).where(eq(categories.id, categoryId));
    });

    await cacheDel(CacheKey.testsList());
    return res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return res.status(403).json({ error: "Admin access required" });
    }
    console.error("DELETE /admin-data/categories error:", error);
    return res.status(500).json({ error: "Could not delete category" });
  }
});

/**
 * DELETE /admin-data/subcategories/:id
 *
 * Deletes a single subcategory plus all of its tests and questions.
 * Only validates that subcategoryId exists — no create/update field validation.
 */
router.delete("/subcategories/:id", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    await assertAdmin(req.user.id);

    const subcategoryId = req.params.id as string;
    if (!subcategoryId) return res.status(400).json({ error: "subcategoryId is required" });

    const existing = await db.select().from(subcategories).where(eq(subcategories.id, subcategoryId)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Subcategory "${subcategoryId}" not found` });
    }

    await db.transaction(async (tx) => {
      const childTests = await tx.select({ id: tests.id, categoryId: tests.categoryId }).from(tests).where(eq(tests.subcategoryId, subcategoryId));
      const testIds = childTests.map((t) => t.id);

      if (testIds.length > 0) {
        const { inArray } = await import("drizzle-orm");
        await tx.delete(questions).where(inArray(questions.testId, testIds));
        await tx.delete(tests).where(inArray(tests.id, testIds));
      }
      await tx.delete(subcategories).where(eq(subcategories.id, subcategoryId));

      // Update testsCount on the parent category
      if (childTests.length > 0) {
        const categoryId = childTests[0].categoryId;
        const remaining = await tx.select().from(tests).where(eq(tests.categoryId, categoryId));
        await tx.update(categories).set({ testsCount: remaining.length }).where(eq(categories.id, categoryId));
      }
    });

    await cacheDel(CacheKey.testsList());
    return res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return res.status(403).json({ error: "Admin access required" });
    }
    console.error("DELETE /admin-data/subcategories error:", error);
    return res.status(500).json({ error: "Could not delete subcategory" });
  }
});

/**
 * DELETE /admin-data/tests/:id
 *
 * Deletes a single test and all its questions.
 * Only validates that testId exists — skips all other field/kind/section/topic validation.
 */
router.delete("/tests/:id", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    await assertAdmin(req.user.id);

    const testId = req.params.id as string;
    if (!testId) return res.status(400).json({ error: "testId is required" });

    // Verify the test exists before attempting deletion
    const existing = await db.select().from(tests).where(eq(tests.id, testId)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Test "${testId}" not found` });
    }

    await db.transaction(async (tx) => {
      // Delete questions first (FK constraint)
      await tx.delete(questions).where(eq(questions.testId, testId));
      await tx.delete(tests).where(eq(tests.id, testId));

      // Update testsCount on the affected category
      const categoryId = existing[0].categoryId;
      const remainingTests = await tx.select().from(tests).where(eq(tests.categoryId, categoryId));
      await tx.update(categories).set({ testsCount: remainingTests.length }).where(eq(categories.id, categoryId));
    });

    await cacheDel(CacheKey.testsList());

    return res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return res.status(403).json({ error: "Admin access required" });
    }
    return res.status(500).json({ error: "Could not delete test" });
  }
});

export default router;
