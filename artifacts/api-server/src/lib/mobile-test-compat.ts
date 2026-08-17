import { stablePublishedQuestionId } from "./published-test-runner";

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function text(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  const result = String(value).trim();
  return result || fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function integerValue(value: unknown, fallback = 0): number {
  return Math.trunc(numberValue(value, fallback));
}

function booleanValue(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value.toLowerCase() === "true" || value === "1";
  return false;
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

export function normalizeMobileDifficulty(value: unknown): "Easy" | "Medium" | "Hard" {
  const normalized = text(value).toLowerCase();
  if (normalized === "easy" || normalized === "beginner") return "Easy";
  if (normalized === "hard" || normalized === "difficult" || normalized === "advanced") return "Hard";
  return "Medium";
}

export function normalizeMobileTestKind(value: unknown): "full-length" | "sectional" | "topic-wise" {
  const normalized = text(value).toLowerCase().replaceAll("_", "-");
  if (normalized.includes("section")) return "sectional";
  if (normalized.includes("topic")) return "topic-wise";
  return "full-length";
}

function normalizeQuestionType(value: unknown): "text" | "image" | "di" {
  const normalized = text(value).toLowerCase();
  if (normalized.includes("image")) return "image";
  if (normalized === "di" || normalized.includes("data_interpretation") || normalized.includes("data-interpretation")) return "di";
  return "text";
}

function normalizeLanguages(value: unknown, fallback: unknown): string[] {
  const values = strings(value);
  const fallbackCode = text(fallback, "en");
  return [...new Set(values.length > 0 ? values : [fallbackCode])];
}

export function legacyMobileSection(row: JsonRecord, questions: unknown[] = []) {
  return {
    id: text(row.id, text(row.sectionKey, "section")),
    name: text(row.name, "General"),
    questions,
  };
}

export function legacyMobileTest(row: JsonRecord, sections: unknown[] = []) {
  const settings = record(row.settings);
  const paidAccessRequired = booleanValue(row.paidAccessRequired)
    || text(settings.access).toLowerCase() === "paid";
  const priceMinor = Math.max(0, integerValue(row.priceMinor ?? settings.priceCents, 499));
  const maxAttempts = integerValue(settings.maxAttempts, 99);
  const durationSeconds = Math.max(0, numberValue(row.durationSeconds));
  const totalQuestions = Math.max(0, integerValue(row.questionCount));
  const description = text(row.description);

  return {
    id: text(row.id),
    name: text(row.title, "Untitled Test"),
    category: text(row.examFamilyName, "Exams"),
    categoryId: text(row.examFamilyCode),
    categoryName: text(row.examFamilyName, "Exams"),
    subcategoryId: text(row.examCode),
    subcategoryName: text(row.examName),
    access: paidAccessRequired ? "paid" as const : "free" as const,
    priceCents: paidAccessRequired ? priceMinor : null,
    kind: normalizeMobileTestKind(settings.testType),
    topicName: description || null,
    duration: Math.max(1, Math.ceil(durationSeconds / 60)),
    totalQuestions,
    attempts: Math.max(0, integerValue(row.attempts)),
    avgScore: Math.max(0, integerValue(row.avgScore)),
    difficulty: normalizeMobileDifficulty(settings.difficulty),
    sections,
    marksPerQuestion: Math.max(0, numberValue(row.marksPerQuestion, 1)),
    negativeMarks: Math.max(0, numberValue(row.negativeMarks, 0)),
    languages: normalizeLanguages(row.languages, settings.languageCode),
    maxAttempts: maxAttempts > 0 ? maxAttempts : 99,
  };
}

export function legacyMobileQuestion(row: JsonRecord, index = 0) {
  const rawOptions = Array.isArray(row.options) ? row.options : [];
  const options = rawOptions
    .map((item) => record(item))
    .sort((left, right) => integerValue(left.sortOrder) - integerValue(right.sortOrder));
  const answerModel = record(row.answerModel);
  let correct = options.findIndex((option) => booleanValue(option.isCorrect));
  if (correct < 0) correct = integerValue(answerModel.correctIndex, 0);
  if (correct < 0 || correct >= options.length) correct = 0;

  const questionVersionId = text(
    row.questionVersionId,
    `${text(row.publicCode, "question")}:${integerValue(row.position, index + 1)}`,
  );

  return {
    id: stablePublishedQuestionId(questionVersionId, index),
    text: text(row.stem),
    options: options.map((option) => text(option.text)),
    correct,
    section: text(row.sectionName, "General"),
    explanation: text(row.explanation),
    difficulty: normalizeMobileDifficulty(row.difficulty),
    topic: text(row.topicName),
    questionType: normalizeQuestionType(row.questionType),
    marks: Math.max(0, numberValue(row.marks ?? row.defaultMarks, 1)),
  };
}
