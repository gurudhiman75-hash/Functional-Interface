import type { GeoSoi001Difficulty, GeoSoi001Question } from "./geo-soi-001-review-types";
import { GEO_SOI_001_CP001_REVIEW_BATCH_V1, auditGeoSoi001Cp001ReviewBatchV1 } from "./geo-soi-001-cp001-review-batch-v1";
import { GEO_SOI_001_CP002_REVIEW_BATCH_V1, auditGeoSoi001Cp002ReviewBatchV1 } from "./geo-soi-001-cp002-review-batch-v1";
import { GEO_SOI_001_CP003_REVIEW_BATCH_V1, auditGeoSoi001Cp003ReviewBatchV1 } from "./geo-soi-001-cp003-review-batch-v1";
import { GEO_SOI_001_CP004_REVIEW_BATCH_V1, auditGeoSoi001Cp004ReviewBatchV1 } from "./geo-soi-001-cp004-review-batch-v1";
import { GEO_SOI_001_CP005_REVIEW_BATCH_V1, auditGeoSoi001Cp005ReviewBatchV1 } from "./geo-soi-001-cp005-review-batch-v1";
import { GEO_SOI_001_CP006_REVIEW_BATCH_V1, auditGeoSoi001Cp006ReviewBatchV1 } from "./geo-soi-001-cp006-review-batch-v1";
import { GEO_SOI_001_CP007_REVIEW_BATCH_V1, auditGeoSoi001Cp007ReviewBatchV1 } from "./geo-soi-001-cp007-review-batch-v1";
import { GEO_SOI_001_CP008_REVIEW_BATCH_V1, auditGeoSoi001Cp008ReviewBatchV1 } from "./geo-soi-001-cp008-review-batch-v1";
import { GEO_SOI_001_CP009_REVIEW_BATCH_V1, auditGeoSoi001Cp009ReviewBatchV1 } from "./geo-soi-001-cp009-review-batch-v1";
import { GEO_SOI_001_CP010_REVIEW_BATCH_V1, auditGeoSoi001Cp010ReviewBatchV1 } from "./geo-soi-001-cp010-review-batch-v1";
import { GEO_SOI_001_CP011_REVIEW_BATCH_V1, auditGeoSoi001Cp011ReviewBatchV1 } from "./geo-soi-001-cp011-review-batch-v1";
import { GEO_SOI_001_CP012_REVIEW_BATCH_V1, auditGeoSoi001Cp012ReviewBatchV1 } from "./geo-soi-001-cp012-review-batch-v1";
import { GEO_SOI_001_CP013_REVIEW_BATCH_V1, auditGeoSoi001Cp013ReviewBatchV1 } from "./geo-soi-001-cp013-review-batch-v1";

const OWNING_BATCHES = Object.freeze([
  GEO_SOI_001_CP001_REVIEW_BATCH_V1,
  GEO_SOI_001_CP002_REVIEW_BATCH_V1,
  GEO_SOI_001_CP003_REVIEW_BATCH_V1,
  GEO_SOI_001_CP004_REVIEW_BATCH_V1,
  GEO_SOI_001_CP005_REVIEW_BATCH_V1,
  GEO_SOI_001_CP006_REVIEW_BATCH_V1,
  GEO_SOI_001_CP007_REVIEW_BATCH_V1,
  GEO_SOI_001_CP008_REVIEW_BATCH_V1,
  GEO_SOI_001_CP009_REVIEW_BATCH_V1,
  GEO_SOI_001_CP010_REVIEW_BATCH_V1,
  GEO_SOI_001_CP011_REVIEW_BATCH_V1,
  GEO_SOI_001_CP012_REVIEW_BATCH_V1,
]);

const OWNING_AUDITS = Object.freeze([
  auditGeoSoi001Cp001ReviewBatchV1(),
  auditGeoSoi001Cp002ReviewBatchV1(),
  auditGeoSoi001Cp003ReviewBatchV1(),
  auditGeoSoi001Cp004ReviewBatchV1(),
  auditGeoSoi001Cp005ReviewBatchV1(),
  auditGeoSoi001Cp006ReviewBatchV1(),
  auditGeoSoi001Cp007ReviewBatchV1(),
  auditGeoSoi001Cp008ReviewBatchV1(),
  auditGeoSoi001Cp009ReviewBatchV1(),
  auditGeoSoi001Cp010ReviewBatchV1(),
  auditGeoSoi001Cp011ReviewBatchV1(),
  auditGeoSoi001Cp012ReviewBatchV1(),
]);

export function auditGeoSoi001ChapterClosureV1() {
  const issues: string[] = [];
  const owning: GeoSoi001Question[] = OWNING_BATCHES.flatMap((batch) => [...batch]);
  const ids = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const qlStems: Record<string, Set<string>> = {};
  const qlExplanations: Record<string, Set<string>> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  OWNING_AUDITS.forEach((audit, index) => {
    if (!audit.valid) issues.push("CP_AUDIT:" + String(index + 1).padStart(3, "0") + ":" + audit.issues.join("|"));
  });

  for (const q of owning) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    qlStems[q.qlId] ??= new Set<string>();
    qlExplanations[q.qlId] ??= new Set<string>();
    qlStems[q.qlId].add(q.stem.replace(/\s+/g, " ").trim().toLowerCase());
    qlExplanations[q.qlId].add(q.explanation.replace(/\s+/g, " ").trim().toLowerCase());
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
  }

  if (owning.length !== 648) issues.push("OWNING_COUNT:" + owning.length);
  for (let n = 1; n <= 108; n += 1) {
    const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
    if ((qlStems[qlId]?.size ?? 0) !== 6) issues.push("QL_STEMS:" + qlId + ":" + (qlStems[qlId]?.size ?? 0));
    if ((qlExplanations[qlId]?.size ?? 0) !== 6) issues.push("QL_EXPLANATIONS:" + qlId + ":" + (qlExplanations[qlId]?.size ?? 0));
  }
  if (difficultyCounts.Easy !== 216 || difficultyCounts.Medium !== 360 || difficultyCounts.Hard !== 72) issues.push("OWNING_DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "162,162,162,162") issues.push("OWNING_ANSWER_POSITIONS:" + answerPositions.join(","));

  const mastery = auditGeoSoi001Cp013ReviewBatchV1();
  if (!mastery.valid) issues.push("CP013_AUDIT:" + mastery.issues.join("|"));
  if (GEO_SOI_001_CP013_REVIEW_BATCH_V1.length !== 108) issues.push("CP013_COUNT:" + GEO_SOI_001_CP013_REVIEW_BATCH_V1.length);
  if (mastery.difficultyCounts.Easy !== 36 || mastery.difficultyCounts.Medium !== 60 || mastery.difficultyCounts.Hard !== 12) issues.push("CP013_DIFFICULTY:" + JSON.stringify(mastery.difficultyCounts));
  if (mastery.answerPositions.join(",") !== "27,27,27,27") issues.push("CP013_ANSWER_POSITIONS:" + mastery.answerPositions.join(","));
  if (mastery.stemCount !== 108 || mastery.explanationCount !== 108) issues.push("CP013_UNIQUENESS:" + mastery.stemCount + ":" + mastery.explanationCount);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    owningQuestionCount: owning.length,
    permanentQlCount: Object.keys(qlCounts).length,
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    masteryQuestionCount: GEO_SOI_001_CP013_REVIEW_BATCH_V1.length,
    masteryDifficultyCounts: mastery.difficultyCounts,
    masteryAnswerPositions: mastery.answerPositions,
    masteryStemCount: mastery.stemCount,
    masteryExplanationCount: mastery.explanationCount,
    runtimePublicationAuthorized: false as const,
  });
}
