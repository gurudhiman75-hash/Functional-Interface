import {
  PGK_001_CP012_QL_NAMES,
  PGK_001_CP012_REVIEW_BATCH_V1,
  type Pgk001Cp012ReviewQuestion,
} from "./pgk-001-cp012-review-batch-v1";

const replacements = new Map<string, Pgk001Cp012ReviewQuestion>([
  [
    "PGK-001-CP012-Q021",
    Object.freeze({
      ...PGK_001_CP012_REVIEW_BATCH_V1[20],
      stem: "Which Guru introduced the Miri-Piri tradition?",
      explanation: "Guru Hargobind introduced the Miri-Piri tradition, combining temporal and spiritual authority in Sikh institutional history.",
    }),
  ],
]);

export const PGK_001_CP012_REVIEW_BATCH_V2: readonly Pgk001Cp012ReviewQuestion[] = Object.freeze(
  PGK_001_CP012_REVIEW_BATCH_V1.map((question) => replacements.get(question.questionId) ?? question),
);

export function auditPgk001Cp012ReviewBatchV2() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = [
    "associated with", "linked with", "linked historically with", "closely linked",
    "closely associated", "known for", "closely related to",
    "sgpc", "pseb", "source:", "website", "according to",
    "the correct answer is", "the correct option", "the other options",
    "this question tests", "review batch", "generator",
  ];

  for (const question of PGK_001_CP012_REVIEW_BATCH_V2) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learner = `${question.stem}\n${question.explanation}`.toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner leakage: ${banned}`);
  }

  for (const qlId of Object.keys(PGK_001_CP012_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP012_REVIEW_BATCH_V2.length,
  });
}
