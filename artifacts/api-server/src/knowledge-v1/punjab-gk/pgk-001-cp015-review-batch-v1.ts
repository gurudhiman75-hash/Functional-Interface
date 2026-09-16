import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP015_FACT_IDS, PGK_001_CP015_SOURCE_IDS } from "./pgk-001-cp015-facts";
import { PGK_001_CP015_QL098_ROWS } from "./pgk-001-cp015-ql098";
import { PGK_001_CP015_QL099_ROWS } from "./pgk-001-cp015-ql099";
import { PGK_001_CP015_QL100_ROWS } from "./pgk-001-cp015-ql100";
import { PGK_001_CP015_QL101_ROWS } from "./pgk-001-cp015-ql101";
import { PGK_001_CP015_QL102_ROWS } from "./pgk-001-cp015-ql102";
import { PGK_001_CP015_QL103_ROWS } from "./pgk-001-cp015-ql103";
import { PGK_001_CP015_QL104_ROWS } from "./pgk-001-cp015-ql104";

export type Pgk001Cp015ReviewQuestion = Readonly<{
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  factIds: readonly string[];
  sourceIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}>;

export const PGK_001_CP015_QL_NAMES = Object.freeze({
  "PGK-001-QL-098": "Early life, Sukerchakia background, Lahore and coronation",
  "PGK-001-QL-099": "Amritsar and Treaty of Amritsar (1809)",
  "PGK-001-QL-100": "Major conquests and territorial expansion",
  "PGK-001-QL-101": "Central administration and major officials",
  "PGK-001-QL-102": "Provincial and local administration",
  "PGK-001-QL-103": "Army modernisation and commanders",
  "PGK-001-QL-104": "Ranjit Singh chronology and synthesis",
} as const);

type SourceKey = keyof typeof PGK_001_CP015_SOURCE_IDS;
type RawRow = readonly [
  KnowledgeV1Difficulty,
  string,
  readonly string[],
  string,
  string,
  readonly string[],
  readonly SourceKey[],
];

const rows = [
  ...PGK_001_CP015_QL098_ROWS,
  ...PGK_001_CP015_QL099_ROWS,
  ...PGK_001_CP015_QL100_ROWS,
  ...PGK_001_CP015_QL101_ROWS,
  ...PGK_001_CP015_QL102_ROWS,
  ...PGK_001_CP015_QL103_ROWS,
  ...PGK_001_CP015_QL104_ROWS,
] as readonly RawRow[];

export const PGK_001_CP015_REVIEW_BATCH_V1: readonly Pgk001Cp015ReviewQuestion[] = Object.freeze(
  rows.map((row, index) => {
    const qlId = `PGK-001-QL-${String(98 + Math.floor(index / 6)).padStart(3, "0")}`;
    const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceKeys] = row;
    return Object.freeze({
      questionId: `PGK-001-CP015-Q${String(index + 1).padStart(3, "0")}`,
      qlId,
      qlName: PGK_001_CP015_QL_NAMES[qlId as keyof typeof PGK_001_CP015_QL_NAMES],
      difficulty,
      stem,
      options: Object.freeze([...options]),
      correctIndex: options.indexOf(canonicalAnswer),
      canonicalAnswer,
      explanation,
      factIds: Object.freeze([...factIds]),
      sourceIds: Object.freeze(sourceKeys.map((key) => PGK_001_CP015_SOURCE_IDS[key])),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

export function auditPgk001Cp015ReviewBatchV1() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const factSet = new Set(PGK_001_CP015_FACT_IDS);
  const bannedLearnerTerms = [
    "associated with", "linked with", "known for", "closely related to", "formed the framework",
    "school history", "punjab-board", "pseb", "britannica", "government of punjab",
    "source:", "website", "according to", "the correct answer is", "the correct option",
    "the other options", "this question tests", "review batch", "generator",
  ];

  for (const question of PGK_001_CP015_REVIEW_BATCH_V1) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learner = `${question.stem}\n${question.explanation}`.toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.correctIndex < 0 || question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer/index mismatch`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    const sentences = question.explanation.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
    if (sentences.length < 2 || sentences.length > 3) issues.push(`${question.questionId}: explanation should normally be 2-3 sentences`);
    for (const factId of question.factIds) if (!factSet.has(factId)) issues.push(`${question.questionId}: unknown fact id ${factId}`);
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner leakage: ${banned}`);
  }

  for (const qlId of Object.keys(PGK_001_CP015_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP015_REVIEW_BATCH_V1.length,
  });
}
