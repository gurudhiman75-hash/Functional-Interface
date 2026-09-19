import {
  PGK_001_CP004_REVIEW_BATCH_V1,
  type Pgk001Cp004ReviewQuestion,
} from "./pgk-001-cp004-review-batch-v1";
import {
  PGK_001_CP004_FACT_IDS,
  PGK_001_CP004_SOURCE_IDS,
} from "./pgk-001-cp004-facts";

export const PGK_001_CP004_QL_NAMES_V2 = Object.freeze({
  "PGK-001-QL-021": "Five rivers, ancient names and present-day distinction",
  "PGK-001-QL-022": "Ravi, Beas and Sutlej relations",
  "PGK-001-QL-023": "Harike river confluence",
  "PGK-001-QL-024": "Ghaggar and seasonal drainage",
  "PGK-001-QL-025": "Doab meaning and structure",
  "PGK-001-QL-026": "Named doabs and river pairs",
  "PGK-001-QL-027": "River-doab synthesis",
} as const);

type Override = Readonly<{
  difficulty?: Pgk001Cp004ReviewQuestion["difficulty"];
  stem: string;
  options: readonly string[];
  canonicalAnswer: string;
  explanation: string;
  factIds: readonly string[];
  sourceIds: readonly string[];
}>;

const ancientSource = [PGK_001_CP004_SOURCE_IDS.psebClass9PunjabIntro] as const;

const overrides: Readonly<Record<string, Override>> = Object.freeze({
  "PGK-001-CP004-Q005": {
    difficulty: "Easy",
    stem: "What is the ancient name of the Sutlej River?",
    options: ["Shutudri", "Vipasa", "Purushni", "Askini"],
    canonicalAnswer: "Shutudri",
    explanation: "Sutlej was known as Shutudri in ancient tradition. Sutudri and Shatadru are also encountered as spelling variants.",
    factIds: ["ancient-sutlej-shutudri"],
    sourceIds: ancientSource,
  },
  "PGK-001-CP004-Q006": {
    difficulty: "Medium",
    stem: "Vipasa was the ancient name of which river?",
    options: ["Beas", "Ravi", "Chenab", "Jhelum"],
    canonicalAnswer: "Beas",
    explanation: "Vipasa was the ancient name of the Beas. Vipasha is an accepted spelling variant.",
    factIds: ["ancient-beas-vipasa"],
    sourceIds: ancientSource,
  },
  "PGK-001-CP004-Q011": {
    difficulty: "Medium",
    stem: "Which river was known as Purushni in ancient times?",
    options: ["Ravi", "Beas", "Sutlej", "Jhelum"],
    canonicalAnswer: "Ravi",
    explanation: "Ravi was known as Purushni in ancient tradition. Parushni is another common spelling of the same name.",
    factIds: ["ancient-ravi-purushni"],
    sourceIds: ancientSource,
  },
  "PGK-001-CP004-Q012": {
    difficulty: "Medium",
    stem: "Askini was the ancient name of which river?",
    options: ["Chenab", "Jhelum", "Ravi", "Beas"],
    canonicalAnswer: "Chenab",
    explanation: "Chenab was known as Askini in ancient tradition. Asikni is an accepted spelling variant.",
    factIds: ["ancient-chenab-askini"],
    sourceIds: ancientSource,
  },
  "PGK-001-CP004-Q040": {
    difficulty: "Hard",
    stem: "Which of the following ancient-name pairs is correctly matched?",
    options: [
      "Jhelum — Vitista",
      "Chenab — Vipasa",
      "Ravi — Askini",
      "Beas — Purushni",
    ],
    canonicalAnswer: "Jhelum — Vitista",
    explanation: "Jhelum was known as Vitista; Vitasta is an accepted spelling variant. Vipasa belongs to Beas, Askini to Chenab and Purushni to Ravi.",
    factIds: ["ancient-jhelum-vitista", "ancient-beas-vipasa", "ancient-chenab-askini", "ancient-ravi-purushni"],
    sourceIds: ancientSource,
  },
  "PGK-001-CP004-Q041": {
    difficulty: "Hard",
    stem: "Consider the following pairs:\nI. Sutlej — Shutudri\nII. Beas — Vipasa\nIII. Ravi — Purushni\nIV. Chenab — Askini\nV. Jhelum — Vitista\nWhich of the pairs given above are correctly matched?",
    options: ["I, II and III only", "II, III and IV only", "I, III, IV and V only", "I, II, III, IV and V"],
    canonicalAnswer: "I, II, III, IV and V",
    explanation: "All five pairs are correctly matched. These are the standard ancient names of Punjab's five traditional rivers.",
    factIds: [
      "ancient-sutlej-shutudri",
      "ancient-beas-vipasa",
      "ancient-ravi-purushni",
      "ancient-chenab-askini",
      "ancient-jhelum-vitista",
    ],
    sourceIds: ancientSource,
  },
});

const validFactIds = new Set<string>(PGK_001_CP004_FACT_IDS);

export const PGK_001_CP004_REVIEW_BATCH_V2: readonly Pgk001Cp004ReviewQuestion[] = Object.freeze(
  PGK_001_CP004_REVIEW_BATCH_V1.map((question) => {
    const override = overrides[question.questionId];
    const qlName = PGK_001_CP004_QL_NAMES_V2[question.qlId as keyof typeof PGK_001_CP004_QL_NAMES_V2] ?? question.qlName;
    if (!override) return Object.freeze({ ...question, qlName });
    const correctIndex = override.options.indexOf(override.canonicalAnswer);
    if (correctIndex < 0) throw new Error(`${question.questionId}: ancient-name override is missing its canonical answer`);
    return Object.freeze({
      ...question,
      qlName,
      difficulty: override.difficulty ?? question.difficulty,
      stem: override.stem,
      options: Object.freeze([...override.options]),
      correctIndex,
      canonicalAnswer: override.canonicalAnswer,
      explanation: override.explanation,
      factIds: Object.freeze([...override.factIds]),
      sourceIds: Object.freeze([...override.sourceIds]),
    });
  }),
);

export function auditPgk001Cp004ReviewBatchV2() {
  const issues: string[] = [];
  const ancientFactsUsed = new Set<string>();
  const learnerText = PGK_001_CP004_REVIEW_BATCH_V2
    .map((question) => `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)
    .join("\n")
    .toLowerCase();

  for (const question of PGK_001_CP004_REVIEW_BATCH_V2) {
    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: canonical answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const factId of question.factIds) {
      if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact id ${factId}`);
      if (factId.startsWith("ancient-")) ancientFactsUsed.add(factId);
    }
  }

  for (const banned of [
    "government of punjab",
    "puda",
    "pseb",
    "master plan",
    "regional plan",
    "source:",
    "puadh",
    "the correct answer is",
    "the correct option",
    "this question tests",
  ]) {
    if (learnerText.includes(banned)) issues.push(`learner-facing leakage: ${banned}`);
  }

  for (const required of [
    "ancient-sutlej-shutudri",
    "ancient-beas-vipasa",
    "ancient-ravi-purushni",
    "ancient-chenab-askini",
    "ancient-jhelum-vitista",
  ]) {
    if (!ancientFactsUsed.has(required)) issues.push(`ancient river fact not represented in review: ${required}`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP004_REVIEW_BATCH_V2.length,
    ancientFactCount: ancientFactsUsed.size,
  });
}
