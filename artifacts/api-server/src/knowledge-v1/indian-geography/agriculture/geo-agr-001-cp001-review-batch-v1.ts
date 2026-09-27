import type { GeoAgr001Difficulty, GeoAgr001Question } from "./geo-agr-001-review-types";
import { GEO_AGR_001_CP001_REVIEW_BATCH_V1 as SEGMENT_A } from "./geo-agr-001-cp001-food-foundation-segment-a-v1";
import { GEO_AGR_001_CP002_REVIEW_BATCH_V1 as SEGMENT_B } from "./geo-agr-001-cp001-food-foundation-segment-b-v1";
import { GEO_AGR_001_CP003_REVIEW_BATCH_V1 as SEGMENT_C } from "./geo-agr-001-cp001-food-foundation-segment-c-v1";

const SOURCE = Object.freeze([...SEGMENT_A, ...SEGMENT_B, ...SEGMENT_C]);

export const GEO_AGR_001_CP001_REVIEW_BATCH_V1: readonly GeoAgr001Question[] = Object.freeze(
  SOURCE.map((source, index) => Object.freeze({
    ...source,
    questionId: `GEO-AGR-001-CP001-Q${String(index + 1).padStart(3, "0")}`,
    options: Object.freeze([...source.options]),
    sourceIds: Object.freeze([...source.sourceIds]),
    sourceFactIds: Object.freeze([...source.sourceFactIds]),
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp001ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoAgr001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_AGR_001_CP001_REVIEW_BATCH_V1) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);

    const stem = q.stem.replace(/\s+/g, " ").trim().toLowerCase();
    const explanation = q.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stem)) issues.push("DUPLICATE_STEM:" + q.questionId);
    if (explanations.has(explanation)) issues.push("DUPLICATE_EXPLANATION:" + q.questionId);
    stems.add(stem);
    explanations.add(explanation);

    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;

    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
  }

  if (GEO_AGR_001_CP001_REVIEW_BATCH_V1.length !== 162) issues.push("COUNT:" + GEO_AGR_001_CP001_REVIEW_BATCH_V1.length);
  for (let n = 1; n <= 27; n += 1) {
    const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 54 || difficultyCounts.Medium !== 90 || difficultyCounts.Hard !== 18) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  const maxPos = Math.max(...answerPositions);
  const minPos = Math.min(...answerPositions);
  if (maxPos - minPos > 3) issues.push("ANSWER_POSITION_IMBALANCE:" + answerPositions.join(","));
  if (stems.size !== 162) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 162) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_AGR_001_CP001_REVIEW_BATCH_V1.length,
    permanentQlCount: Object.keys(qlCounts).length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
