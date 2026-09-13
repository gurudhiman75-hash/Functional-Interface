import {
  GEO_PHY_001_CP011_REVIEW_BATCH_V3,
  type GeoPhy001Cp011ReviewQuestion,
} from "./geo-phy-001-cp011-review-batch-v3";

const uniqueStems: Record<string, string> = {
  "GEO-PHY-001-CP011-Q011": "Which pair correctly compares the Himalayas and Peninsular Plateau?",
  "GEO-PHY-001-CP011-Q012": "Which pair correctly compares the Northern Plains and Indian Desert?",
  "GEO-PHY-001-CP011-Q024": "Which pair is wrongly matched for the Himalayas and Peninsular Plateau?",
  "GEO-PHY-001-CP011-Q030": "Which pair is wrongly matched for the Northern Plains and Indian Desert?",
  "GEO-PHY-001-CP011-Q042": "Which pair is wrongly matched for Lakshadweep and Andaman–Nicobar?",
  "GEO-PHY-001-CP011-Q043": "Which pair correctly matches a landform with its region?",
  "GEO-PHY-001-CP011-Q044": "Which pair correctly matches a coast with its feature?",
  "GEO-PHY-001-CP011-Q045": "Which pair wrongly places an island group?",
  "GEO-PHY-001-CP011-Q046": "Which pair wrongly describes the Northern Plains?",
};

export const GEO_PHY_001_CP011_REVIEW_BATCH_V4: readonly GeoPhy001Cp011ReviewQuestion[] = Object.freeze(
  GEO_PHY_001_CP011_REVIEW_BATCH_V3.map((question) =>
    Object.freeze({
      ...question,
      stem: uniqueStems[question.questionId] ?? question.stem,
    }),
  ),
);

const bannedLearnerWording = /physiographic|physical division|geologically|alluvial|emergent|submerged|crystalline|igneous|metamorphic|offshore|\barid\b|deposition|correctly classified|incorrectly classified|structurally folded/i;

export function auditGeoPhy001Cp011ReviewBatchV4() {
  const issues: string[] = [];
  const answerPositions = [0, 0, 0, 0];
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const semantic = new Set<string>();
  const sourceFacts = new Set<string>();
  const hardAnswers = new Set<string>();
  const qlCounts = new Map<string, number>();

  for (const question of GEO_PHY_001_CP011_REVIEW_BATCH_V4) {
    const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (bannedLearnerWording.test(learner)) issues.push(`${question.questionId}: heavy wording remains`);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`${question.questionId}: options invalid`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer mismatch`);
    if (question.difficulty !== "Hard" && question.stem.split(/\s+/).length > 17) issues.push(`${question.questionId}: stem too long`);
    if (question.difficulty !== "Hard" && question.explanation.split(/\s+/).length > 20) issues.push(`${question.questionId}: explanation too long`);
    answerPositions[question.correctIndex] += 1;
    difficultyCounts[question.difficulty] += 1;
    semantic.add(question.stem.trim().toLowerCase());
    question.sourceFactIds.forEach((id) => sourceFacts.add(id));
    if (question.difficulty === "Hard") hardAnswers.add(question.canonicalAnswer);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
  }

  if (GEO_PHY_001_CP011_REVIEW_BATCH_V4.length !== 54) issues.push("CP011 V4 must contain 54 questions");
  if ([...qlCounts.values()].some((count) => count !== 6) || qlCounts.size !== 9) issues.push("CP011 V4 must contain 6 questions per QL");
  if (semantic.size !== 54) issues.push(`CP011 V4 stems are not unique: ${semantic.size}/54`);
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("CP011 V4 difficulty split is wrong");
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`CP011 V4 answer balance is ${answerPositions.join(",")}`);
  if (hardAnswers.size < 4) issues.push("CP011 V4 hard answer pattern is too repetitive");
  if (sourceFacts.size < 20) issues.push("CP011 V4 source-fact coverage is too shallow");

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_PHY_001_CP011_REVIEW_BATCH_V4.length,
    semanticCount: semantic.size,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
    usedSourceFactCount: sourceFacts.size,
  };
}
