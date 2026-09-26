import type { GeoAgr001Difficulty, GeoAgr001Question } from "./geo-agr-001-review-types";
import {
  GEO_AGR_001_CP003_TEA_COFFEE_SEGMENT_V1,
  auditGeoAgr001Cp003TeaCoffeeSegmentV1,
} from "./geo-agr-001-cp003-segment-a-tea-coffee-v1";
import {
  GEO_AGR_001_CP003_RUBBER_HORTICULTURE_SEGMENT_V1,
  auditGeoAgr001Cp003RubberHorticultureSegmentV1,
} from "./geo-agr-001-cp003-segment-b-rubber-horticulture-v1";

const SOURCE = Object.freeze([
  ...GEO_AGR_001_CP003_TEA_COFFEE_SEGMENT_V1,
  ...GEO_AGR_001_CP003_RUBBER_HORTICULTURE_SEGMENT_V1,
]);

export const GEO_AGR_001_CP003_REVIEW_BATCH_V1: readonly GeoAgr001Question[] = Object.freeze(
  SOURCE.map((source, index) => Object.freeze({
    ...source,
    questionId: `GEO-AGR-001-CP003-Q${String(index + 1).padStart(3, "0")}`,
    options: Object.freeze([...source.options]),
    sourceIds: Object.freeze([...source.sourceIds]),
    sourceFactIds: Object.freeze([...source.sourceFactIds]),
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })),
);

const BANNED = /associated with|best describes|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|given in NCERT|\bNCERT\b|\btextbook\b|which pair correctly|which statement correctly|which option gives|sourceFact|runtimeRegistered|review-only|generator/i;

export function auditGeoAgr001Cp003ReviewBatchV1() {
  const issues: string[] = [];
  const segmentAudits = [
    auditGeoAgr001Cp003TeaCoffeeSegmentV1(),
    auditGeoAgr001Cp003RubberHorticultureSegmentV1(),
  ];
  segmentAudits.forEach((audit, index) => {
    if (!audit.valid) issues.push("SEGMENT_" + (index + 1) + ":" + audit.issues.join("|"));
  });

  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoAgr001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_AGR_001_CP003_REVIEW_BATCH_V1) {
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

    const learnerText = q.stem + "\n" + q.options.join("\n") + "\n" + q.explanation;
    if (BANNED.test(learnerText)) issues.push("STYLE:" + q.questionId);
    if (q.explanation.length < 110) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if ((q.explanation.match(/[.!?](?:\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_AGR_001_CP003_REVIEW_BATCH_V1.length !== 108) issues.push("COUNT:" + GEO_AGR_001_CP003_REVIEW_BATCH_V1.length);
  for (let n = 55; n <= 72; n += 1) {
    const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 36 || difficultyCounts.Medium !== 60 || difficultyCounts.Hard !== 12) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  if (Math.max(...answerPositions) - Math.min(...answerPositions) > 3) {
    issues.push("ANSWER_POSITION_IMBALANCE:" + answerPositions.join(","));
  }
  if (stems.size !== 108) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 108) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_AGR_001_CP003_REVIEW_BATCH_V1.length,
    permanentQlCount: Object.keys(qlCounts).length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
