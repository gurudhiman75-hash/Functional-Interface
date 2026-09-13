import { generateGeoPhy001Cp006ReviewBatchV2 } from "./geo-phy-001-cp006-review-generator-v2";

export const GEO_PHY_001_CP006_REVIEW_BATCH_V1 = Object.freeze(
  generateGeoPhy001Cp006ReviewBatchV2().map((question) => Object.freeze(question)),
);

export const GEO_PHY_001_CP006_REQUIRED_FACTS_V1 = Object.freeze([
  "geo-phy-001-cp006-coastal-strips-two-seas",
  "geo-phy-001-cp006-west-between-ghats-arabian",
  "geo-phy-001-cp006-west-narrow",
  "geo-phy-001-cp006-west-sections",
  "geo-phy-001-cp006-konkan",
  "geo-phy-001-cp006-kannad",
  "geo-phy-001-cp006-malabar",
  "geo-phy-001-cp006-east-wide-level",
  "geo-phy-001-cp006-east-sections",
  "geo-phy-001-cp006-east-delta-rivers",
  "geo-phy-001-cp006-chilika-east",
  "geo-phy-001-cp006-chilika-odisha-mahanadi",
  "geo-phy-001-cp006-chilika-largest-saltwater",
  "geo-phy-001-cp006-west-submerged",
  "geo-phy-001-cp006-east-emergent",
  "geo-phy-001-cp006-west-rivers-no-deltas",
  "geo-phy-001-cp006-malabar-kayals",
]);

const HARD_LANGUAGE = /\bgeomorphology\b|localized water-related|moisture conditions|gains greater prominence|towards the western margins|\bundulating\b|flanked by stretch/i;

export function auditGeoPhy001Cp006ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_PHY_001_CP006_REVIEW_BATCH_V1) {
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
    if (/\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate/i.test(learner)) {
      issues.push(`LEARNER_META:${question.questionId}`);
    }
    if (HARD_LANGUAGE.test(learner)) issues.push(`HARD_LANGUAGE:${question.questionId}`);
    if (question.explanation.trim().length < 45) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (/^This pair is (?:correct|incorrect)\.?$/i.test(question.explanation.trim())) issues.push(`WEAK_EXPLANATION:${question.questionId}`);
  }

  if (GEO_PHY_001_CP006_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP006_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);

  for (let ql = 46; ql <= 54; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }

  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);

  const usedFacts = new Set(GEO_PHY_001_CP006_REVIEW_BATCH_V1.flatMap((question) => question.sourceFactIds));
  for (const factId of GEO_PHY_001_CP006_REQUIRED_FACTS_V1) {
    if (!usedFacts.has(factId)) issues.push(`DORMANT_REQUIRED_FACT:${factId}`);
  }

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_PHY_001_CP006_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
  };
}
