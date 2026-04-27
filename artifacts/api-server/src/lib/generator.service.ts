import { db } from "./db";
import { categories, questions, tests, type MockDifficulty, type MockSection } from "@workspace/db";
import { eq } from "drizzle-orm";
import { pickDiversePattern, markPatternUsed } from "./pattern.service";
import { renderTemplate, buildOptions } from "./template.service";
import { refineWithAI, isAIConfigured } from "./ai.service";
import { validateQuestion } from "./validation.service";
import type { GenerateOptions } from "./generator.types";

export type GeneratedQuestion = {
  id?: number;
  patternId: string;
  patternName: string;
  section: MockSection;
  topic: string;
  subtopic: string;
  difficulty: MockDifficulty;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  qualityScore: number;
  aiRefined: boolean;
  aiSource: "openai" | "mock" | "skipped";
  validation: { valid: boolean; issues: string[] };
};

const MAX_PATTERN_RETRIES = 3;
const BANK_TEST_ID = "__bank__";

function normalizeQuestionKey(questionText: string, options: string[]) {
  return `${questionText.trim().toLowerCase()}|${options.map((option) => option.trim().toLowerCase()).join("|")}`;
}

function isDbReady() {
  return Boolean(db);
}

async function ensureBankTestExists() {
  const existing = await db.select({ id: tests.id }).from(tests).where(eq(tests.id, BANK_TEST_ID)).limit(1);
  if (existing.length > 0) {
    return;
  }

  const [templateTest] = await db.select().from(tests).limit(1);
  if (templateTest) {
    await db.insert(tests).values({
      id: BANK_TEST_ID,
      name: "Question Bank (System)",
      category: templateTest.category,
      categoryId: templateTest.categoryId,
      duration: 1,
      totalQuestions: 0,
      difficulty: templateTest.difficulty,
      sections: [],
    });
    return;
  }

  const [category] = await db.select().from(categories).limit(1);
  if (!category) {
    throw new Error("Unable to create bank test anchor: no categories exist");
  }

  await db.insert(tests).values({
    id: BANK_TEST_ID,
    name: "Question Bank (System)",
    category: category.name,
    categoryId: category.id,
    duration: 1,
    totalQuestions: 0,
    difficulty: "Easy",
    sections: [],
  });
}

async function generateOne(opts: GenerateOptions): Promise<GeneratedQuestion | null> {
  for (let attempt = 0; attempt < MAX_PATTERN_RETRIES; attempt++) {
    const pattern = await pickDiversePattern({
      section: opts.section,
      topic: opts.topic,
      subtopic: opts.subtopic,
      difficulty: opts.difficulty,
      patternIds: opts.patternIds,
    });
    if (!pattern) return null;

    let rendered;
    try {
      rendered = renderTemplate(pattern);
    } catch (error) {
      console.warn("[generator] template render failed, retrying:", (error as Error).message);
      continue;
    }

    const options = buildOptions(pattern, rendered.computedAnswer);
    const useAI = opts.useAI !== false;
    const refined = useAI
      ? await refineWithAI({
          questionText: rendered.questionText,
          options,
          correctAnswer: rendered.computedAnswer,
          section: pattern.section,
          topic: pattern.topic,
        })
      : {
          questionText: rendered.questionText,
          options,
          explanation: "",
          refined: false,
          source: "skipped" as const,
        };

    const validation = validateQuestion({
      questionText: refined.questionText,
      options: refined.options,
      correctAnswer: rendered.computedAnswer,
    });

    if (!validation.valid && attempt < MAX_PATTERN_RETRIES - 1) {
      console.warn("[generator] validation failed, retrying:", validation.issues);
      continue;
    }

    let savedId: number | undefined;
    if (opts.persist !== false && isDbReady()) {
      await ensureBankTestExists();
      const correctIndex = refined.options.findIndex((option) => option === rendered.computedAnswer);
      if (correctIndex < 0) {
        return null;
      }

      const [row] = await db.insert(questions).values({
        testId: BANK_TEST_ID,
        patternId: pattern.id,
        text: refined.questionText,
        options: refined.options,
        correct: correctIndex,
        section: pattern.section,
        topic: pattern.topic,
        subtopic: pattern.subtopic ?? "",
        explanation: refined.explanation,
        difficulty:
          pattern.difficulty === "easy" ? "Easy" : pattern.difficulty === "medium" ? "Medium" : "Hard",
        aiRefined: refined.refined ? 1 : 0,
        qualityScore: validation.score,
      }).returning({ id: questions.id });
      savedId = row.id;
      await markPatternUsed(pattern.id);
    }

    return {
      id: savedId,
      patternId: pattern.id,
      patternName: pattern.name,
      section: pattern.section,
      topic: pattern.topic,
      subtopic: pattern.subtopic ?? "",
      difficulty: pattern.difficulty,
      questionText: refined.questionText,
      options: refined.options,
      correctAnswer: rendered.computedAnswer,
      explanation: refined.explanation,
      qualityScore: validation.score,
      aiRefined: refined.refined,
      aiSource: refined.source,
      validation: { valid: validation.valid, issues: validation.issues },
    };
  }
  return null;
}

export async function generateQuestions(opts: GenerateOptions = {}) {
  const count = Math.min(Math.max(opts.count ?? 1, 1), 20);
  const results: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const question = await generateOne(opts);
    if (question) results.push(question);
  }

  return {
    questions: results,
    meta: {
      requested: count,
      generated: results.length,
      dbConnected: isDbReady(),
      aiConfigured: isAIConfigured(),
    },
  };
}
