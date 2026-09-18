import {
  PGK_001_CP006_QL_NAMES,
  PGK_001_CP006_REVIEW_BATCH_V1,
  type Pgk001Cp006ReviewQuestion,
} from "./pgk-001-cp006-review-batch-v1";
import { PGK_001_CP006_FACT_IDS } from "./pgk-001-cp006-facts";

export const PGK_001_CP006_REVIEW_BATCH_V2: readonly Pgk001Cp006ReviewQuestion[] = PGK_001_CP006_REVIEW_BATCH_V1;

export function auditPgk001Cp006ReviewBatchV2() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const validFactIds = new Set(PGK_001_CP006_FACT_IDS);
  const bannedLearnerPhrases = [
    "government of punjab",
    "pseb",
    "punjab agricultural university",
    "department of soil",
    "rti manual",
    "agriculture policy",
    "master plan",
    "official report",
    "official website",
    "the correct answer is",
    "the correct option",
    "the other options",
    "this question tests",
    "review batch",
    "generator",
    "identify it",
  ];

  for (const question of PGK_001_CP006_REVIEW_BATCH_V2) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learnerText = `${question.stem} ${question.explanation}`.toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);

    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: canonical answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (question.sourceIds.length === 0) issues.push(`${question.questionId}: missing internal source authority`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const factId of question.factIds) if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact id ${factId}`);
    for (const phrase of bannedLearnerPhrases) if (learnerText.includes(phrase)) issues.push(`${question.questionId}: learner-facing banned phrase: ${phrase}`);
  }

  for (const qlId of Object.keys(PGK_001_CP006_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six review questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP006_REVIEW_BATCH_V2.length,
  });
}
