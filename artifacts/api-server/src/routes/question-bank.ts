import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { and, asc, count, desc, eq, ilike, inArray, max, or, sql } from "drizzle-orm";
import multer from "multer";
import { db } from "../lib/db";
import { questions, testQuestions, tests, sections, topicsGlobal, diSets, mockTestTemplates, type MockDifficulty, type MockSection } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";
import { type QuestionColumnState, getQuestionColumnState, buildQuestionSelectSql } from "../lib/question-columns";
import { generateQuestions, type GeneratedQuestion } from "../lib/generator.service";

// Multer for CSV uploads (memory storage, 10 MB limit)
const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) cb(null, true);
    else cb(new Error("Only .csv files are accepted"));
  },
});

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === "," && !inQuote) { cells.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

function normaliseKey(v: string) {
  return v.trim().toLowerCase().replace(/\s+/g, " ");
}

const CORRECT_LETTER: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
const BANK_TEST_ID = "__bank__";

const router: IRouter = Router();

type QuestionTemplateInput = {
  section: MockSection;
  topic: string;
  subtopic: string;
  difficulty: MockDifficulty;
  patternIds: string[];
  questionCount: number;
};

type QuestionTemplatePayload = {
  id: string;
  name: string;
  template: QuestionTemplateInput;
  createdAt: string;
};

function normalizeQuestionTemplate(input: Partial<QuestionTemplateInput>): QuestionTemplateInput {
  return {
    section: (input.section ?? "quant") as MockSection,
    topic: String(input.topic ?? "").trim(),
    subtopic: String(input.subtopic ?? "").trim(),
    difficulty: (input.difficulty ?? "medium") as MockDifficulty,
    patternIds: Array.isArray(input.patternIds) ? input.patternIds.filter(Boolean) : [],
    questionCount: Math.max(1, Math.floor(Number(input.questionCount ?? 1) || 1)),
  };
}

function parseTemplateSections(sections: unknown): QuestionTemplateInput[] {
  let value: unknown = sections;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      value = [];
    }
  }
  const list = Array.isArray(value) ? value : [];
  return list.map((item) => normalizeQuestionTemplate(item as Partial<QuestionTemplateInput>));
}

function templateFromRow(row: { id: string; name: string; sections: unknown; createdAt: unknown }): QuestionTemplatePayload | null {
  const sectionsValue = parseTemplateSections(row.sections);
  const first = sectionsValue[0];
  if (!first) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    template: first,
    createdAt: new Date(row.createdAt as any).toISOString(),
  };
}

function normalizeQuestionText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

async function collectGeneratedQuestions(template: QuestionTemplateInput, usedKeys: Set<string>) {
  const collected: GeneratedQuestion[] = [];
  let safety = 0;

  while (collected.length < template.questionCount && safety < template.questionCount * 5) {
    const remaining = template.questionCount - collected.length;
    const result = await generateQuestions({
      section: template.section,
      topic: template.topic,
      subtopic: template.subtopic,
      difficulty: template.difficulty,
      patternIds: template.patternIds,
      count: remaining,
      persist: true,
    });

    if (result.questions.length === 0) {
      break;
    }

    let progress = false;
    for (const question of result.questions) {
      const key = normalizeQuestionText(question.questionText);
      if (usedKeys.has(key)) {
        continue;
      }
      if (question.id == null) {
        throw new Error("Generated question was not persisted");
      }
      usedKeys.add(key);
      collected.push(question);
      progress = true;
      if (collected.length >= template.questionCount) {
        break;
      }
    }

    if (!progress) {
      break;
    }
    safety += 1;
  }

  if (collected.length === 0) {
    throw new Error(`No questions generated for ${template.section} (${template.topic}/${template.subtopic})`);
  }

  if (collected.length < template.questionCount) {
    throw new Error(
      `Only generated ${collected.length}/${template.questionCount} questions for ${template.section} (${template.topic}/${template.subtopic})`,
    );
  }

  return collected;
}

function buildQuestionWhereSql(columns: QuestionColumnState, req: any) {
  const searchQ = req.query.search as string | undefined;
  const sectionQ = req.query.section as string | undefined;
  const topicQ = req.query.topic as string | undefined;
  const difficultyQ = req.query.difficulty as Difficulty | undefined;
  const diSetIdQRaw = req.query.diSetId as string | undefined;
  const diSetIdQ = diSetIdQRaw ? parseInt(diSetIdQRaw, 10) : NaN;

  const parts: any[] = [];
  if (searchQ?.trim()) {
    const term = `%${searchQ.trim()}%`;
    parts.push(sql`(text ILIKE ${term} OR explanation ILIKE ${term})`);
  }
  if (sectionQ?.trim()) parts.push(sql`section = ${sectionQ.trim()}`);
  if (topicQ?.trim()) {
    const topicColumn = columns.hasGlobalTopicId
      ? sql`global_topic_id`
      : columns.hasTopicId
        ? sql`topic_id`
        : sql`topic`;
    parts.push(sql`${topicColumn} = ${topicQ.trim()}`);
  }
  if (difficultyQ && ["Easy", "Medium", "Hard"].includes(difficultyQ) && columns.hasDifficulty) {
    parts.push(sql`difficulty = ${difficultyQ}`);
  }
  if (!isNaN(diSetIdQ) && columns.hasDiSetId) {
    parts.push(sql`di_set_id = ${diSetIdQ}`);
  }

  return parts.length > 0 ? parts.reduce((a, b) => sql`${a} AND ${b}`) : null;
}

function isMissingRelationError(err: any, relation: string) {
  const code = err?.code ?? err?.cause?.code;
  const message = String(err?.message ?? "");
  const causeMessage = String(err?.cause?.message ?? "");
  return code === "42P01" || message.includes(`relation "${relation}" does not exist`) || causeMessage.includes(`relation "${relation}" does not exist`);
}

function isUndefinedColumnError(err: any) {
  const code = err?.code ?? err?.cause?.code;
  const message = String(err?.message ?? "");
  const causeMessage = String(err?.cause?.message ?? "");
  return code === "42703" || message.includes("does not exist") || causeMessage.includes("does not exist");
}

async function insertQuestionChunkCompat(
  rows: Array<typeof questions.$inferInsert>,
  columns: QuestionColumnState,
) {
  if (rows.length === 0) return;

  const columnNames = [
    ...(columns.hasClientId ? [sql`client_id`] : []),
    ...(columns.hasTestId ? [sql`test_id`] : []),
    sql`text`,
    sql`options`,
    sql`correct`,
    sql`section`,
    ...(columns.hasSectionId ? [sql`section_id`] : []),
    sql`topic`,
    ...(columns.hasTopicId ? [sql`topic_id`] : []),
    ...(columns.hasGlobalTopicId ? [sql`global_topic_id`] : []),
    sql`explanation`,
    ...(columns.hasDifficulty ? [sql`difficulty`] : []),
    ...(columns.hasTextHi ? [sql`text_hi`] : []),
    ...(columns.hasOptionsHi ? [sql`options_hi`] : []),
    ...(columns.hasExplanationHi ? [sql`explanation_hi`] : []),
    ...(columns.hasTextPa ? [sql`text_pa`] : []),
    ...(columns.hasOptionsPa ? [sql`options_pa`] : []),
    ...(columns.hasExplanationPa ? [sql`explanation_pa`] : []),
    ...(columns.hasImageUrl ? [sql`image_url`] : []),
    ...(columns.hasQuestionType ? [sql`question_type`] : []),
    ...(columns.hasDiSetId ? [sql`di_set_id`] : []),
  ];

  const valuesSql = rows.map((row) =>
    sql`(${sql.join(
      [
        ...(columns.hasClientId ? [sql`${row.clientId ?? ""}`] : []),
        ...(columns.hasTestId ? [sql`${row.testId ?? ""}`] : []),
        sql`${row.text ?? ""}`,
        sql`${row.options}`,
        sql`${row.correct}`,
        sql`${row.section}`,
        ...(columns.hasSectionId ? [sql`${row.sectionId ?? null}`] : []),
        sql`${row.topic ?? "General"}`,
        ...(columns.hasTopicId ? [sql`${row.topicId ?? null}`] : []),
        ...(columns.hasGlobalTopicId ? [sql`${row.globalTopicId ?? null}`] : []),
        sql`${row.explanation ?? ""}`,
        ...(columns.hasDifficulty ? [sql`${row.difficulty ?? null}`] : []),
        ...(columns.hasTextHi ? [sql`${row.textHi ?? null}`] : []),
        ...(columns.hasOptionsHi ? [sql`${row.optionsHi ?? null}`] : []),
        ...(columns.hasExplanationHi ? [sql`${row.explanationHi ?? null}`] : []),
        ...(columns.hasTextPa ? [sql`${row.textPa ?? null}`] : []),
        ...(columns.hasOptionsPa ? [sql`${row.optionsPa ?? null}`] : []),
        ...(columns.hasExplanationPa ? [sql`${row.explanationPa ?? null}`] : []),
        ...(columns.hasImageUrl ? [sql`${(row as any).imageUrl ?? null}`] : []),
        ...(columns.hasQuestionType ? [sql`${(row as any).questionType ?? "text"}`] : []),
        ...(columns.hasDiSetId ? [sql`${(row as any).diSetId ?? null}`] : []),
      ],
      sql`, `,
    )})`,
  );

  await db.execute(sql`
    INSERT INTO questions (${sql.join(columnNames, sql`, `)})
    VALUES ${sql.join(valuesSql, sql`, `)}
  `);
}

async function ensureBankTestExists(): Promise<string | null> {
  try {
    const [existing] = await db
      .select({ id: tests.id })
      .from(tests)
      .where(eq(tests.id, BANK_TEST_ID))
      .limit(1);
    if (existing) return existing.id;

    // Create a dedicated placeholder test to anchor question-bank rows without
    // attaching them to a real exam test.
    await db.execute(sql`
      INSERT INTO tests (id, name, category, category_id, duration, total_questions, difficulty, sections)
      SELECT ${BANK_TEST_ID}, 'Question Bank (System)', t.category, t.category_id, 1, 0, 'Easy', '[]'::jsonb
      FROM tests t
      WHERE t.id <> ${BANK_TEST_ID}
      LIMIT 1
      ON CONFLICT (id) DO NOTHING
    `);

    const [created] = await db
      .select({ id: tests.id })
      .from(tests)
      .where(eq(tests.id, BANK_TEST_ID))
      .limit(1);
    return created?.id ?? null;
  } catch {
    return null;
  }
}

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
  let rows: Array<{ questionId: number; usageCount: number; lastUsedAt: Date | null }>;
  try {
    rows = await db
      .select({
        questionId: testQuestions.questionId,
        usageCount: count(testQuestions.id),
        lastUsedAt: max(testQuestions.addedAt),
      })
      .from(testQuestions)
      .where(inArray(testQuestions.questionId, questionIds))
      .groupBy(testQuestions.questionId);
  } catch (err: any) {
    // Older/partially-migrated DB: test_questions table missing.
    // Keep Question Bank usable by treating usage as zero.
    if (isMissingRelationError(err, "test_questions")) {
      console.warn("[question-bank] test_questions table missing; usage stats defaulting to zero");
      return new Map();
    }
    throw err;
  }

  const map = new Map<number, { usageCount: number; lastUsedAt: Date | null }>();
  for (const r of rows) {
    map.set(r.questionId, { usageCount: r.usageCount, lastUsedAt: r.lastUsedAt as Date | null });
  }
  return map;
}

// ── GET /question-bank/templates ─────────────────────────────────────────────
router.get("/question-bank/templates", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const rows = await db
      .select()
      .from(mockTestTemplates)
      .orderBy(desc(mockTestTemplates.createdAt));

    const templates = rows
      .map((row) => templateFromRow(row as any))
      .filter((row): row is QuestionTemplatePayload => row !== null);

    res.json({ templates });
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] GET /question-bank/templates", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /question-bank/templates ────────────────────────────────────────────
router.post("/question-bank/templates", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const { name, template } = req.body as {
      name?: string;
      template?: Partial<QuestionTemplateInput>;
    };

    const normalized = normalizeQuestionTemplate(template ?? {});
    if (!normalized.topic || !normalized.subtopic) {
      return void res.status(400).json({ error: "template requires topic and subtopic" });
    }

    const createdAt = new Date();
    const savedName = String(name ?? "").trim() || `${normalized.section} - ${normalized.topic} / ${normalized.subtopic}`;
    const [row] = await db
      .insert(mockTestTemplates)
      .values({
        id: randomUUID(),
        name: savedName,
        sections: [normalized],
        createdAt,
      })
      .returning({ id: mockTestTemplates.id, name: mockTestTemplates.name, createdAt: mockTestTemplates.createdAt });

    res.status(201).json({
      id: row.id,
      name: row.name,
      template: normalized,
      createdAt: row.createdAt.toISOString(),
    });
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] POST /question-bank/templates", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUT /question-bank/templates/:id ─────────────────────────────────────────
router.put("/question-bank/templates/:id", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const id = req.params.id as string;
    const { name, template } = req.body as {
      name?: string;
      template?: Partial<QuestionTemplateInput>;
    };
    const normalized = normalizeQuestionTemplate(template ?? {});
    if (!normalized.topic || !normalized.subtopic) {
      return void res.status(400).json({ error: "template requires topic and subtopic" });
    }

    const savedName = String(name ?? "").trim() || `${normalized.section} - ${normalized.topic} / ${normalized.subtopic}`;
    const [row] = await db
      .update(mockTestTemplates)
      .set({
        name: savedName,
        sections: [normalized],
      })
      .where(eq(mockTestTemplates.id, id))
      .returning({ id: mockTestTemplates.id, name: mockTestTemplates.name, createdAt: mockTestTemplates.createdAt });

    if (!row) {
      return void res.status(404).json({ error: "Template not found" });
    }

    res.json({
      id: row.id,
      name: row.name,
      template: normalized,
      createdAt: new Date(row.createdAt as any).toISOString(),
    });
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] PUT /question-bank/templates/:id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── DELETE /question-bank/templates/:id ──────────────────────────────────────
router.delete("/question-bank/templates/:id", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const id = req.params.id as string;
    const deleted = await db.delete(mockTestTemplates).where(eq(mockTestTemplates.id, id)).returning({ id: mockTestTemplates.id });
    if (deleted.length === 0) {
      return void res.status(404).json({ error: "Template not found" });
    }
    res.status(204).end();
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] DELETE /question-bank/templates/:id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /question-bank/generate ─────────────────────────────────────────────
router.post("/question-bank/generate", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const { templateId, template } = req.body as {
      templateId?: string;
      template?: Partial<QuestionTemplateInput>;
    };

    let normalized: QuestionTemplateInput | null = null;
    if (templateId) {
      const [row] = await db.select().from(mockTestTemplates).where(eq(mockTestTemplates.id, templateId)).limit(1);
      if (!row) {
        return void res.status(404).json({ error: "Template not found" });
      }
      normalized = templateFromRow(row as any)?.template ?? null;
    } else if (template) {
      normalized = normalizeQuestionTemplate(template);
    }

    if (!normalized) {
      return void res.status(400).json({ error: "templateId or template is required" });
    }
    if (!normalized.topic || !normalized.subtopic) {
      return void res.status(400).json({ error: "template requires topic and subtopic" });
    }

    const usedKeys = new Set<string>();
    const questionsGenerated = await collectGeneratedQuestions(normalized, usedKeys);

    res.status(201).json({
      template: normalized,
      questions: questionsGenerated,
      totalQuestions: questionsGenerated.length,
    });
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] POST /question-bank/generate", err);
    res.status(400).json({ error: err instanceof Error ? err.message : "Could not generate questions" });
  }
});

// ── GET /question-bank ────────────────────────────────────────────────────────
/** Paginated list with filters and usage stats */
router.get("/question-bank", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const columns = await getQuestionColumnState();

    const page = Math.max(1, parseInt((req.query.page as string) ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt((req.query.pageSize as string) ?? "20", 10)));
    const offset = (page - 1) * pageSize;
    const whereFrag = buildQuestionWhereSql(columns, req);
    const whereClause = whereFrag ? sql`WHERE ${whereFrag}` : sql``;
    const selectColumns = buildQuestionSelectSql(columns);
    const orderBy = columns.hasCreatedAt ? sql`created_at DESC` : sql`id DESC`;

    // Primary query — includes optional columns (global_topic_id, difficulty)
    let rows: any[];
    let totalCount: number;
    try {
      const [rowResult, countResult] = (await Promise.all([
        db.execute(sql`
          SELECT ${selectColumns}
          FROM questions ${whereClause}
          ORDER BY ${orderBy}
          LIMIT ${pageSize} OFFSET ${offset}
        `),
        db.execute(sql`SELECT COUNT(*)::int AS total FROM questions ${whereClause}`),
      ])) as [any[], any[]];
      rows = rowResult;
      totalCount = countResult[0]?.total ?? 0;
    } catch (err) {
      console.warn("[question-bank] list query failed, using broad fallback", err);
      const fallbackSelect = sql.join(
        [
          sql`id`,
          sql`''::text AS client_id`,
          sql`''::text AS test_id`,
          sql`text`,
          sql`options`,
          sql`correct`,
          sql`section`,
          sql`COALESCE(topic, 'General') AS topic`,
          sql`explanation`,
          sql`NOW() AS created_at`,
          sql`NULL::text AS section_id`,
          sql`NULL::text AS topic_id`,
          sql`NULL::text AS global_topic_id`,
          sql`NULL::text AS difficulty`,
          sql`NULL::text AS text_hi`,
          sql`NULL::jsonb AS options_hi`,
          sql`NULL::text AS explanation_hi`,
          sql`NULL::text AS text_pa`,
          sql`NULL::jsonb AS options_pa`,
          sql`NULL::text AS explanation_pa`,
        ],
        sql`, `,
      );
      const [rowResult, countResult] = (await Promise.all([
        db.execute(sql`
          SELECT ${fallbackSelect}
          FROM questions
          ORDER BY id DESC
          LIMIT ${pageSize} OFFSET ${offset}
        `),
        db.execute(sql`SELECT COUNT(*)::int AS total FROM questions`),
      ])) as [any[], any[]];
      rows = rowResult;
      totalCount = countResult[0]?.total ?? 0;
    }

    const usageMap = await fetchUsageStats(rows.map((r: any) => r.id));

    const items = rows.map((q: any) => {
      const usage = usageMap.get(q.id) ?? { usageCount: 0, lastUsedAt: null };
      return {
        id: q.id,
        testId: q.test_id,
        clientId: q.client_id,
        text: q.text,
        options: q.options,
        correct: q.correct,
        section: q.section,
        sectionId: q.section_id ?? null,
        topic: q.topic ?? "General",
        topicId: q.topic_id ?? null,
        globalTopicId: q.global_topic_id ?? q.topic_id ?? "",
        difficulty: q.difficulty ?? null,
        explanation: q.explanation,
        textHi: q.text_hi ?? null,
        optionsHi: q.options_hi ?? null,
        explanationHi: q.explanation_hi ?? null,
        textPa: q.text_pa ?? null,
        optionsPa: q.options_pa ?? null,
        explanationPa: q.explanation_pa ?? null,
        imageUrl: q.image_url ?? null,
        questionType: q.question_type ?? "text",
        diSetId: q.di_set_id ?? null,
        usageCount: usage.usageCount,
        lastUsedAt: usage.lastUsedAt,
      };
    });

    res.json({ items, total: totalCount, page, pageSize });
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] GET /question-bank", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /question-bank/:id ────────────────────────────────────────────────────
router.get("/question-bank/:id", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return void res.status(400).json({ error: "Invalid id" });

    const columns = await getQuestionColumnState();
    const selectColumns = buildQuestionSelectSql(columns);
    const fallbackSelect = sql.join(
      [
        sql`id`,
        sql`''::text AS client_id`,
        sql`''::text AS test_id`,
        sql`text`,
        sql`options`,
        sql`correct`,
        sql`section`,
        sql`COALESCE(topic, 'General') AS topic`,
        sql`explanation`,
        sql`NOW() AS created_at`,
        sql`NULL::text AS section_id`,
        sql`NULL::text AS topic_id`,
        sql`NULL::text AS global_topic_id`,
        sql`NULL::text AS difficulty`,
        sql`NULL::text AS text_hi`,
        sql`NULL::jsonb AS options_hi`,
        sql`NULL::text AS explanation_hi`,
        sql`NULL::text AS text_pa`,
        sql`NULL::jsonb AS options_pa`,
        sql`NULL::text AS explanation_pa`,
      ],
      sql`, `,
    );

    let rows: any[];
    try {
      rows = (await db.execute(sql`
        SELECT ${selectColumns}
        FROM questions WHERE id = ${id} LIMIT 1
      `)) as any[];
    } catch {
      rows = (await db.execute(sql`
        SELECT ${fallbackSelect}
        FROM questions WHERE id = ${id} LIMIT 1
      `)) as any[];
    }
    const q = rows[0];
    if (!q) return void res.status(404).json({ error: "Not found" });

    const usageMap = await fetchUsageStats([id]);
    const usage = usageMap.get(id) ?? { usageCount: 0, lastUsedAt: null };

    res.json({ ...q, ...usage });
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] GET /question-bank/:id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /question-bank/:id/tests ──────────────────────────────────────────────
/** Returns list of tests this question is used in */
router.get("/question-bank/:id/tests", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return void res.status(400).json({ error: "Invalid id" });

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
    if (isMissingRelationError(err, "test_questions")) {
      console.warn("[question-bank] test_questions table missing; returning empty usage list");
      return void res.json([]);
    }
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] GET /question-bank/:id/tests", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /question-bank ───────────────────────────────────────────────────────
/** Create a bank question (standalone — not necessarily in a test) */
router.post("/question-bank", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const {
      text, options, correct, section, topic, globalTopicId, explanation, difficulty,
      textHi, optionsHi, explanationHi, textPa, optionsPa, explanationPa,
      sectionId, topicId, imageUrl, questionType, diSetId,
    } = req.body;

    if (!options || correct === undefined || !section) {
      return void res.status(400).json({ error: "Missing required fields: options, correct, section" });
    }
    // At least one language must be present
    const hasEn = Boolean(text?.trim());
    const hasHi = Boolean(textHi?.trim());
    const hasPa = Boolean(textPa?.trim());
    if (!hasEn && !hasHi && !hasPa) {
      return void res.status(400).json({ error: "At least one language question text is required (text / textHi / textPa)" });
    }
    if (!Array.isArray(options) || options.length !== 4) {
      return void res.status(400).json({ error: "options must be an array of 4 strings" });
    }
    if (typeof correct !== "number" || correct < 0 || correct > 3) {
      return void res.status(400).json({ error: "correct must be 0-3" });
    }
    if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty)) {
      return void res.status(400).json({ error: "difficulty must be Easy, Medium, or Hard" });
    }

    const testId = req.body.testId ?? "";
    const columns = await getQuestionColumnState();

    // Build insert values — only include columns that exist in the DB
    const baseValues: Record<string, any> = {
      text: text?.trim() || null,
      options,
      correct,
      section: section.trim(),
      topic: topic?.trim() ?? "General",
      explanation: explanation?.trim() || null,
    };
    if (columns.hasClientId) baseValues.clientId = "";
    if (columns.hasTestId)   baseValues.testId = testId;
    if (columns.hasSectionId && sectionId !== undefined) baseValues.sectionId = sectionId ?? null;
    if (columns.hasTopicId && topicId !== undefined) baseValues.topicId = topicId ?? null;
    if (columns.hasGlobalTopicId) baseValues.globalTopicId = globalTopicId ?? null;
    if (columns.hasDifficulty) baseValues.difficulty = difficulty ?? null;
    if (columns.hasTextHi) baseValues.textHi = textHi?.trim() || null;
    if (columns.hasOptionsHi) baseValues.optionsHi = optionsHi ?? null;
    if (columns.hasExplanationHi) baseValues.explanationHi = explanationHi?.trim() || null;
    if (columns.hasTextPa) baseValues.textPa = textPa?.trim() || null;
    if (columns.hasOptionsPa) baseValues.optionsPa = optionsPa ?? null;
    if (columns.hasExplanationPa) baseValues.explanationPa = explanationPa?.trim() || null;
    if (columns.hasImageUrl) baseValues.imageUrl = imageUrl?.trim() || null;
    if (columns.hasQuestionType) baseValues.questionType = questionType ?? "text";
    if (columns.hasDiSetId) baseValues.diSetId = diSetId ?? null;

    const [inserted] = await db
      .insert(questions)
      .values(baseValues as typeof questions.$inferInsert)
      .returning();

    res.status(201).json(inserted);
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] POST /question-bank", err);
    res.status(500).json({ error: "Internal server error", detail: (err as any)?.detail ?? (err as any)?.message });
  }
});

// ── PUT /question-bank/:id ────────────────────────────────────────────────────
router.put("/question-bank/:id", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return void res.status(400).json({ error: "Invalid id" });

    const {
      text, options, correct, section, sectionId, topic, topicId, globalTopicId,
      explanation, difficulty,
      textHi, optionsHi, explanationHi, textPa, optionsPa, explanationPa,
      imageUrl, questionType, diSetId,
    } = req.body;

    if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty)) {
      return void res.status(400).json({ error: "difficulty must be Easy, Medium, or Hard" });
    }

    const columns = await getQuestionColumnState();
    const updateData: Record<string, any> = {};
    if (text !== undefined) updateData.text = text.trim();
    if (options !== undefined) updateData.options = options;
    if (correct !== undefined) updateData.correct = correct;
    if (section !== undefined) updateData.section = section.trim();
    if (columns.hasSectionId && sectionId !== undefined) updateData.sectionId = sectionId;
    if (topic !== undefined) updateData.topic = topic.trim();
    if (columns.hasTopicId && topicId !== undefined) updateData.topicId = topicId;
    if (columns.hasGlobalTopicId && globalTopicId !== undefined) updateData.globalTopicId = globalTopicId;
    if (explanation !== undefined) updateData.explanation = explanation.trim();
    if (columns.hasDifficulty && difficulty !== undefined) updateData.difficulty = difficulty;
    if (columns.hasTextHi && textHi !== undefined) updateData.textHi = textHi;
    if (columns.hasOptionsHi && optionsHi !== undefined) updateData.optionsHi = optionsHi;
    if (columns.hasExplanationHi && explanationHi !== undefined) updateData.explanationHi = explanationHi;
    if (columns.hasTextPa && textPa !== undefined) updateData.textPa = textPa;
    if (columns.hasOptionsPa && optionsPa !== undefined) updateData.optionsPa = optionsPa;
    if (columns.hasExplanationPa && explanationPa !== undefined) updateData.explanationPa = explanationPa;
    if (columns.hasImageUrl && imageUrl !== undefined) updateData.imageUrl = imageUrl?.trim() || null;
    if (columns.hasQuestionType && questionType !== undefined) updateData.questionType = questionType;
    if (columns.hasDiSetId && diSetId !== undefined) updateData.diSetId = diSetId ?? null;

    if (Object.keys(updateData).length === 0) {
      return void res.status(400).json({ error: "No fields to update" });
    }

    const [updated] = await db
      .update(questions)
      .set(updateData as Partial<typeof questions.$inferInsert>)
      .where(eq(questions.id, id))
      .returning();

    if (!updated) return void res.status(404).json({ error: "Question not found" });

    res.json(updated);
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] PUT /question-bank/:id", err);
    res.status(500).json({ error: "Internal server error", detail: (err as any)?.detail ?? (err as any)?.message });
  }
});

// ── DELETE /question-bank/:id ─────────────────────────────────────────────────
router.delete("/question-bank/:id", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return void res.status(400).json({ error: "Invalid id" });

    // Check usage
    const usageMap = await fetchUsageStats([id]);
    const usage = usageMap.get(id);
    if (usage && usage.usageCount > 0) {
      return void res.status(409).json({
        error: "Cannot delete question that is used in tests. Remove it from all tests first.",
        usageCount: usage.usageCount,
      });
    }

    await db.delete(questions).where(eq(questions.id, id));
    res.status(204).end();
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
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
router.post("/question-bank/add-to-test", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const { testId, questionIds } = req.body as { testId: string; questionIds: number[] };

    if (!testId || !Array.isArray(questionIds) || questionIds.length === 0) {
      return void res.status(400).json({ error: "testId and a non-empty questionIds array are required" });
    }

    // Validate test exists
    const [testRow] = await db.select({ id: tests.id }).from(tests).where(eq(tests.id, testId)).limit(1);
    if (!testRow) return void res.status(404).json({ error: "Test not found" });

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
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] POST /question-bank/add-to-test", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── DELETE /question-bank/remove-from-test ────────────────────────────────────
/**
 * Remove a question from a test (test_questions row).
 * Body: { testId: string, questionId: number }
 */
router.delete("/question-bank/remove-from-test", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const { testId, questionId } = req.body as { testId: string; questionId: number };

    if (!testId || !questionId) {
      return void res.status(400).json({ error: "testId and questionId are required" });
    }

    await db
      .delete(testQuestions)
      .where(and(eq(testQuestions.testId, testId), eq(testQuestions.questionId, questionId)));

    res.status(204).end();
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
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
router.get("/question-bank/smart-select", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);

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
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[question-bank] GET /question-bank/smart-select", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /question-bank/import-csv ────────────────────────────────────────────
/**
 * Import questions from a CSV file directly into the question bank (no test required).
 *
 * CSV columns:
 *   Required: question_en, optionA_en, optionB_en, optionC_en, optionD_en,
 *             correct_option (A/B/C/D), explanation_en
 *   Required (row or batch): section (per-row column OR body field "section")
 *   Optional per-row: topic, difficulty (Easy/Medium/Hard), di_set_id (DI Set ID or title)
 *   Optional: question_hi, optionA_hi … optionD_hi, explanation_hi
 *   Optional: question_pa, optionA_pa … optionD_pa, explanation_pa
 *
 * Languages are detected automatically from column presence in the header.
 *
 * Multipart body:
 *   - file: CSV
 *   - section: batch-level section name (used when per-row "section" column absent)
 *   - topic: batch-level topic name (used when per-row "topic" column absent)
 */
router.post("/question-bank/import-csv", authenticate, csvUpload.single("file"), async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
  } catch {
    return void res.status(403).json({ error: "Admin access required" });
  }

  if (!req.file) return void res.status(400).json({ error: "No file uploaded" });

  const batchSection = (req.body.section as string | undefined)?.trim() ?? "";
  const batchTopic   = (req.body.topic   as string | undefined)?.trim() ?? "";
  const batchDiSetId = req.body.diSetId ? parseInt(req.body.diSetId as string, 10) : null;

  // Load master tables once (tolerate partially-migrated DBs)
  const [allSections, allTopicsGlobal, allDiSets] = await Promise.all([
    db.select().from(sections).catch((err: any) => {
      if (isMissingRelationError(err, "sections")) {
        console.warn("[question-bank/import-csv] sections table missing; section FK validation disabled");
        return [] as (typeof sections.$inferSelect)[];
      }
      throw err;
    }),
    db.select().from(topicsGlobal).catch((err: any) => {
      if (isMissingRelationError(err, "topics_global")) {
        console.warn("[question-bank/import-csv] topics_global table missing; topic FK validation disabled");
        return [] as (typeof topicsGlobal.$inferSelect)[];
      }
      throw err;
    }),
    db.select().from(diSets).catch(() => [] as (typeof diSets.$inferSelect)[]),
  ]);
  const hasSectionMaster = allSections.length > 0;
  const hasTopicMaster = allTopicsGlobal.length > 0;
  const diSetById = new Map(allDiSets.map((ds) => [ds.id, ds]));
  const diSetByTitle = new Map(allDiSets.map((ds) => [ds.title.trim().toLowerCase(), ds.id]));
  const sectionByName = new Map(allSections.map((s) => [normaliseKey(s.name), s]));
  const topicByName   = new Map(allTopicsGlobal.map((t) => [normaliseKey(t.name), t]));
  const fallbackGlobalTopicId = allTopicsGlobal[0]?.id ?? null;

  const csvText = req.file.buffer.toString("utf-8");
  const lines = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return void res.status(400).json({ error: "CSV must have a header row and at least one data row" });

  const rawHeader = parseCsvLine(lines[0]);
  const header = rawHeader.map((h) => h.toLowerCase().trim().replace(/[^a-z0-9_]/g, ""));
  const get = (cells: string[], col: string) => (cells[header.indexOf(col)] ?? "").trim();

  // Auto-detect languages from header
  const hasEn = header.includes("question_en");
  const hasHi = header.includes("question_hi");
  const hasPa = header.includes("question_pa");
  const detectedLanguages = [...(hasEn ? ["en"] : []), ...(hasHi ? ["hi"] : []), ...(hasPa ? ["pa"] : [])];

  if (detectedLanguages.length === 0) {
    return void res.status(400).json({ error: "CSV must have at least one language column: question_en, question_hi, or question_pa" });
  }

  // Validate that per-language option/explanation columns exist if the question column is present
  if (hasEn) {
    for (const col of ["optiona_en", "optionb_en", "optionc_en", "optiond_en", "explanation_en"]) {
      if (!header.includes(col)) return void res.status(400).json({ error: `Missing column "${col}" required alongside question_en` });
    }
  }
  if (hasHi) {
    for (const col of ["optiona_hi", "optionb_hi", "optionc_hi", "optiond_hi"]) {
      if (!header.includes(col)) return void res.status(400).json({ error: `Missing column "${col}" required alongside question_hi` });
    }
  }
  if (hasPa) {
    for (const col of ["optiona_pa", "optionb_pa", "optionc_pa", "optiond_pa"]) {
      if (!header.includes(col)) return void res.status(400).json({ error: `Missing column "${col}" required alongside question_pa` });
    }
  }
  // correct_option is always required
  if (!header.includes("correct_option")) {
    return void res.status(400).json({ error: 'Missing required column: "correct_option"' });
  }

  const toInsert: (typeof questions.$inferInsert)[] = [];
  const errors: { row: number; reason: string }[] = [];
  const questionColumns = await getQuestionColumnState();

  if (questionColumns.hasGlobalTopicId && !fallbackGlobalTopicId) {
    return void res.status(400).json({
      error: "No global topics found. Create at least one topic before importing to question bank.",
    });
  }

  if (batchDiSetId != null && allDiSets.length > 0 && !diSetById.has(batchDiSetId)) {
    return void res.status(400).json({
      error: `diSetId "${batchDiSetId}" not found. Select a valid DI set before importing.`,
    });
  }

  // Legacy schema note:
  // In many deployments, questions.test_id is NOT NULL and FK -> tests(id).
  // CSV import is "bank" style, so bind to a dedicated system test id instead
  // of auto-attaching imported rows to a real test.
  let resolvedImportTestId = "";
  if (questionColumns.hasTestId) {
    const requestedTestId = (req.body.testId as string | undefined)?.trim();
    if (requestedTestId) {
      const [testRow] = await db.select({ id: tests.id }).from(tests).where(eq(tests.id, requestedTestId)).limit(1);
      if (!testRow) {
        return void res.status(400).json({ error: `testId "${requestedTestId}" not found` });
      }
      resolvedImportTestId = testRow.id;
    } else {
      const bankTestId = await ensureBankTestExists();
      if (!bankTestId) {
        return void res.status(400).json({
          error: "Could not resolve a bank test for import. Please pass a valid testId in request body.",
        });
      }
      resolvedImportTestId = bankTestId;
    }
  }

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const cells = parseCsvLine(lines[i]);

    const questionEn  = hasEn ? get(cells, "question_en") : "";
    const optionAEn   = hasEn ? get(cells, "optiona_en") : "";
    const optionBEn   = hasEn ? get(cells, "optionb_en") : "";
    const optionCEn   = hasEn ? get(cells, "optionc_en") : "";
    const optionDEn   = hasEn ? get(cells, "optiond_en") : "";
    const correctRaw  = get(cells, "correct_option").toUpperCase();
    const explanationEn = hasEn ? get(cells, "explanation_en") : "";
    const difficultyRaw = get(cells, "difficulty");

    // At least one language question text must be present
    const questionHi = hasHi ? get(cells, "question_hi") : "";
    const questionPa = hasPa ? get(cells, "question_pa") : "";
    if (!questionEn && !questionHi && !questionPa) {
      errors.push({ row: rowNum, reason: "No question text in any language (question_en / question_hi / question_pa all empty)" }); continue;
    }
    if (hasEn && questionEn && (!optionAEn || !optionBEn || !optionCEn || !optionDEn)) {
      errors.push({ row: rowNum, reason: "One or more English options are empty for a row that has question_en" }); continue;
    }
    if (!(correctRaw in CORRECT_LETTER)) { errors.push({ row: rowNum, reason: `correct_option "${correctRaw}" is not A/B/C/D` }); continue; }
    if (difficultyRaw && !["Easy", "Medium", "Hard"].includes(difficultyRaw)) {
      errors.push({ row: rowNum, reason: `difficulty "${difficultyRaw}" must be Easy, Medium, or Hard` }); continue;
    }

    // Resolve section
    const rowSection = get(cells, "section") || batchSection;
    if (!rowSection) { errors.push({ row: rowNum, reason: "section is required (add per-row column or batch param)" }); continue; }
    const sectionRow = sectionByName.get(normaliseKey(rowSection));
    if (hasSectionMaster && !sectionRow) {
      errors.push({ row: rowNum, reason: `section "${rowSection}" not found in master sections table` });
      continue;
    }

    // Resolve topic (optional)
    const rowTopic = get(cells, "topic") || batchTopic;
    let topicRow: (typeof allTopicsGlobal)[number] | undefined;
    if (rowTopic && hasTopicMaster) {
      topicRow = topicByName.get(normaliseKey(rowTopic));
      if (!topicRow) { errors.push({ row: rowNum, reason: `topic "${rowTopic}" not found in global topics table` }); continue; }
    }

    // Optional Hindi fields
    const optionAHi  = hasHi ? get(cells, "optiona_hi") : "";
    const optionBHi  = hasHi ? get(cells, "optionb_hi") : "";
    const optionCHi  = hasHi ? get(cells, "optionc_hi") : "";
    const optionDHi  = hasHi ? get(cells, "optiond_hi") : "";
    const explanationHi = hasHi ? get(cells, "explanation_hi") : "";

    // Optional Punjabi fields
    const optionAPa  = hasPa ? get(cells, "optiona_pa") : "";
    const optionBPa  = hasPa ? get(cells, "optionb_pa") : "";
    const optionCPa  = hasPa ? get(cells, "optionc_pa") : "";
    const optionDPa  = hasPa ? get(cells, "optiond_pa") : "";
    const explanationPa = hasPa ? get(cells, "explanation_pa") : "";

    // Base options: use English if available, otherwise fall back to the first available language's options
    const baseOptions = questionEn
      ? [optionAEn, optionBEn, optionCEn, optionDEn]
      : questionPa
        ? [optionAPa, optionBPa, optionCPa, optionDPa]
        : [optionAHi, optionBHi, optionCHi, optionDHi];

    // Resolve DI set: per-row di_set_id column overrides batch
    let rowDiSetId: number | null = batchDiSetId;
    const rawDiSetId = get(cells, "di_set_id").trim();
    if (rawDiSetId) {
      const numId = parseInt(rawDiSetId, 10);
      if (!isNaN(numId) && diSetById.has(numId)) {
        rowDiSetId = numId;
      } else {
        // Try matching by title
        const byTitle = diSetByTitle.get(rawDiSetId.toLowerCase());
        if (byTitle != null) {
          rowDiSetId = byTitle;
        } else {
          errors.push({ row: rowNum, reason: `di_set_id "${rawDiSetId}" not found — use a valid DI Set ID number or title` }); continue;
        }
      }
    }

    const resolvedGlobalTopicId = topicRow?.id ?? fallbackGlobalTopicId ?? null;
    if (questionColumns.hasGlobalTopicId && !resolvedGlobalTopicId) {
      errors.push({ row: rowNum, reason: "No valid global topic id could be resolved for this row" });
      continue;
    }

    toInsert.push({
      testId: resolvedImportTestId,
      clientId: "",
      text: questionEn || questionHi || questionPa || "",
      options: baseOptions as unknown as string,
      correct: CORRECT_LETTER[correctRaw],
      section: sectionRow?.name ?? rowSection,
      sectionId: sectionRow?.id ?? null,
      topic: topicRow?.name ?? rowTopic ?? "General",
      // topic_id references legacy topics(id). CSV import resolves against topics_global,
      // so keep topic_id null to avoid FK violations on environments where IDs differ.
      topicId: null,
      globalTopicId: resolvedGlobalTopicId ?? "",
      explanation: explanationEn || explanationHi || explanationPa || "",
      difficulty: (difficultyRaw as "Easy" | "Medium" | "Hard") || null,
      textHi: questionHi || null,
      optionsHi: questionHi ? [optionAHi || optionAEn, optionBHi || optionBEn, optionCHi || optionCEn, optionDHi || optionDEn] as unknown as string : null,
      explanationHi: explanationHi || null,
      textPa: questionPa || null,
      optionsPa: questionPa ? [optionAPa || optionAEn, optionBPa || optionBEn, optionCPa || optionCEn, optionDPa || optionDEn] as unknown as string : null,
      explanationPa: explanationPa || null,
      imageUrl: null,
      questionType: rowDiSetId ? "di" : "text",
      diSetId: rowDiSetId ?? null,
    });
  }

  // Bulk insert in chunks of 200
  let inserted = 0;
  const CHUNK = 200;
  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const chunk = toInsert.slice(i, i + CHUNK);
    try {
      await db.insert(questions).values(chunk);
    } catch (err: any) {
      if (isUndefinedColumnError(err)) {
        console.warn("[question-bank/import-csv] questions insert hit undefined column; using compatibility insert");
        await insertQuestionChunkCompat(chunk, questionColumns);
      } else if ((err?.code ?? err?.cause?.code) === "23503" || (err?.code ?? err?.cause?.code) === "23502") {
        const detail = String(err?.detail ?? err?.cause?.detail ?? err?.message ?? "constraint failure");
        return void res.status(400).json({
          error: "CSV import failed due to invalid DB references or required fields",
          detail,
        });
      } else {
        throw err;
      }
    }
    inserted += chunk.length;
  }

  res.json({
    inserted,
    skipped: lines.length - 1 - toInsert.length,
    errors,
    detectedLanguages,
  });
});

export default router;
