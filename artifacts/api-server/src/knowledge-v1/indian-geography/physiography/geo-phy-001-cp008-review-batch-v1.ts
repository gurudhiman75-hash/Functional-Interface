import { generateGeoPhy001Cp008ReviewBatchV1 } from "./geo-phy-001-cp008-review-generator-v1";

export const GEO_PHY_001_CP008_REVIEW_BATCH_V1 = Object.freeze(
  generateGeoPhy001Cp008ReviewBatchV1().map((question) => Object.freeze(question)),
);

export const GEO_PHY_001_CP008_REQUIRED_FACTS_V1 = Object.freeze([
  "geo-phy-001-cp008-aravali-trend",
  "geo-phy-001-cp008-guru-shikhar-aravali",
  "geo-phy-001-cp008-narmada-vindhya-satpura",
  "geo-phy-001-cp008-deccan-ghat-edges",
  "geo-phy-001-cp008-western-ghats-higher",
  "geo-phy-001-cp008-western-ghats-continuous",
  "geo-phy-001-cp008-eastern-ghats-discontinuous",
  "geo-phy-001-cp008-sahyadri-western-ghats",
  "geo-phy-001-cp008-nilgiri-ghats-meeting",
  "geo-phy-001-cp008-anaimalai-cardamom-western-ghats",
  "geo-phy-001-cp008-anamudi-western-ghats",
  "geo-phy-001-cp008-doddabetta-nilgiri",
  "geo-phy-001-cp008-mahendragiri-eastern-ghats",
  "geo-phy-001-cp008-mahadev-maikal-satpura",
  "geo-phy-001-cp008-kaimur-vindhya",
]);

const forbiddenLearnerLanguage = /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|geomorphology|orographic|physiographic nomenclature|geological provenance|morphological characteristic/i;

export function auditGeoPhy001Cp008ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_PHY_001_CP008_REVIEW_BATCH_V1) {
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

  if (GEO_PHY_001_CP008_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP008_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);

  for (let ql = 64; ql <= 72; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }

  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);

  const usedFacts = new Set(GEO_PHY_001_CP008_REVIEW_BATCH_V1.flatMap((question) => question.sourceFactIds));
  for (const factId of GEO_PHY_001_CP008_REQUIRED_FACTS_V1) {
    if (!usedFacts.has(factId)) issues.push(`DORMANT_REQUIRED_FACT:${factId}`);
  }

  const hardAnswers = new Set(
    GEO_PHY_001_CP008_REVIEW_BATCH_V1.filter((question) => question.difficulty === "Hard").map((question) => question.canonicalAnswer),
  );
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_PHY_001_CP008_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
  };
}
