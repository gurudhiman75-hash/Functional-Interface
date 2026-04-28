import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { patterns, questions, tests, categories, type Pattern } from "@workspace/db";

export type VariableSpec =
  | { min: number; max: number }
  | { min: number; max: number; decimals?: number }
  | { values: (string | number)[] };

export type CreatePatternInput = {
  name: string;
  section: string;
  topic: string;
  subtopic: string;
  template: string;
  answerExpression: string;
  variables: Record<string, VariableSpec>;
};

export type GeneratedQuestion = {
  id: number;
  patternId: string;
  patternName: string;
  section: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  variables: Record<string, string | number>;
  qualityScore: number;
  aiRefined: boolean;
  aiSource: "skipped";
  validation: { valid: boolean; issues: string[] };
  createdAt: string;
};

type NumericLike = number | string;

const BANK_TEST_ID = "__bank__";

function assertNonEmpty(label: string, value: unknown): string {
  const text = String(value ?? "").trim();
  if (!text) {
    throw new Error(`${label} is required`);
  }
  return text;
}

function normalizeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error("Expression evaluated to a non-finite number");
  }
  const rounded = Number(value.toFixed(2));
  return Number.isInteger(rounded) ? Math.trunc(rounded) : rounded;
}

function formatValue(value: unknown): string {
  if (typeof value === "number") {
    return String(normalizeNumber(value));
  }
  return String(value);
}

function pickRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function pickVariable(spec: VariableSpec): number | string {
  if ("values" in spec) {
    if (!Array.isArray(spec.values) || spec.values.length === 0) {
      throw new Error("Variable choice list cannot be empty");
    }
    return spec.values[pickRandomIndex(spec.values.length)] ?? spec.values[0];
  }

  const min = Number(spec.min);
  const max = Number(spec.max);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
    throw new Error("Variable range is invalid");
  }

  const decimals = Number.isInteger(min) && Number.isInteger(max)
    ? 0
    : Math.max(0, Math.min(4, "decimals" in spec ? (spec.decimals ?? 2) : 2));
  const raw = Math.random() * (max - min) + min;
  return decimals === 0 ? Math.round(raw) : Number(raw.toFixed(decimals));
}

function renderTemplate(template: string, variables: Record<string, number | string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => {
    if (!(key in variables)) {
      throw new Error(`Missing variable "${key}"`);
    }
    return String(variables[key]);
  });
}

function evaluateExpression(expression: string, variables: Record<string, number | string>): string | number {
  const keys = Object.keys(variables);
  const values = Object.values(variables);
  // Restricted evaluation: only the provided variables and Math are available.
  // eslint-disable-next-line no-new-func
  const fn = new Function(...keys, "Math", `"use strict"; return (${expression});`);
  return fn(...values, Math);
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function buildOptions(correctAnswer: string): { options: string[]; correctIndex: number } {
  const numeric = Number(correctAnswer);
  let candidates: string[];

  if (Number.isFinite(numeric)) {
    const bases = [0.1, 0.2, -0.1, -0.2];
    candidates = [correctAnswer];
    for (const factor of bases) {
      const raw = numeric === 0 ? factor * 10 : numeric * (1 + factor);
      const value = normalizeNumber(raw);
      candidates.push(String(value));
    }

    if (uniqueStrings(candidates).length < 4) {
      candidates.push(String(normalizeNumber(numeric + 1)));
      candidates.push(String(normalizeNumber(numeric - 1)));
    }
  } else {
    candidates = [
      correctAnswer,
      `${correctAnswer} (alt 1)`,
      `${correctAnswer} (alt 2)`,
      `${correctAnswer} (alt 3)`,
    ];
  }

  const unique = uniqueStrings(candidates);
  while (unique.length < 4) {
    unique.push(`${correctAnswer} ${unique.length + 1}`);
  }

  const shuffled = unique.slice(0, 4);
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = pickRandomIndex(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const correctIndex = shuffled.findIndex((value) => value === correctAnswer);
  if (correctIndex < 0) {
    shuffled[0] = correctAnswer;
    return { options: shuffled, correctIndex: 0 };
  }
  return { options: shuffled, correctIndex };
}

async function ensureBankTestExists(): Promise<string> {
  const existing = await db.select({ id: tests.id }).from(tests).where(eq(tests.id, BANK_TEST_ID)).limit(1);
  if (existing.length > 0) {
    return existing[0].id;
  }

  const [category] = await db.select().from(categories).limit(1);
  if (!category) {
    throw new Error("Cannot create question bank anchor without at least one category");
  }

  await db.insert(tests).values({
    id: BANK_TEST_ID,
    name: "Question Bank",
    category: category.name,
    categoryId: category.id,
    duration: 1,
    totalQuestions: 0,
    difficulty: "Easy",
    sections: [],
  });

  return BANK_TEST_ID;
}

export async function listPatternsFn(): Promise<Pattern[]> {
  return db.select().from(patterns).orderBy(desc(patterns.createdAt));
}

export async function createPatternFn(input: CreatePatternInput): Promise<Pattern> {
  const name = assertNonEmpty("name", input.name);
  const section = assertNonEmpty("section", input.section);
  const topic = assertNonEmpty("topic", input.topic);
  const subtopic = assertNonEmpty("subtopic", input.subtopic);
  const template = assertNonEmpty("template", input.template);
  const answerExpression = assertNonEmpty("answerExpression", input.answerExpression);

  const variables = input.variables && typeof input.variables === "object" && !Array.isArray(input.variables)
    ? input.variables
    : (() => { throw new Error("variables must be a JSON object"); })();

  const [created] = await db.insert(patterns).values({
    id: randomUUID(),
    name,
    section,
    topic,
    subtopic,
    template,
    answerExpression,
    variables,
  }).returning();

  if (!created) {
    throw new Error("Pattern creation failed");
  }

  return created;
}

export async function generateQuestionsFn(input: { patternId: string; count: number }): Promise<{ questions: GeneratedQuestion[] }> {
  const patternId = assertNonEmpty("patternId", input.patternId);
  const count = Math.max(1, Math.floor(Number(input.count) || 1));

  const [pattern] = await db.select().from(patterns).where(eq(patterns.id, patternId)).limit(1);
  if (!pattern) {
    throw new Error("Pattern not found");
  }

  const bankTestId = await ensureBankTestExists();
  const generated: GeneratedQuestion[] = [];

  for (let i = 0; i < count; i += 1) {
    const variables: Record<string, number | string> = {};
    const specs = pattern.variables as Record<string, VariableSpec>;
    for (const [key, spec] of Object.entries(specs ?? {})) {
      variables[key] = pickVariable(spec);
    }

    const questionText = renderTemplate(pattern.template, variables);
    const evaluated = evaluateExpression(pattern.answerExpression, variables);
    const correctAnswer = formatValue(evaluated);
    const { options, correctIndex } = buildOptions(correctAnswer);
    const explanation = `Use ${JSON.stringify(variables)} in ${pattern.answerExpression} to get ${correctAnswer}.`;

    const [row] = await db.insert(questions).values({
      testId: bankTestId,
      patternId: pattern.id,
      text: questionText,
      options,
      correct: correctIndex,
      section: pattern.section,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      explanation,
      createdAt: new Date(),
    }).returning({
      id: questions.id,
      createdAt: questions.createdAt,
    });

    if (!row) {
      throw new Error("Question insert failed");
    }

    generated.push({
      id: row.id,
      patternId: pattern.id,
      patternName: pattern.name,
      section: pattern.section,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      difficulty: pattern.difficulty,
      questionText,
      options,
      correctAnswer,
      explanation,
      variables,
      qualityScore: 0,
      aiRefined: false,
      aiSource: "skipped",
      validation: { valid: true, issues: [] },
      createdAt: new Date(row.createdAt as unknown as string).toISOString(),
    });
  }

  return { questions: generated };
}
