import type { Question as ApiQuestion, TestSection } from "@workspace/api-zod";

type QuestionRow = {
  id: number;
  text: string;
  options: unknown;
  correct: number;
  section: string;
  explanation: string;
  textHi?: string | null;
  optionsHi?: unknown | null;
  explanationHi?: string | null;
  textPa?: string | null;
  optionsPa?: unknown | null;
  explanationPa?: string | null;
};

function toOptions(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map(String) : [value];
    } catch {
      return [value];
    }
  }
  return [];
}

export function toApiQuestions(rows: QuestionRow[]): ApiQuestion[] {
  return rows.map((q) => ({
    id: q.id,
    text: q.text,
    options: toOptions(q.options),
    correct: q.correct,
    section: q.section,
    explanation: q.explanation,
    textHi: q.textHi ?? null,
    optionsHi: q.optionsHi != null ? toOptions(q.optionsHi) : null,
    explanationHi: q.explanationHi ?? null,
    textPa: q.textPa ?? null,
    optionsPa: q.optionsPa != null ? toOptions(q.optionsPa) : null,
    explanationPa: q.explanationPa ?? null,
  }));
}

function normalizeSectionsMeta(raw: unknown): { id: string; name: string }[] {
  if (raw == null) return [];
  if (typeof raw === "string") {
    try {
      return normalizeSectionsMeta(JSON.parse(raw) as unknown);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && "name" in item)
    .map((item, idx) => ({
      id: typeof item.id === "string" && item.id ? item.id : `section-${idx}`,
      name: String(item.name ?? `Section ${idx + 1}`),
    }));
}

function synthesizeSections(testQuestions: QuestionRow[]): TestSection[] {
  const bySection = new Map<string, QuestionRow[]>();
  for (const q of testQuestions) {
    const list = bySection.get(q.section) ?? [];
    list.push(q);
    bySection.set(q.section, list);
  }
  let n = 0;
  return [...bySection.entries()].map(([name, qs]) => ({
    id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${n++}`,
    name,
    questions: toApiQuestions(qs),
  }));
}

/**
 * Attach questions to section metadata from the tests row. When the DB stores
 * empty `sections` (common for seeded rows), derive sections from question.section.
 */
export function buildSectionsWithQuestions(rawSections: unknown, testQuestions: QuestionRow[]): TestSection[] {
  const meta = normalizeSectionsMeta(rawSections);
  const qp = toApiQuestions(testQuestions);

  if (meta.length > 0) {
    const built = meta.map((section) => ({
      id: section.id,
      name: section.name,
      questions: qp.filter((q) => q.section === section.name),
    }));
    if (built.some((s) => s.questions.length > 0)) {
      return built.filter((s) => s.questions.length > 0);
    }
  }

  return synthesizeSections(testQuestions);
}
