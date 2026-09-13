import { generateGeoPhy001Cp004ReviewBatchV3 } from "./geo-phy-001-cp004-review-generator-v3";

export const GEO_PHY_001_CP004_REVIEW_BATCH_V1 = Object.freeze(
  generateGeoPhy001Cp004ReviewBatchV3().map((question) => Object.freeze(question)),
);

export function auditGeoPhy001Cp004ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_PHY_001_CP004_REVIEW_BATCH_V1) {
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

    const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (/physiographic division|\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate/i.test(learner)) {
      issues.push(`LEARNER_META:${question.questionId}`);
    }
    if (/^This pair is (?:correct|incorrect)\.?$/i.test(question.explanation.trim())) issues.push(`WEAK_EXPLANATION:${question.questionId}`);
    if (question.explanation.trim().length < 45) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
  }

  if (GEO_PHY_001_CP004_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP004_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let ql = 28; ql <= 36; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);

  const requiredCoverage = [
    "geo-phy-001-cp004-deccan-trap",
    "geo-phy-001-cp004-central-highlands-rivers",
    "geo-phy-001-cp004-deccan-eastern-extensions",
    "geo-phy-001-cp004-deccan-northeast-fault",
  ];
  const usedFacts = new Set(GEO_PHY_001_CP004_REVIEW_BATCH_V1.flatMap((question) => question.sourceFactIds));
  for (const factId of requiredCoverage) {
    if (!usedFacts.has(factId)) issues.push(`DORMANT_REQUIRED_FACT:${factId}`);
  }

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_PHY_001_CP004_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
  };
}
