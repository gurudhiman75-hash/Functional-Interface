import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp001-freeze-v1";
import { GEO_RIV_001_CP002_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp002-freeze-v1";
import { GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp003-freeze-v1";
import { GEO_RIV_001_CP004_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp004-freeze-v1";
import { GEO_RIV_001_CP005_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp005-freeze-v1";
import { GEO_RIV_001_CP006_REVIEW_BATCH_V1 } from "./geo-riv-001-cp006-review-batch-v1";
import { GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED } from "./geo-riv-001-cp007-review-polish-v3";
import { GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp008-freeze-v1";
import { GEO_RIV_001_CP009_REVIEW_BATCH_V3 } from "./geo-riv-001-cp009-review-batch-v3";
import { GEO_RIV_001_CP010_REVIEW_BATCH_V1 } from "./geo-riv-001-cp010-review-batch-v1";
import { GEO_RIV_001_CP011_REVIEW_BATCH_V1 } from "./geo-riv-001-cp011-review-batch-v1";
import { GEO_RIV_001_CP012_REVIEW_BATCH_V1 } from "./geo-riv-001-cp012-review-batch-v1";
import { GEO_RIV_001_CP013_REVIEW_BATCH_V1 } from "./geo-riv-001-cp013-review-batch-v1";
import { GEO_RIV_001_CP014_REVIEW_BATCH_V1 } from "./geo-riv-001-cp014-review-batch-v1";
import type { GeoRiv001Cp015ReviewQuestion } from "./geo-riv-001-cp015-review-types";

type SourceQuestion = {
  questionId: string;
  cpId: string;
  qlId: string;
  qlName?: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  upstreamFactIds?: readonly string[];
};

type SourcePool = {
  cpId: string;
  quota: 4 | 6;
  questions: readonly SourceQuestion[];
};

const SOURCE_POOLS: readonly SourcePool[] = Object.freeze([
  { cpId: "GEO-RIV-001-CP001", quota: 4, questions: GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP002", quota: 4, questions: GEO_RIV_001_CP002_FROZEN_QUESTIONS_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP003", quota: 4, questions: GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP004", quota: 4, questions: GEO_RIV_001_CP004_FROZEN_QUESTIONS_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP005", quota: 4, questions: GEO_RIV_001_CP005_FROZEN_QUESTIONS_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP006", quota: 4, questions: GEO_RIV_001_CP006_REVIEW_BATCH_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP007", quota: 6, questions: GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP008", quota: 4, questions: GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP009", quota: 4, questions: GEO_RIV_001_CP009_REVIEW_BATCH_V3 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP010", quota: 4, questions: GEO_RIV_001_CP010_REVIEW_BATCH_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP011", quota: 4, questions: GEO_RIV_001_CP011_REVIEW_BATCH_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP012", quota: 4, questions: GEO_RIV_001_CP012_REVIEW_BATCH_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP013", quota: 4, questions: GEO_RIV_001_CP013_REVIEW_BATCH_V1 as readonly SourceQuestion[] },
  { cpId: "GEO-RIV-001-CP014", quota: 6, questions: GEO_RIV_001_CP014_REVIEW_BATCH_V1 as readonly SourceQuestion[] },
]);

export const GEO_RIV_001_CP015_SOURCE_CP_QUOTAS_V1 = Object.freeze(
  Object.fromEntries(SOURCE_POOLS.map((pool) => [pool.cpId, pool.quota])) as Record<string, number>,
);

const BASE_DIFFICULTY_PATTERN: readonly KnowledgeV1Difficulty[] = ["Easy", "Medium", "Medium", "Hard"];
const CP007_DIFFICULTY_PATTERN: readonly KnowledgeV1Difficulty[] = ["Easy", "Easy", "Medium", "Hard", "Medium", "Medium"];
const CP014_DIFFICULTY_PATTERN: readonly KnowledgeV1Difficulty[] = ["Medium", "Medium", "Medium", "Medium", "Medium", "Hard"];

function difficultyPatternFor(pool: SourcePool) {
  if (pool.cpId === "GEO-RIV-001-CP007") return CP007_DIFFICULTY_PATTERN;
  if (pool.cpId === "GEO-RIV-001-CP014") return CP014_DIFFICULTY_PATTERN;
  return BASE_DIFFICULTY_PATTERN;
}

function semanticKey(question: SourceQuestion) {
  return `${question.stem}::${question.canonicalAnswer}`;
}

function sourceQuestionValid(question: SourceQuestion) {
  return question.options.length === 4 &&
    new Set(question.options).size === 4 &&
    question.correctIndex >= 0 &&
    question.correctIndex < 4 &&
    question.options[question.correctIndex] === question.canonicalAnswer &&
    question.sourceIds.length > 0 &&
    question.sourceFactIds.length > 0;
}

function selectSourceQuestions() {
  const selected: Array<{ pool: SourcePool; source: SourceQuestion }> = [];
  const globalSemantics = new Set<string>();

  for (const pool of SOURCE_POOLS) {
    const usedQls = new Set<string>();
    const pattern = difficultyPatternFor(pool);

    for (let slot = 0; slot < pool.quota; slot += 1) {
      const targetDifficulty = pattern[slot];
      const candidates = pool.questions.filter((question) =>
        sourceQuestionValid(question) &&
        question.cpId === pool.cpId &&
        question.difficulty === targetDifficulty &&
        !usedQls.has(question.qlId) &&
        !globalSemantics.has(semanticKey(question)),
      );
      if (!candidates.length) {
        throw new Error(`CP015 cannot satisfy ${pool.cpId} slot ${slot + 1} at ${targetDifficulty} with a distinct inherited QL`);
      }
      const source = deterministicShuffle(candidates, `geo-riv-001-cp015:${pool.cpId}:${slot}:${targetDifficulty}`)[0];
      usedQls.add(source.qlId);
      globalSemantics.add(semanticKey(source));
      selected.push({ pool, source });
    }
  }

  return selected;
}

function rebalanceOptions(question: SourceQuestion, targetIndex: number) {
  const options = [...question.options];
  if (question.correctIndex !== targetIndex) {
    [options[question.correctIndex], options[targetIndex]] = [options[targetIndex], options[question.correctIndex]];
  }
  return options;
}

function wrapQuestion(source: SourceQuestion, index: number): GeoRiv001Cp015ReviewQuestion {
  const targetIndex = index % 4;
  const options = rebalanceOptions(source, targetIndex);
  return {
    questionId: `GEO-RIV-001-CP015-V1-${String(index + 1).padStart(3, "0")}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP015",
    qlId: source.qlId,
    qlName: source.qlName ?? source.qlId,
    difficulty: source.difficulty,
    stem: source.stem,
    options,
    correctIndex: targetIndex,
    canonicalAnswer: source.canonicalAnswer,
    explanation: source.explanation,
    sourceIds: [...source.sourceIds],
    sourceFactIds: [...source.sourceFactIds],
    upstreamFactIds: [...(source.upstreamFactIds ?? [])],
    sourceCpId: source.cpId,
    sourceQuestionId: source.questionId,
    sourceQlId: source.qlId,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export const GEO_RIV_001_CP015_REVIEW_BATCH_V1: readonly GeoRiv001Cp015ReviewQuestion[] = Object.freeze(
  selectSourceQuestions().map(({ source }, index) => Object.freeze(wrapQuestion(source, index))),
);

export function auditGeoRiv001Cp015ReviewBatchV1() {
  const issues: string[] = [];
  const cpCounts: Record<string, number> = {};
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<KnowledgeV1Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const ids = new Set<string>();
  const sourceIds = new Set<string>();
  const inheritedQls = new Set<string>();
  const semantics = new Set<string>();

  for (const question of GEO_RIV_001_CP015_REVIEW_BATCH_V1) {
    cpCounts[question.sourceCpId] = (cpCounts[question.sourceCpId] ?? 0) + 1;
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;

    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    if (sourceIds.has(question.sourceQuestionId)) issues.push(`DUPLICATE_SOURCE_QUESTION:${question.sourceQuestionId}`);
    sourceIds.add(question.sourceQuestionId);
    if (inheritedQls.has(question.qlId)) issues.push(`DUPLICATE_INHERITED_QL:${question.qlId}`);
    inheritedQls.add(question.qlId);

    const semantic = `${question.stem}::${question.canonicalAnswer}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC_PAYLOAD:${question.questionId}`);
    semantics.add(semantic);

    if (question.cpId !== "GEO-RIV-001-CP015") issues.push(`BAD_CP:${question.questionId}`);
    if (question.sourceQlId !== question.qlId) issues.push(`QL_LINEAGE:${question.questionId}`);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`BAD_OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_ALIGNMENT:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`MISSING_PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (/reviewed relation|sourceFact|generator|qualification gate|runtimeRegistered/i.test(`${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)) {
      issues.push(`META_LANGUAGE:${question.questionId}`);
    }
  }

  if (GEO_RIV_001_CP015_REVIEW_BATCH_V1.length !== 60) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP015_REVIEW_BATCH_V1.length}`);
  if (inheritedQls.size !== 60) issues.push(`INHERITED_QL_BREADTH:${inheritedQls.size}`);
  if (semantics.size !== 60) issues.push(`SEMANTIC_UNIQUENESS:${semantics.size}`);
  if (answerPositions.join(",") !== "15,15,15,15") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (difficultyCounts.Easy !== 14 || difficultyCounts.Medium !== 32 || difficultyCounts.Hard !== 14) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }

  for (const [cpId, quota] of Object.entries(GEO_RIV_001_CP015_SOURCE_CP_QUOTAS_V1)) {
    if (cpCounts[cpId] !== quota) issues.push(`SOURCE_CP_QUOTA:${cpId}:${cpCounts[cpId] ?? 0}/${quota}`);
  }

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_RIV_001_CP015_REVIEW_BATCH_V1.length,
    inheritedQlCount: inheritedQls.size,
    semanticUniqueCount: semantics.size,
    cpCounts,
    qlCounts,
    difficultyCounts,
    answerPositions,
  };
}
