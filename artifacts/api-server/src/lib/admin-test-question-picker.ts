/**
 * Filters for the Test Builder question picker. The picker searches the
 * question bank on the server (paged) instead of loading every question into
 * the browser, so the bank can grow past a few thousand questions.
 *
 * Questions stay reusable across exams: the exam filter is optional and only
 * narrows the list; it never makes a question exclusive to one exam.
 */
export interface QuestionPickerQuery {
  search: string;
  taxonomyNodeIds: string[];
  difficulties: string[];
  questionTypes: string[];
  examVersionId: string | null;
  /** Language codes every returned question must have approved (English is always present). */
  languages: string[];
  /** usage filter: any | unused (never in a live/scheduled test) */
  usage: "any" | "unused";
  excludeVersionIds: string[];
  sort: "newest" | "least_used";
  limit: number;
  offset: number;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DIFFICULTIES = new Set(["easy", "medium", "moderate", "hard"]);
const LANGUAGE = /^[a-z]{2,3}$/;

function list(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return [...new Set(raw.map((item) => String(item).trim()).filter(Boolean))];
}

export function normalizePickerQuery(input: Record<string, unknown>): QuestionPickerQuery {
  const limit = Math.min(100, Math.max(1, Number.parseInt(String(input.limit ?? "50"), 10) || 50));
  const offset = Math.min(100000, Math.max(0, Number.parseInt(String(input.offset ?? "0"), 10) || 0));
  const examVersionId = typeof input.examVersionId === "string" && UUID.test(input.examVersionId)
    ? input.examVersionId
    : null;
  return {
    search: typeof input.q === "string" ? input.q.trim().slice(0, 200) : "",
    taxonomyNodeIds: list(input.taxonomyNodeIds).filter((id) => UUID.test(id)).slice(0, 20),
    difficulties: list(input.difficulties).map((d) => d.toLowerCase()).filter((d) => DIFFICULTIES.has(d)),
    questionTypes: list(input.questionTypes).map((t) => t.slice(0, 60)).slice(0, 20),
    examVersionId,
    languages: list(input.languages).map((l) => l.toLowerCase()).filter((l) => LANGUAGE.test(l) && l !== "en").slice(0, 5),
    usage: input.usage === "unused" ? "unused" : "any",
    excludeVersionIds: list(input.excludeVersionIds).filter((id) => UUID.test(id)).slice(0, 500),
    sort: input.sort === "least_used" ? "least_used" : "newest",
    limit,
    offset,
  };
}

/** Escape LIKE wildcards so user text is matched literally. */
export function likePattern(search: string): string {
  return `%${search.replace(/[\\%_]/g, (ch) => `\\${ch}`)}%`;
}
