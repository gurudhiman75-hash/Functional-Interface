import type { GeoLoc001Difficulty, GeoLoc001Question } from "./geo-loc-001-review-types";
import { GEO_LOC_001_CP001_REVIEW_BATCH_V1, auditGeoLoc001Cp001ReviewBatchV1 } from "./geo-loc-001-cp001-review-batch-v1";
import { GEO_LOC_001_CP002_REVIEW_BATCH_V1, auditGeoLoc001Cp002ReviewBatchV1 } from "./geo-loc-001-cp002-review-batch-v1";
import { GEO_LOC_001_CP003_REVIEW_BATCH_V1, auditGeoLoc001Cp003ReviewBatchV1 } from "./geo-loc-001-cp003-review-batch-v1";
import { GEO_LOC_001_CP004_REVIEW_BATCH_V1, auditGeoLoc001Cp004ReviewBatchV1 } from "./geo-loc-001-cp004-review-batch-v1";
import { GEO_LOC_001_CP005_REVIEW_BATCH_V1, auditGeoLoc001Cp005ReviewBatchV1 } from "./geo-loc-001-cp005-review-batch-v1";
import { GEO_LOC_001_CP006_REVIEW_BATCH_V1, auditGeoLoc001Cp006ReviewBatchV1 } from "./geo-loc-001-cp006-review-batch-v1";
import { GEO_LOC_001_CP007_REVIEW_BATCH_V1, auditGeoLoc001Cp007ReviewBatchV1 } from "./geo-loc-001-cp007-review-batch-v1";
import { GEO_LOC_001_CP008_REVIEW_BATCH_V1, auditGeoLoc001Cp008ReviewBatchV1 } from "./geo-loc-001-cp008-review-batch-v1";
import { GEO_LOC_001_CP009_REVIEW_BATCH_V1, auditGeoLoc001Cp009ReviewBatchV1 } from "./geo-loc-001-cp009-review-batch-v1";
import { GEO_LOC_001_CP010_REVIEW_BATCH_V1, auditGeoLoc001Cp010ReviewBatchV1 } from "./geo-loc-001-cp010-review-batch-v1";
import { GEO_LOC_001_CP011_REVIEW_BATCH_V1, auditGeoLoc001Cp011ReviewBatchV1 } from "./geo-loc-001-cp011-review-batch-v1";
import { GEO_LOC_001_CP012_REVIEW_BATCH_V1, auditGeoLoc001Cp012ReviewBatchV1 } from "./geo-loc-001-cp012-review-batch-v1";
import {
  GEO_LOC_001_CP013_REVIEW_BATCH_V1,
  auditGeoLoc001Cp013ReviewBatchV1,
} from "./geo-loc-001-cp013-review-batch-v1";

const OWNING_BATCHES = Object.freeze([
  GEO_LOC_001_CP001_REVIEW_BATCH_V1,
  GEO_LOC_001_CP002_REVIEW_BATCH_V1,
  GEO_LOC_001_CP003_REVIEW_BATCH_V1,
  GEO_LOC_001_CP004_REVIEW_BATCH_V1,
  GEO_LOC_001_CP005_REVIEW_BATCH_V1,
  GEO_LOC_001_CP006_REVIEW_BATCH_V1,
  GEO_LOC_001_CP007_REVIEW_BATCH_V1,
  GEO_LOC_001_CP008_REVIEW_BATCH_V1,
  GEO_LOC_001_CP009_REVIEW_BATCH_V1,
  GEO_LOC_001_CP010_REVIEW_BATCH_V1,
  GEO_LOC_001_CP011_REVIEW_BATCH_V1,
  GEO_LOC_001_CP012_REVIEW_BATCH_V1,
]);

const OWNING_AUDITS = Object.freeze([
  auditGeoLoc001Cp001ReviewBatchV1(),
  auditGeoLoc001Cp002ReviewBatchV1(),
  auditGeoLoc001Cp003ReviewBatchV1(),
  auditGeoLoc001Cp004ReviewBatchV1(),
  auditGeoLoc001Cp005ReviewBatchV1(),
  auditGeoLoc001Cp006ReviewBatchV1(),
  auditGeoLoc001Cp007ReviewBatchV1(),
  auditGeoLoc001Cp008ReviewBatchV1(),
  auditGeoLoc001Cp009ReviewBatchV1(),
  auditGeoLoc001Cp010ReviewBatchV1(),
  auditGeoLoc001Cp011ReviewBatchV1(),
  auditGeoLoc001Cp012ReviewBatchV1(),
]);

export const GEO_LOC_001_CLOSURE_REBALANCE_TARGETS_V1 = new Map<string, number>([
  ["GEO-LOC-001-CP001-Q005", 2],
  ["GEO-LOC-001-CP002-Q006", 3],
  ["GEO-LOC-001-CP003-Q005", 2],
  ["GEO-LOC-001-CP004-Q006", 3],
  ["GEO-LOC-001-CP005-Q005", 2],
  ["GEO-LOC-001-CP006-Q006", 3],
  ["GEO-LOC-001-CP007-Q005", 2],
  ["GEO-LOC-001-CP008-Q006", 3],
  ["GEO-LOC-001-CP009-Q005", 2],
  ["GEO-LOC-001-CP010-Q006", 3],
  ["GEO-LOC-001-CP011-Q005", 2],
  ["GEO-LOC-001-CP012-Q006", 3],
]);

const RAW_OWNING: readonly GeoLoc001Question[] = Object.freeze(
  OWNING_BATCHES.flatMap((batch) => [...batch]),
);

function moveCanonicalAnswer(
  source: GeoLoc001Question,
  targetIndex: number,
): GeoLoc001Question {
  const remaining = source.options.filter((_, index) => index !== source.correctIndex);
  const options = [...remaining];
  options.splice(targetIndex, 0, source.canonicalAnswer);
  return Object.freeze({
    ...source,
    options: Object.freeze(options),
    correctIndex: targetIndex,
    sourceIds: Object.freeze([...source.sourceIds]),
    sourceFactIds: Object.freeze([...source.sourceFactIds]),
  });
}

export const GEO_LOC_001_CLOSURE_OWNING_CORPUS_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW_OWNING.map((question) => {
    const target = GEO_LOC_001_CLOSURE_REBALANCE_TARGETS_V1.get(question.questionId);
    return target == null ? question : moveCanonicalAnswer(question, target);
  }),
);

function answerPositions(questions: readonly GeoLoc001Question[]): readonly number[] {
  const result = [0, 0, 0, 0];
  for (const q of questions) result[q.correctIndex] += 1;
  return Object.freeze(result);
}

function semanticSignature(q: GeoLoc001Question): string {
  return JSON.stringify({
    questionId: q.questionId,
    qlId: q.qlId,
    qlName: q.qlName,
    difficulty: q.difficulty,
    stem: q.stem,
    canonicalAnswer: q.canonicalAnswer,
    explanation: q.explanation,
    sourceIds: q.sourceIds,
    sourceFactIds: q.sourceFactIds,
    reviewOnly: q.reviewOnly,
    runtimeRegistered: q.runtimeRegistered,
  });
}

export function auditGeoLoc001ChapterClosureV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const qlStems: Record<string, Set<string>> = {};
  const qlExplanations: Record<string, Set<string>> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const rawAnswerPositions = answerPositions(RAW_OWNING);
  const closureAnswerPositions = answerPositions(GEO_LOC_001_CLOSURE_OWNING_CORPUS_V1);
  let reorderedQuestionCount = 0;

  OWNING_AUDITS.forEach((audit, index) => {
    if (!audit.valid) issues.push("CP_AUDIT:" + String(index + 1).padStart(3, "0") + ":" + audit.issues.join("|"));
  });

  for (let index = 0; index < RAW_OWNING.length; index += 1) {
    const raw = RAW_OWNING[index]!;
    const q = GEO_LOC_001_CLOSURE_OWNING_CORPUS_V1[index]!;
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    qlStems[q.qlId] ??= new Set<string>();
    qlExplanations[q.qlId] ??= new Set<string>();
    qlStems[q.qlId].add(q.stem.replace(/\s+/g, " ").trim().toLowerCase());
    qlExplanations[q.qlId].add(q.explanation.replace(/\s+/g, " ").trim().toLowerCase());
    difficultyCounts[q.difficulty] += 1;

    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
    if (semanticSignature(raw) !== semanticSignature(q)) issues.push("SEMANTIC_DRIFT:" + q.questionId);

    const expectedTarget = GEO_LOC_001_CLOSURE_REBALANCE_TARGETS_V1.get(q.questionId);
    if (expectedTarget == null) {
      if (raw.correctIndex !== q.correctIndex || JSON.stringify(raw.options) !== JSON.stringify(q.options)) {
        issues.push("UNPLANNED_REORDER:" + q.questionId);
      }
    } else {
      reorderedQuestionCount += 1;
      if (q.correctIndex !== expectedTarget) issues.push("REBALANCE_TARGET:" + q.questionId + ":" + q.correctIndex);
      if (raw.correctIndex === q.correctIndex) issues.push("REBALANCE_NOOP:" + q.questionId);
    }
  }

  if (RAW_OWNING.length !== 648) issues.push("RAW_OWNING_COUNT:" + RAW_OWNING.length);
  if (GEO_LOC_001_CLOSURE_OWNING_CORPUS_V1.length !== 648) issues.push("CLOSURE_OWNING_COUNT:" + GEO_LOC_001_CLOSURE_OWNING_CORPUS_V1.length);
  if (reorderedQuestionCount !== 12) issues.push("REORDERED_COUNT:" + reorderedQuestionCount);
  if (GEO_LOC_001_CLOSURE_REBALANCE_TARGETS_V1.size !== 12) issues.push("REBALANCE_MAP_COUNT:" + GEO_LOC_001_CLOSURE_REBALANCE_TARGETS_V1.size);

  for (let n = 1; n <= 108; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
    if ((qlStems[qlId]?.size ?? 0) !== 6) issues.push("QL_STEMS:" + qlId + ":" + (qlStems[qlId]?.size ?? 0));
    if ((qlExplanations[qlId]?.size ?? 0) !== 6) issues.push("QL_EXPLANATIONS:" + qlId + ":" + (qlExplanations[qlId]?.size ?? 0));
  }

  if (Object.keys(qlCounts).length !== 108) issues.push("PERMANENT_QL_COUNT:" + Object.keys(qlCounts).length);
  if (difficultyCounts.Easy !== 216 || difficultyCounts.Medium !== 360 || difficultyCounts.Hard !== 72) {
    issues.push("OWNING_DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  if (rawAnswerPositions.join(",") !== "168,168,156,156") {
    issues.push("RAW_ANSWER_POSITIONS:" + rawAnswerPositions.join(","));
  }
  if (closureAnswerPositions.join(",") !== "162,162,162,162") {
    issues.push("CLOSURE_ANSWER_POSITIONS:" + closureAnswerPositions.join(","));
  }

  const mastery = auditGeoLoc001Cp013ReviewBatchV1();
  if (!mastery.valid) issues.push("CP013_AUDIT:" + mastery.issues.join("|"));
  if (GEO_LOC_001_CP013_REVIEW_BATCH_V1.length !== 108) issues.push("CP013_COUNT:" + GEO_LOC_001_CP013_REVIEW_BATCH_V1.length);
  if (mastery.difficultyCounts.Easy !== 36 || mastery.difficultyCounts.Medium !== 60 || mastery.difficultyCounts.Hard !== 12) {
    issues.push("CP013_DIFFICULTY:" + JSON.stringify(mastery.difficultyCounts));
  }
  if (mastery.answerPositions.join(",") !== "27,27,27,27") {
    issues.push("CP013_ANSWER_POSITIONS:" + mastery.answerPositions.join(","));
  }
  if (mastery.stemCount !== 108 || mastery.explanationCount !== 108) {
    issues.push("CP013_UNIQUENESS:" + mastery.stemCount + ":" + mastery.explanationCount);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    rawOwningQuestionCount: RAW_OWNING.length,
    closureOwningQuestionCount: GEO_LOC_001_CLOSURE_OWNING_CORPUS_V1.length,
    permanentQlCount: Object.keys(qlCounts).length,
    difficultyCounts: Object.freeze(difficultyCounts),
    rawAnswerPositions,
    closureAnswerPositions,
    reorderedQuestionCount,
    masteryQuestionCount: GEO_LOC_001_CP013_REVIEW_BATCH_V1.length,
    masteryDifficultyCounts: mastery.difficultyCounts,
    masteryAnswerPositions: mastery.answerPositions,
    masteryStemCount: mastery.stemCount,
    masteryExplanationCount: mastery.explanationCount,
    runtimePublicationAuthorized: false as const,
  });
}
