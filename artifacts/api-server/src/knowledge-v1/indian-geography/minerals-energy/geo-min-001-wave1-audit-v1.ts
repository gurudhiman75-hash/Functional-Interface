import { GEO_MIN_001_CP001_REVIEW_BATCH_V1, auditGeoMin001Cp001ReviewBatchV1 } from "./geo-min-001-cp001-review-batch-v1";
import { GEO_MIN_001_CP002_REVIEW_BATCH_V1, auditGeoMin001Cp002ReviewBatchV1 } from "./geo-min-001-cp002-review-batch-v1";
import { GEO_MIN_001_CP003_REVIEW_BATCH_V1, auditGeoMin001Cp003ReviewBatchV1 } from "./geo-min-001-cp003-review-batch-v1";
import { GEO_MIN_001_CP004_REVIEW_BATCH_V1, auditGeoMin001Cp004ReviewBatchV1 } from "./geo-min-001-cp004-review-batch-v1";
import { GEO_MIN_001_CP005_REVIEW_BATCH_V1, auditGeoMin001Cp005ReviewBatchV1 } from "./geo-min-001-cp005-review-batch-v1";

export const GEO_MIN_001_WAVE1_OWNING_POOL_V1 = Object.freeze([
  ...GEO_MIN_001_CP001_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP002_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP003_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP004_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP005_REVIEW_BATCH_V1,
]);

export function auditGeoMin001Wave1V1() {
  const issues: string[] = [];
  const audits = [
    auditGeoMin001Cp001ReviewBatchV1(),
    auditGeoMin001Cp002ReviewBatchV1(),
    auditGeoMin001Cp003ReviewBatchV1(),
    auditGeoMin001Cp004ReviewBatchV1(),
    auditGeoMin001Cp005ReviewBatchV1(),
  ];
  audits.forEach((audit, index) => {
    if (!audit.valid) issues.push("CP" + String(index + 1).padStart(3, "0") + ":" + audit.issues.join("|"));
  });
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qls = new Set<string>();
  const difficulty = { Easy: 0, Medium: 0, Hard: 0 };
  for (const q of GEO_MIN_001_WAVE1_OWNING_POOL_V1) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);
    const stem = q.stem.replace(/\s+/g, " ").trim().toLowerCase();
    const explanation = q.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stem)) issues.push("DUPLICATE_STEM:" + q.questionId);
    if (explanations.has(explanation)) issues.push("DUPLICATE_EXPLANATION:" + q.questionId);
    stems.add(stem);
    explanations.add(explanation);
    qls.add(q.qlId);
    difficulty[q.difficulty] += 1;
  }
  if (stems.size !== GEO_MIN_001_WAVE1_OWNING_POOL_V1.length) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== GEO_MIN_001_WAVE1_OWNING_POOL_V1.length) issues.push("EXPLANATION_COUNT:" + explanations.size);
  if (difficulty.Easy + difficulty.Medium + difficulty.Hard !== GEO_MIN_001_WAVE1_OWNING_POOL_V1.length) issues.push("DIFFICULTY_TOTAL:" + JSON.stringify(difficulty));
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_MIN_001_WAVE1_OWNING_POOL_V1.length,
    permanentQlCount: qls.size,
    stemCount: stems.size,
    explanationCount: explanations.size,
    difficultyCounts: Object.freeze(difficulty),
  });
}
