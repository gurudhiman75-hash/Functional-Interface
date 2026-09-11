import { GEO_RIV_001_CP008_REVIEW_BATCH_V4, auditGeoRiv001Cp008ReviewBatchV4 } from "./geo-riv-001-cp008-review-batch-v4";
import { toGeoRiv001Cp008ReviewV5 } from "./geo-riv-001-cp008-review-generator-v5";

const baseAudit = auditGeoRiv001Cp008ReviewBatchV4();
if (!baseAudit.valid) throw new Error(`CP008 V5 requires valid V4 authority: ${baseAudit.issues.join(", ")}`);

export const GEO_RIV_001_CP008_REVIEW_BATCH_V5 = Object.freeze(
  GEO_RIV_001_CP008_REVIEW_BATCH_V4.map((question) => Object.freeze(toGeoRiv001Cp008ReviewV5(question))),
);

export function auditGeoRiv001Cp008ReviewBatchV5() {
  const issues: string[] = [];
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const qlCounts: Record<string, number> = {};

  GEO_RIV_001_CP008_REVIEW_BATCH_V5.forEach((question, index) => {
    const v4 = GEO_RIV_001_CP008_REVIEW_BATCH_V4[index];
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;

    if (question.stem !== v4.stem) issues.push(`STEM_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.options) !== JSON.stringify(v4.options)) issues.push(`OPTION_DRIFT:${question.questionId}`);
    if (question.correctIndex !== v4.correctIndex || question.canonicalAnswer !== v4.canonicalAnswer) issues.push(`ANSWER_DRIFT:${question.questionId}`);
    if (question.difficulty !== v4.difficulty) issues.push(`DIFFICULTY_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.sourceFactIds) !== JSON.stringify(v4.sourceFactIds)) issues.push(`SOURCE_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.upstreamFactIds) !== JSON.stringify(v4.upstreamFactIds)) issues.push(`UPSTREAM_DRIFT:${question.questionId}`);
    if (question.upstreamFactIds.some((id) => id.includes("cp006"))) issues.push(`CP006_LEAK:${question.questionId}`);

    if (/The pair is incorrect\.|Correct fact:/i.test(question.explanation)) issues.push(`META_EXPLANATION:${question.questionId}`);
    if (question.qlId === "GEO-RIV-001-QL-070" && question.explanation.length < 20) issues.push(`PAIR_EXPLANATION_TOO_SHORT:${question.questionId}`);
  });

  if (GEO_RIV_001_CP008_REVIEW_BATCH_V5.length !== 54) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP008_REVIEW_BATCH_V5.length}`);
  for (let ql = 65; ql <= 73; ql += 1) {
    const id = `GEO-RIV-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[id] !== 6) issues.push(`QL_COUNT:${id}:${qlCounts[id] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY_COUNTS:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions[0] !== 14 || answerPositions[1] !== 14 || answerPositions[2] !== 13 || answerPositions[3] !== 13) issues.push(`ANSWER_POSITIONS:${JSON.stringify(answerPositions)}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_RIV_001_CP008_REVIEW_BATCH_V5.length,
    qlCounts,
    difficultyCounts,
    answerPositions,
    explanationOverlayOnly: true,
  };
}
