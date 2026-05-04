import type { Question as ApiQuestion, TestSection } from "@workspace/api-zod";

type QuestionRow = {
  id: number;
  text: string;
  options: unknown;
  correct: number;
  section: string;
  explanation: string;
  textHi?: string | null;
  text_hi?: string | null;
  optionsHi?: unknown | null;
  options_hi?: unknown | null;
  explanationHi?: string | null;
  explanation_hi?: string | null;
  textPa?: string | null;
  text_pa?: string | null;
  optionsPa?: unknown | null;
  options_pa?: unknown | null;
  explanationPa?: string | null;
  explanation_pa?: string | null;
  seatingDiagram?: unknown | null;
  seating_diagram?: unknown | null;
  seatingExplanationFlow?: unknown | null;
  seating_explanation_flow?: unknown | null;
  // DI / image fields
  imageUrl?: string | null;
  image_url?: string | null;
  questionType?: string | null;
  question_type?: string | null;
  diSetId?: number | null;
  di_set_id?: number | null;
  diSetTitle?: string | null;
  diSetImageUrl?: string | null;
  diSetDescription?: string | null;
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
  return rows.map((q) => {
    const imageUrl = q.imageUrl ?? (q as any).image_url ?? null;
    const questionType = q.questionType ?? (q as any).question_type ?? "text";
    const diSetId = q.diSetId ?? (q as any).di_set_id ?? null;
    const textHi = q.textHi ?? (q as any).text_hi ?? null;
    const optionsHi = q.optionsHi ?? (q as any).options_hi ?? null;
    const explanationHi = q.explanationHi ?? (q as any).explanation_hi ?? null;
    const textPa = q.textPa ?? (q as any).text_pa ?? null;
    const optionsPa = q.optionsPa ?? (q as any).options_pa ?? null;
    const explanationPa = q.explanationPa ?? (q as any).explanation_pa ?? null;
    const seatingDiagram = q.seatingDiagram ?? (q as any).seating_diagram ?? null;
    const seatingExplanationFlow = q.seatingExplanationFlow ?? (q as any).seating_explanation_flow ?? null;
    const result: ApiQuestion & Record<string, unknown> = {
      id: q.id,
      text: q.text,
      options: toOptions(q.options),
      correct: q.correct,
      section: q.section,
      explanation: q.explanation,
      textHi,
      optionsHi: optionsHi != null ? toOptions(optionsHi) : null,
      explanationHi,
      textPa,
      optionsPa: optionsPa != null ? toOptions(optionsPa) : null,
      explanationPa,
    };
    if (seatingDiagram) result.seatingDiagram = seatingDiagram;
    if (seatingExplanationFlow) result.seatingExplanationFlow = seatingExplanationFlow;
    // Attach image/DI fields so the test UI can render them
    if (imageUrl) result.imageUrl = imageUrl;
    if (questionType && questionType !== "text") result.questionType = questionType;
    if (diSetId) result.diSetId = diSetId;
    if (q.diSetTitle) result.diSetTitle = q.diSetTitle;
    if (q.diSetImageUrl) result.diSetImageUrl = q.diSetImageUrl;
    if (q.diSetDescription) result.diSetDescription = q.diSetDescription;
    return result as ApiQuestion;
  });
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
