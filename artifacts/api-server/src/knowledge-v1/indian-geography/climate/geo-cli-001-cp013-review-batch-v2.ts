import { GEO_CLI_001_CP001_REVIEW_BATCH_V4 } from "./geo-cli-001-cp001-review-batch-v4";
import { GEO_CLI_001_CP002_REVIEW_BATCH_V4 } from "./geo-cli-001-cp002-review-batch-v4";
import { GEO_CLI_001_CP003_REVIEW_BATCH_V2 } from "./geo-cli-001-cp003-review-batch-v2";
import { GEO_CLI_001_CP004_REVIEW_BATCH_V2 } from "./geo-cli-001-cp004-review-batch-v2";
import { GEO_CLI_001_CP005_REVIEW_BATCH_V1 } from "./geo-cli-001-cp005-review-batch-v1";
import { GEO_CLI_001_CP006_REVIEW_BATCH_V2 } from "./geo-cli-001-cp006-review-batch-v2";
import { GEO_CLI_001_CP007_REVIEW_BATCH_V1 } from "./geo-cli-001-cp007-review-batch-v1";
import { GEO_CLI_001_CP008_REVIEW_BATCH_V2 } from "./geo-cli-001-cp008-review-batch-v2";
import { GEO_CLI_001_CP009_REVIEW_BATCH_V2 } from "./geo-cli-001-cp009-review-batch-v2";
import { GEO_CLI_001_CP010_REVIEW_BATCH_V3 } from "./geo-cli-001-cp010-review-batch-v3";
import { GEO_CLI_001_CP011_REVIEW_BATCH_V1 } from "./geo-cli-001-cp011-review-batch-v1";
import CP012_SYNC from "./geo-cli-001-cp013-cp012-sync-v1";

export type GeoCli001Cp013Difficulty = "Easy" | "Medium" | "Hard";

type OwningQuestion = {
  questionId: string; qlId: string; qlName: string; difficulty: GeoCli001Cp013Difficulty;
  stem: string; options: readonly string[]; correctIndex: number; canonicalAnswer: string;
  explanation: string; sourceIds: readonly string[]; sourceFactIds: readonly string[];
};

export interface GeoCli001Cp013Question extends OwningQuestion {
  sourceQuestionId: string;
  reviewOnly: true;
  runtimeRegistered: false;
}

const OLD_BATCHES: readonly (readonly OwningQuestion[])[] = [
  GEO_CLI_001_CP001_REVIEW_BATCH_V4,
  GEO_CLI_001_CP002_REVIEW_BATCH_V4,
  GEO_CLI_001_CP003_REVIEW_BATCH_V2,
  GEO_CLI_001_CP004_REVIEW_BATCH_V2,
  GEO_CLI_001_CP005_REVIEW_BATCH_V1,
  GEO_CLI_001_CP006_REVIEW_BATCH_V2,
  GEO_CLI_001_CP007_REVIEW_BATCH_V1,
  GEO_CLI_001_CP008_REVIEW_BATCH_V2,
  GEO_CLI_001_CP009_REVIEW_BATCH_V2,
  GEO_CLI_001_CP010_REVIEW_BATCH_V3,
  GEO_CLI_001_CP011_REVIEW_BATCH_V1,
];

const INTERNAL_BANNED = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b/i;
const FINAL_BANNED = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b|\bbroad(?:ly)?\b/i;

function qlNumber(qlId: string): number { return Number(qlId.slice(-3)); }
function learnerText(q: OwningQuestion): string { return `${q.stem}\n${q.options.join("\n")}\n${q.explanation}`; }
function normalizeLegacy(text: string): string {
  return text.replace(/\bbroadly\b/gi, "generally").replace(/\bbroad\b/gi, "general");
}
function structurallyClean(q: OwningQuestion): boolean {
  return q.options.length === 4 && new Set(q.options).size === 4 && q.options[q.correctIndex] === q.canonicalAnswer &&
    q.sourceIds.length > 0 && q.sourceFactIds.length > 0 && !INTERNAL_BANNED.test(learnerText(q));
}
function pickSpaced(values: readonly number[], count: number): Set<number> {
  if (values.length < count) throw new Error(`Not enough eligible QLs: need ${count}, have ${values.length}`);
  const chosen = new Set<number>();
  for (let i = 0; i < count; i += 1) chosen.add(values[Math.floor(i * values.length / count)]!);
  if (chosen.size !== count) throw new Error(`Spaced selection collapsed: ${chosen.size}/${count}`);
  return chosen;
}

const BY_QL = new Map<number, OwningQuestion[]>();
for (const q of OLD_BATCHES.flat().filter(structurallyClean)) {
  const n = qlNumber(q.qlId);
  if (n < 1 || n > 99) continue;
  const bucket = BY_QL.get(n) ?? [];
  bucket.push(q);
  BY_QL.set(n, bucket);
}
for (let n = 1; n <= 99; n += 1) {
  if (!(BY_QL.get(n)?.length)) throw new Error(`No approved representative candidate for QL${String(n).padStart(3, "0")}`);
}

const HARD_QLS = pickSpaced(
  Array.from({ length: 99 }, (_, i) => i + 1).filter((n) => BY_QL.get(n)!.some((q) => q.difficulty === "Hard")),
  11,
);
const EASY_QLS = pickSpaced(
  Array.from({ length: 99 }, (_, i) => i + 1).filter((n) => !HARD_QLS.has(n) && BY_QL.get(n)!.some((q) => q.difficulty === "Easy")),
  33,
);

function choose(n: number): OwningQuestion {
  const bucket = BY_QL.get(n)!;
  const target: GeoCli001Cp013Difficulty = HARD_QLS.has(n) ? "Hard" : EASY_QLS.has(n) ? "Easy" : "Medium";
  const selected = bucket.find((q) => q.difficulty === target) ?? bucket.find((q) => q.difficulty === "Medium") ?? bucket[0]!;
  return selected;
}

const SOURCE_QUESTIONS: readonly OwningQuestion[] = Object.freeze([
  ...Array.from({ length: 99 }, (_, i) => choose(i + 1)),
  ...(CP012_SYNC as unknown as readonly OwningQuestion[]),
]);

function normalizedQuestion(source: OwningQuestion, index: number): GeoCli001Cp013Question {
  const correctIndex = index % 4;
  const answer = normalizeLegacy(source.canonicalAnswer);
  const normalizedOptions = source.options.map(normalizeLegacy);
  const distractors = normalizedOptions.filter((option) => option !== answer);
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze({
    questionId: `GEO-CLI-001-CP013-Q${String(index + 1).padStart(3, "0")}`,
    sourceQuestionId: source.questionId,
    qlId: source.qlId,
    qlName: source.qlName,
    difficulty: source.difficulty,
    stem: normalizeLegacy(source.stem),
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: answer,
    explanation: normalizeLegacy(source.explanation),
    sourceIds: source.sourceIds,
    sourceFactIds: source.sourceFactIds,
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  });
}

export const GEO_CLI_001_CP013_REVIEW_BATCH_V2: readonly GeoCli001Cp013Question[] = Object.freeze(
  SOURCE_QUESTIONS.map(normalizedQuestion),
);

export function auditGeoCli001Cp013ReviewBatchV2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const sourceQuestionIds = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp013Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_CLI_001_CP013_REVIEW_BATCH_V2) {
    if (ids.has(q.questionId)) issues.push(`DUPLICATE_ID:${q.questionId}`); ids.add(q.questionId);
    if (sourceQuestionIds.has(q.sourceQuestionId)) issues.push(`DUPLICATE_SOURCE:${q.sourceQuestionId}`); sourceQuestionIds.add(q.sourceQuestionId);
    const stem = q.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stem)) issues.push(`DUPLICATE_STEM:${q.questionId}`); stems.add(stem);
    const semantic = `${stem}::${q.canonicalAnswer.toLowerCase()}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${q.questionId}`); semantics.add(semantic);
    const explanation = q.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(explanation)) issues.push(`DUPLICATE_EXPLANATION:${q.questionId}`); explanations.add(explanation);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push(`OPTIONS:${q.questionId}`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`ANSWER:${q.questionId}`);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push(`PROVENANCE:${q.questionId}`);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push(`LIFECYCLE:${q.questionId}`);
    if (q.stem.length < 20 || q.stem.length > 240 || !q.stem.trim().endsWith("?")) issues.push(`STEM_SHAPE:${q.questionId}`);
    if (q.explanation.length < 45) issues.push(`SHORT_EXPLANATION:${q.questionId}`);
    if (FINAL_BANNED.test(learnerText(q))) issues.push(`LEARNER_TEXT:${q.questionId}`);
  }

  if (GEO_CLI_001_CP013_REVIEW_BATCH_V2.length !== 108) issues.push(`COUNT:${GEO_CLI_001_CP013_REVIEW_BATCH_V2.length}`);
  for (let n = 1; n <= 108; n += 1) {
    const qlId = `GEO-CLI-001-QL-${String(n).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 1) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 36 || difficultyCounts.Medium !== 60 || difficultyCounts.Hard !== 12) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions.join(",") !== "27,27,27,27") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (stems.size !== 108) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 108) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 108) issues.push(`EXPLANATION_COUNT:${explanations.size}`);

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), questionCount: GEO_CLI_001_CP013_REVIEW_BATCH_V2.length,
    qlCount: Object.keys(qlCounts).length, qlCounts: Object.freeze(qlCounts), difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions), stemCount: stems.size, semanticCount: semantics.size, explanationCount: explanations.size,
    synchronizedCp012Representatives: CP012_SYNC.length });
}
