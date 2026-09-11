import { GEO_RIV_001_CP008_REVIEW_BATCH_V3, auditGeoRiv001Cp008ReviewBatchV3 } from "./geo-riv-001-cp008-review-batch-v3";
import { toGeoRiv001Cp008ReviewV4 } from "./geo-riv-001-cp008-review-generator-v4";

const baseAudit = auditGeoRiv001Cp008ReviewBatchV3();
if (!baseAudit.valid) throw new Error(`CP008 V4 requires valid V3 authority: ${baseAudit.issues.join(", ")}`);

export const GEO_RIV_001_CP008_REVIEW_BATCH_V4 = Object.freeze(
  GEO_RIV_001_CP008_REVIEW_BATCH_V3.map((question) => Object.freeze(toGeoRiv001Cp008ReviewV4(question))),
);

export function auditGeoRiv001Cp008ReviewBatchV4() {
  const issues: string[] = [];
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const qlCounts: Record<string, number> = {};

  GEO_RIV_001_CP008_REVIEW_BATCH_V4.forEach((question, index) => {
    const v3 = GEO_RIV_001_CP008_REVIEW_BATCH_V3[index];
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;

    if (question.stem !== v3.stem) issues.push(`STEM_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.options) !== JSON.stringify(v3.options)) issues.push(`OPTION_DRIFT:${question.questionId}`);
    if (question.correctIndex !== v3.correctIndex || question.canonicalAnswer !== v3.canonicalAnswer) issues.push(`ANSWER_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.sourceFactIds) !== JSON.stringify(v3.sourceFactIds)) issues.push(`SOURCE_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.upstreamFactIds) !== JSON.stringify(v3.upstreamFactIds)) issues.push(`UPSTREAM_DRIFT:${question.questionId}`);
    if (question.upstreamFactIds.some((id) => id.includes("cp006"))) issues.push(`CP006_LEAK:${question.questionId}`);

    if (question.qlId === "GEO-RIV-001-QL-070") {
      if (!question.explanation.startsWith("The pair is incorrect. ")) issues.push(`PAIR_EXPLANATION_STYLE:${question.questionId}`);
      if (/—.* is incorrect\./.test(question.explanation)) issues.push(`MECHANICAL_PAIR_EXPLANATION:${question.questionId}`);
    }
    if (question.qlId === "GEO-RIV-001-QL-071" && question.difficulty !== "Medium") issues.push(`CHAIN_DIFFICULTY:${question.questionId}`);
    if (question.qlId !== "GEO-RIV-001-QL-071" && question.difficulty !== v3.difficulty) issues.push(`UNEXPECTED_DIFFICULTY_DRIFT:${question.questionId}`);
  });

  if (GEO_RIV_001_CP008_REVIEW_BATCH_V4.length !== 54) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP008_REVIEW_BATCH_V4.length}`);
  for (let ql = 65; ql <= 73; ql += 1) {
    const id = `GEO-RIV-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[id] !== 6) issues.push(`QL_COUNT:${id}:${qlCounts[id] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY_COUNTS:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions[0] !== 14 || answerPositions[1] !== 14 || answerPositions[2] !== 13 || answerPositions[3] !== 13) issues.push(`ANSWER_POSITIONS:${JSON.stringify(answerPositions)}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_RIV_001_CP008_REVIEW_BATCH_V4.length,
    qlCounts,
    difficultyCounts,
    answerPositions,
    editorialAndDifficultyOverlayOnly: true,
  };
}
