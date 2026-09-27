import {
  GEO_MIN_001_SOURCE_IDS,
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
}>;

const HARD_QL_PATTERN: readonly GeoMin001Difficulty[] = Object.freeze([
  "Easy", "Easy", "Medium", "Medium", "Medium", "Hard",
]);
const MEDIUM_QL_PATTERN: readonly GeoMin001Difficulty[] = Object.freeze([
  "Easy", "Easy", "Medium", "Medium", "Medium", "Medium",
]);

export function buildGeoMinQl(
  qlNo: number,
  qlName: string,
  variants: readonly [
    GeoMin001VariantSeed,
    GeoMin001VariantSeed,
    GeoMin001VariantSeed,
    GeoMin001VariantSeed,
    GeoMin001VariantSeed,
    GeoMin001VariantSeed,
  ],
): readonly GeoMin001Question[] {
  const qlId = "GEO-MIN-001-QL-" + String(qlNo).padStart(3, "0");
  return Object.freeze(variants.map((variant, index) => {
    const correctIndex = (qlNo + index - 1) % 4;
    return Object.freeze({
      questionId: "PENDING",
      qlId,
      qlName,
      difficulty: (((qlNo - 1) % 9) < 6 ? HARD_QL_PATTERN : MEDIUM_QL_PATTERN)[index]!,
      stem: variant.stem,
      options: placeGeoMinOptions(variant.answer, variant.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: variant.answer,
      explanation: variant.explanation,
      sourceIds: GEO_MIN_001_SOURCE_IDS,
      sourceFactIds: Object.freeze([variant.sourceFactId]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }));
}

export function finalizeGeoMinCp(
  cpNo: number,
  qls: readonly (readonly GeoMin001Question[])[],
): readonly GeoMin001Question[] {
  const flat = qls.flatMap((questions) => [...questions]);
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
  firstQl: number,
  lastQl: number,
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

  if (questions.length !== 54) issues.push("COUNT:" + questions.length);
  for (let n = firstQl; n <= lastQl; n += 1) {
    const qlId = "GEO-MIN-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 27 || difficultyCounts.Hard !== 9) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  const maxPos = Math.max(...answerPositions);
  const minPos = Math.min(...answerPositions);
  if (maxPos - minPos > 2) issues.push("ANSWER_POSITION_IMBALANCE:" + answerPositions.join(","));

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    cpId: "GEO-MIN-001-CP" + String(cpNo).padStart(3, "0"),
    questionCount: questions.length,
    permanentQlCount: Object.keys(qlCounts).length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
