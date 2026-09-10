import { GEO_RIV_001_CP008_REVIEW_BATCH_V2, auditGeoRiv001Cp008ReviewBatchV2 } from "./geo-riv-001-cp008-review-batch-v2";
import { toGeoRiv001Cp008ReviewV3 } from "./geo-riv-001-cp008-review-generator-v3";

const baseAudit = auditGeoRiv001Cp008ReviewBatchV2();
if (!baseAudit.valid) throw new Error(`CP008 V3 requires valid V2 authority: ${baseAudit.issues.join(", ")}`);

export const GEO_RIV_001_CP008_REVIEW_BATCH_V3 = Object.freeze(
  GEO_RIV_001_CP008_REVIEW_BATCH_V2.map((question) => Object.freeze(toGeoRiv001Cp008ReviewV3(question))),
);

export function auditGeoRiv001Cp008ReviewBatchV3() {
  const issues: string[] = [];
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const qlCounts: Record<string, number> = {};

  GEO_RIV_001_CP008_REVIEW_BATCH_V3.forEach((question, index) => {
    const v2 = GEO_RIV_001_CP008_REVIEW_BATCH_V2[index];
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;

    if (question.stem !== v2.stem) issues.push(`STEM_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.options) !== JSON.stringify(v2.options)) issues.push(`OPTION_DRIFT:${question.questionId}`);
    if (question.correctIndex !== v2.correctIndex || question.canonicalAnswer !== v2.canonicalAnswer) issues.push(`ANSWER_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.sourceFactIds) !== JSON.stringify(v2.sourceFactIds)) issues.push(`SOURCE_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.upstreamFactIds) !== JSON.stringify(v2.upstreamFactIds)) issues.push(`UPSTREAM_DRIFT:${question.questionId}`);
    if (question.upstreamFactIds.some((id) => id.includes("cp006"))) issues.push(`CP006_LEAK:${question.questionId}`);

    if ((question.qlId === "GEO-RIV-001-QL-072" || question.qlId === "GEO-RIV-001-QL-073") && /is incorrect:\s|Incorrect —/.test(question.explanation)) {
      issues.push(`AMBIGUOUS_FALSE_EXPLANATION:${question.questionId}`);
    }
    if (/incorrect/i.test(question.explanation) && (question.qlId === "GEO-RIV-001-QL-072" || question.qlId === "GEO-RIV-001-QL-073") && !/Correct fact:/.test(question.explanation)) {
      issues.push(`MISSING_CANONICAL_CORRECTION:${question.questionId}`);
    }
  });

  if (GEO_RIV_001_CP008_REVIEW_BATCH_V3.length !== 54) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP008_REVIEW_BATCH_V3.length}`);
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 24 || difficultyCounts.Hard !== 12) issues.push(`DIFFICULTY_COUNTS:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions[0] !== 14 || answerPositions[1] !== 14 || answerPositions[2] !== 13 || answerPositions[3] !== 13) issues.push(`ANSWER_POSITIONS:${JSON.stringify(answerPositions)}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_RIV_001_CP008_REVIEW_BATCH_V3.length,
    qlCounts,
    difficultyCounts,
    answerPositions,
    editorialOverlayOnly: true,
  };
}
