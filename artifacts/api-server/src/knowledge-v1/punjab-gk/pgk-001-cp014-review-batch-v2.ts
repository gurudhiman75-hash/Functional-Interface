import {
  PGK_001_CP014_QL_NAMES,
  PGK_001_CP014_REVIEW_BATCH_V1,
  type Pgk001Cp014ReviewQuestion,
} from "./pgk-001-cp014-review-batch-v1";

const replacements = new Map<string, Pgk001Cp014ReviewQuestion>([
  [
    "PGK-001-CP014-Q013",
    Object.freeze({
      ...PGK_001_CP014_REVIEW_BATCH_V1[12],
      stem: "The word 'Misl' comes from which language?",
      explanation: "The term Misl comes from Arabic.",
    }),
  ],
  [
    "PGK-001-CP014-Q015",
    Object.freeze({
      ...PGK_001_CP014_REVIEW_BATCH_V1[14],
      explanation: "Under the Rakhi system, a protected village paid one-fifth of its estimated revenue for protection.",
    }),
  ],
  [
    "PGK-001-CP014-Q024",
    Object.freeze({
      ...PGK_001_CP014_REVIEW_BATCH_V1[23],
      stem: "Who founded the Bhangi Misl?",
      explanation: "Chhajja Singh is given as the founder of the Bhangi Misl.",
    }),
  ],
  [
    "PGK-001-CP014-Q025",
    Object.freeze({
      ...PGK_001_CP014_REVIEW_BATCH_V1[24],
      explanation: "Faizalpuria Misl was also called Singhpuria Misl.",
    }),
  ],
  [
    "PGK-001-CP014-Q026",
    Object.freeze({
      ...PGK_001_CP014_REVIEW_BATCH_V1[25],
      explanation: "Karorsinghia Misl was also called Panjgarhia Misl.",
    }),
  ],
  [
    "PGK-001-CP014-Q027",
    Object.freeze({
      ...PGK_001_CP014_REVIEW_BATCH_V1[26],
      explanation: "Shahid Misl was also called Nihang Misl.",
    }),
  ],
  [
    "PGK-001-CP014-Q030",
    Object.freeze({
      ...PGK_001_CP014_REVIEW_BATCH_V1[29],
      stem: "Who received the title 'Sultan-ul-Qaum'?",
      explanation: "Jassa Singh Ahluwalia received the title Sultan-ul-Qaum and later served as a leading commander of the Sikh confederacy.",
    }),
  ],
  [
    "PGK-001-CP014-Q038",
    Object.freeze({
      ...PGK_001_CP014_REVIEW_BATCH_V1[37],
      explanation: "Faizalpuria was founded by Nawab Kapur Singh, Ahluwalia by Jassa Singh Ahluwalia, and Sukerchakia by Charat Singh.",
    }),
  ],
  [
    "PGK-001-CP014-Q039",
    Object.freeze({
      ...PGK_001_CP014_REVIEW_BATCH_V1[38],
      explanation: "Singhpuria, Panjgarhia and Nihang are alternate names for Faizalpuria, Karorsinghia and Shahid misls respectively.",
    }),
  ],
]);

export const PGK_001_CP014_REVIEW_BATCH_V2: readonly Pgk001Cp014ReviewQuestion[] = Object.freeze(
  PGK_001_CP014_REVIEW_BATCH_V1.map((question) => replacements.get(question.questionId) ?? question),
);

export function auditPgk001Cp014ReviewBatchV2() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = [
    "associated with", "linked with", "known for", "closely related to", "closely associated",
    "pseb", "school history", "government of punjab", "district amritsar", "district kapurthala",
    "ministry of tourism", "source:", "website", "according to", "the correct answer is",
    "the correct option", "the other options", "this question tests", "review batch", "generator",
  ];

  for (const question of PGK_001_CP014_REVIEW_BATCH_V2) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learner = `${question.stem}\n${question.explanation}`.toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.correctIndex < 0 || question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner leakage: ${banned}`);
  }

  for (const qlId of Object.keys(PGK_001_CP014_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP014_REVIEW_BATCH_V2.length,
  });
}
