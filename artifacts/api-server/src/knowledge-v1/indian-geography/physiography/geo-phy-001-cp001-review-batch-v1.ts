import { generateGeoPhy001Cp001ReviewBatchV1 } from "./geo-phy-001-cp001-review-generator-v1";

export const GEO_PHY_001_CP001_REVIEW_BATCH_V1 = Object.freeze(
  generateGeoPhy001Cp001ReviewBatchV1().map((question) => Object.freeze(question)),
);

export function auditGeoPhy001Cp001ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_PHY_001_CP001_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    const semantic = `${question.stem}::${question.canonicalAnswer}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (/generator|sourceFact|review-only|runtimeRegistered|qualification gate/i.test(`${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)) issues.push(`META:${question.questionId}`);
  }

  if (GEO_PHY_001_CP001_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP001_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let i = 1; i <= 9; i += 1) {
    const qlId = `GEO-PHY-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 24 || difficultyCounts.Hard !== 12) issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);

  return { valid: issues.length === 0, issues, questionCount: GEO_PHY_001_CP001_REVIEW_BATCH_V1.length, semanticCount: semantics.size, qlCounts, difficultyCounts, answerPositions };
}
