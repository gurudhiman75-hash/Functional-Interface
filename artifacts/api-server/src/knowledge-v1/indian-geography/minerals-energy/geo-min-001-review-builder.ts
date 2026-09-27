import {
  GEO_MIN_001_FOUNDATION_SOURCE_IDS,
  placeGeoMinOptions,
  type GeoMin001Difficulty,
  type GeoMin001Question,
} from "./geo-min-001-review-types";

export type GeoMin001VariantSeed = Readonly<{
  stem: string;
  answer: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceFactId: string;
  sourceIds?: readonly string[];
  difficulty?: GeoMin001Difficulty;
}>;

export type GeoMin001Ql = Readonly<{
  qlKey: string;
  qlId: string;
  qlName: string;
  questions: readonly GeoMin001Question[];
}>;

function semanticQlId(qlKey: string) {
  const normalized = qlKey.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!normalized) throw new Error("GEO-MIN-001 QL key cannot be empty");
  return "GEO-MIN-001-QL-" + normalized;
}

const DEFAULT_DIFFICULTY_PATTERN: readonly GeoMin001Difficulty[] = Object.freeze([
  "Easy", "Easy", "Medium", "Medium", "Medium", "Hard",
]);

export function buildGeoMinQl(
  qlKey: string,
  qlName: string,
  variants: readonly GeoMin001VariantSeed[],
): GeoMin001Ql {
  if (variants.length < 4) {
    throw new Error("GEO-MIN-001 QL " + qlKey + " needs at least four genuinely distinct review questions");
  }
  const qlId = semanticQlId(qlKey);
  const questions = Object.freeze(variants.map((variant, index) => {
    const correctIndex = (stableHash(qlId) + index) % 4;
    return Object.freeze({
      questionId: "PENDING",
      qlId,
      qlName,
      difficulty: variant.difficulty ?? DEFAULT_DIFFICULTY_PATTERN[index % DEFAULT_DIFFICULTY_PATTERN.length]!,
      stem: variant.stem,
      options: placeGeoMinOptions(variant.answer, variant.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: variant.answer,
      explanation: variant.explanation,
      sourceIds: Object.freeze([...(variant.sourceIds ?? GEO_MIN_001_FOUNDATION_SOURCE_IDS)]),
      sourceFactIds: Object.freeze([variant.sourceFactId]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }));
  return Object.freeze({ qlKey, qlId, qlName, questions });
}

function stableHash(value: string) {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

export function finalizeGeoMinCp(
  cpNo: number,
  qls: readonly GeoMin001Ql[],
): readonly GeoMin001Question[] {
  const seenQlIds = new Set<string>();
  for (const ql of qls) {
    if (seenQlIds.has(ql.qlId)) throw new Error("Duplicate GEO-MIN-001 semantic QL " + ql.qlId);
    seenQlIds.add(ql.qlId);
  }
  const flat = qls.flatMap((ql) => [...ql.questions]);
  return Object.freeze(flat.map((question, index) => Object.freeze({
    ...question,
    questionId: "GEO-MIN-001-CP" + String(cpNo).padStart(3, "0") + "-Q" + String(index + 1).padStart(3, "0"),
    options: Object.freeze([...question.options]),
    sourceIds: Object.freeze([...question.sourceIds]),
    sourceFactIds: Object.freeze([...question.sourceFactIds]),
  })));
}

export function auditGeoMinCp(
  cpNo: number,
  qls: readonly GeoMin001Ql[],
  questions: readonly GeoMin001Question[],
) {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoMin001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of questions) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);
    const stemKey = q.stem.replace(/\s+/g, " ").trim().toLowerCase();
    const explanationKey = q.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stemKey)) issues.push("DUPLICATE_STEM:" + q.questionId);
    if (explanations.has(explanationKey)) issues.push("DUPLICATE_EXPLANATION:" + q.questionId);
    stems.add(stemKey);
    explanations.add(explanationKey);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
    if (q.explanation.length < 95) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if (/best describes|broadly|mainly associated|which of the following is associated/i.test(q.stem)) issues.push("MECHANICAL_STEM:" + q.questionId);
  }

  const declaredQlIds = qls.map((ql) => ql.qlId);
  if (new Set(declaredQlIds).size !== declaredQlIds.length) issues.push("DUPLICATE_QL_ID");
  for (const ql of qls) {
    const count = qlCounts[ql.qlId] ?? 0;
    if (count !== ql.questions.length) issues.push("QL_COUNT:" + ql.qlId + ":" + count + "!=" + ql.questions.length);
    if (count < 4) issues.push("QL_TOO_THIN:" + ql.qlId + ":" + count);
  }
  if (Object.keys(qlCounts).length !== qls.length) issues.push("UNDECLARED_OR_MISSING_QL");

  const maxPos = Math.max(...answerPositions);
  const minPos = Math.min(...answerPositions);
  if (maxPos - minPos > Math.max(2, Math.ceil(questions.length * 0.04))) {
    issues.push("ANSWER_POSITION_IMBALANCE:" + answerPositions.join(","));
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    cpId: "GEO-MIN-001-CP" + String(cpNo).padStart(3, "0"),
    questionCount: questions.length,
    permanentQlCount: qls.length,
    qlIds: Object.freeze(declaredQlIds),
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
