import { generateGeoPhy001Cp007ReviewBatchV2 } from "./geo-phy-001-cp007-review-generator-v2";

export const GEO_PHY_001_CP007_REVIEW_BATCH_V1 = Object.freeze(
  generateGeoPhy001Cp007ReviewBatchV2().map((question) => Object.freeze(question)),
);

export const GEO_PHY_001_CP007_REQUIRED_FACTS_V1 = Object.freeze([
  "geo-phy-001-cp007-major-island-groups",
  "geo-phy-001-cp007-lakshadweep-arabian-malabar",
  "geo-phy-001-cp007-lakshadweep-coral",
  "geo-phy-001-cp007-kavaratti-headquarters",
  "geo-phy-001-cp007-pitti-bird-sanctuary",
  "geo-phy-001-cp007-andaman-bay-bengal",
  "geo-phy-001-cp007-andaman-north-nicobar-south",
  "geo-phy-001-cp007-ten-degree-channel",
  "geo-phy-001-cp007-andaman-size-number",
  "geo-phy-001-cp007-submarine-mountains",
  "geo-phy-001-cp007-barren-active-volcano",
  "geo-phy-001-cp007-equatorial-forest",
]);

const forbiddenLearnerLanguage = /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|physiographic nomenclature|geological provenance|morphological characteristic/i;

export function auditGeoPhy001Cp007ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_PHY_001_CP007_REVIEW_BATCH_V1) {
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
    if (forbiddenLearnerLanguage.test(learner)) issues.push(`LEARNER_LANGUAGE:${question.questionId}`);
    if (question.explanation.trim().length < 40) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
  }

  if (GEO_PHY_001_CP007_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP007_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);

  for (let ql = 55; ql <= 63; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }

  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);

  const usedFacts = new Set(GEO_PHY_001_CP007_REVIEW_BATCH_V1.flatMap((question) => question.sourceFactIds));
  for (const factId of GEO_PHY_001_CP007_REQUIRED_FACTS_V1) {
    if (!usedFacts.has(factId)) issues.push(`DORMANT_REQUIRED_FACT:${factId}`);
  }

  const hardAnswers = new Set(
    GEO_PHY_001_CP007_REVIEW_BATCH_V1.filter((question) => question.difficulty === "Hard").map((question) => question.canonicalAnswer),
  );
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_PHY_001_CP007_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
  };
}
