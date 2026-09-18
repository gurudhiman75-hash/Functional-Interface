import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP017_FACT_IDS, PGK_001_CP017_SOURCE_IDS } from "./pgk-001-cp017-facts";
import { PGK_001_CP017_QL112_ROWS } from "./pgk-001-cp017-ql112";
import { PGK_001_CP017_QL113_ROWS } from "./pgk-001-cp017-ql113";
import { PGK_001_CP017_QL114_ROWS } from "./pgk-001-cp017-ql114";
import { PGK_001_CP017_QL115_ROWS } from "./pgk-001-cp017-ql115";
import { PGK_001_CP017_QL116_ROWS } from "./pgk-001-cp017-ql116";
import { PGK_001_CP017_QL117_ROWS } from "./pgk-001-cp017-ql117";
import { PGK_001_CP017_QL118_ROWS } from "./pgk-001-cp017-ql118";

export type Pgk001Cp017ReviewQuestion = Readonly<{
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

export const PGK_001_CP017_QL_NAMES = Object.freeze({
  "PGK-001-QL-112": "Namdhari / Kuka movement",
  "PGK-001-QL-113": "Singh Sabha and reform currents",
  "PGK-001-QL-114": "Pagri Sambhal Jatta and 1907 Punjab agitation",
  "PGK-001-QL-115": "Ghadar movement",
  "PGK-001-QL-116": "Jallianwala Bagh and 1919 Punjab",
  "PGK-001-QL-117": "Gurdwara Reform and Babbar Akali",
  "PGK-001-QL-118": "Reform and freedom chronology and synthesis",
} as const);

type SourceKey = keyof typeof PGK_001_CP017_SOURCE_IDS;
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
  ...PGK_001_CP017_QL112_ROWS,
  ...PGK_001_CP017_QL113_ROWS,
  ...PGK_001_CP017_QL114_ROWS,
  ...PGK_001_CP017_QL115_ROWS,
  ...PGK_001_CP017_QL116_ROWS,
  ...PGK_001_CP017_QL117_ROWS,
  ...PGK_001_CP017_QL118_ROWS,
] as readonly RawRow[];

export const PGK_001_CP017_REVIEW_BATCH_V1: readonly Pgk001Cp017ReviewQuestion[] = Object.freeze(
  rows.map((row, index) => {
    const qlId = `PGK-001-QL-${String(112 + Math.floor(index / 6)).padStart(3, "0")}`;
    const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceKeys] = row;
    return Object.freeze({
      questionId: `PGK-001-CP017-Q${String(index + 1).padStart(3, "0")}`,
      qlId,
      qlName: PGK_001_CP017_QL_NAMES[qlId as keyof typeof PGK_001_CP017_QL_NAMES],
      difficulty,
      stem,
      options: Object.freeze([...options]),
      correctIndex: options.indexOf(canonicalAnswer),
      canonicalAnswer,
      explanation,
      factIds: Object.freeze([...factIds]),
      sourceIds: Object.freeze(sourceKeys.map((key) => PGK_001_CP017_SOURCE_IDS[key])),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

export function auditPgk001Cp017ReviewBatchV1() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const factSet = new Set(PGK_001_CP017_FACT_IDS);
  const bannedLearnerTerms = [
    "associated with", "closely associated", "linked with", "closely linked", "known for",
    "formed the framework", "school history", "punjab-board", "pseb", "ministry of culture",
    "government of india", "source:", "website", "according to", "the correct answer is",
    "the correct option", "the other options", "this question tests", "review batch", "generator",
  ];

  for (const question of PGK_001_CP017_REVIEW_BATCH_V1) {
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

  for (const qlId of Object.keys(PGK_001_CP017_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), questionCount: PGK_001_CP017_REVIEW_BATCH_V1.length });
}
