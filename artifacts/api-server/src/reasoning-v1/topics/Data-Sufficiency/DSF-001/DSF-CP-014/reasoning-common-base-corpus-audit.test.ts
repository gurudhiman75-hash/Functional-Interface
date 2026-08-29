import assert from "node:assert/strict";
import { generateDsfCp012RankingBatch } from "../DSF-CP-012/ranking-runtime-v1.ts";
import { generateDsfCp012DirectionBatch } from "../DSF-CP-012/direction-runtime-v1.ts";
import { generateDsfCp012BloodQuestion } from "../DSF-CP-012/blood-relations-runtime-v2.ts";
import { generateDsfCp012InequalityBatch } from "../DSF-CP-012/inequality-runtime-v1.ts";
import { generateDsfCp013SeatingBatch } from "../DSF-CP-013/seating-runtime-v1.ts";
import { generateDsfCp013CodingBatch } from "../DSF-CP-013/coding-runtime-v1.ts";
import { generateDsfCp013CalendarBatch } from "../DSF-CP-013/calendar-runtime-v1.ts";
import { auditDsfEditorialBatch, type DsfEditorialAuditRecord } from "./editorial-near-duplicate-audit.ts";
import {
  applyReasoningCommonBaseEditorialSurface,
  DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION,
  type DsfReasoningEditorialLane,
} from "./reasoning-common-base-editorial-overlay.ts";

type AnyQuestion = Readonly<Record<string, any>>;

const SEEDS = Object.freeze(Array.from({ length: 300 }, (_, seed) => seed));

function visibleStem(stem: string): string {
  return stem.split(/\n\nStatement I:/u, 1)[0]!.trim();
}

function explanationText(explanation: unknown): string {
  if (typeof explanation === "string") return explanation;
  if (!explanation || typeof explanation !== "object") return "";
  return Object.values(explanation as Record<string, unknown>)
    .filter((value): value is string => typeof value === "string")
    .join(" ");
}

function toRecord(lane: string, question: AnyQuestion): DsfEditorialAuditRecord {
  const statements = Array.isArray(question.statements) ? question.statements : undefined;
  const statementI = statements?.[0]?.text ?? question.statementI;
  const statementII = statements?.[1]?.text ?? question.statementII;
  const solveModeId = question.solveModeId ?? question.solveMode;

  assert.equal(typeof question.stem, "string", `${lane} question must expose a stem`);
  assert.equal(typeof statementI, "string", `${lane} question must expose Statement I`);
  assert.equal(typeof statementII, "string", `${lane} question must expose Statement II`);
  assert.equal(typeof solveModeId, "string", `${lane} question must expose a solve mode`);
  assert.equal(typeof question.contextId, "string", `${lane} question must expose a context`);
  assert.equal(typeof question.studentSurfaceFingerprint, "string", `${lane} question must expose a structural fingerprint`);

  return Object.freeze({
    id: `${lane}:${String(question.seed)}`,
    stem: visibleStem(question.stem),
    statementI,
    statementII,
    explanation: explanationText(question.explanation),
    solveModeId: `${lane}:${solveModeId}`,
    contextId: `${lane}:${question.contextId}`,
    objectKey: lane,
    structuralFingerprint: `${lane}:${question.studentSurfaceFingerprint}`,
  });
}

const rawLaneQuestions: Readonly<Record<DsfReasoningEditorialLane, readonly AnyQuestion[]>> = Object.freeze({
  RANKING: generateDsfCp012RankingBatch(SEEDS),
  DIRECTION: generateDsfCp012DirectionBatch(SEEDS),
  BLOOD_RELATIONS: SEEDS.map((seed) => generateDsfCp012BloodQuestion(seed)),
  INEQUALITY: generateDsfCp012InequalityBatch(SEEDS),
  SEATING: generateDsfCp013SeatingBatch(SEEDS),
  CODING: generateDsfCp013CodingBatch(SEEDS),
  CALENDAR: generateDsfCp013CalendarBatch(SEEDS),
});

const laneQuestions: Readonly<Record<DsfReasoningEditorialLane, readonly AnyQuestion[]>> = Object.freeze(
  Object.fromEntries(
    Object.entries(rawLaneQuestions).map(([lane, questions]) => [
      lane,
      questions.map((question) => applyReasoningCommonBaseEditorialSurface(lane as DsfReasoningEditorialLane, question as any)),
    ]),
  ) as Record<DsfReasoningEditorialLane, readonly AnyQuestion[]>,
);

for (const lane of Object.keys(rawLaneQuestions) as DsfReasoningEditorialLane[]) {
  const raw = rawLaneQuestions[lane];
  const hardened = laneQuestions[lane];
  assert.equal(raw.length, 300, `${lane} must contribute exactly 300 questions.`);
  assert.equal(hardened.length, raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    const before = raw[index]!;
    const after = hardened[index]!;
    assert.equal(after.editorialSurfaceVersion, DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION);
    assert.equal(after.seed, before.seed);
    assert.deepEqual(after.statements, before.statements, `${lane}/${index}: editorial overlay must not change statements.`);
    assert.equal(after.canonicalAnswer, before.canonicalAnswer, `${lane}/${index}: editorial overlay must not change canonical answer.`);
    assert.deepEqual(after.proof, before.proof, `${lane}/${index}: editorial overlay must not change proof.`);
    assert.equal(after.sourceChapterId, before.sourceChapterId, `${lane}/${index}: editorial overlay must not change source ancestry.`);
    assert.deepEqual(after.sourceCapabilities, before.sourceCapabilities, `${lane}/${index}: editorial overlay must not change source capabilities.`);
  }
}

const records = (Object.keys(laneQuestions) as DsfReasoningEditorialLane[]).flatMap((lane) =>
  laneQuestions[lane].map((question) => toRecord(lane, question)),
);

assert.equal(records.length, 2100, "Common-base Reasoning corpus must contain exactly 2,100 questions.");

const result = auditDsfEditorialBatch(records, {
  nearDuplicateThreshold: 0.86,
  minimumSharedTokens: 5,
  compareAcrossSolveModes: false,
  maximumStructuralCluster: 10,
  maximumExplanationOpeningCluster: 80,
  explanationOpeningTokens: 8,
  minimumContextCount: 35,
  minimumObjectCount: 7,
  maximumObjectShare: 0.15,
});

console.log(JSON.stringify({
  status: result.passed ? "PASS_DSF_CP014_COMMON_BASE_REASONING_CORPUS_AUDIT" : "FAIL_DSF_CP014_COMMON_BASE_REASONING_CORPUS_AUDIT",
  editorialSurfaceVersion: DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION,
  recordCount: result.recordCount,
  laneCounts: Object.fromEntries((Object.keys(laneQuestions) as DsfReasoningEditorialLane[]).map((lane) => [lane, laneQuestions[lane].length])),
  normalizedDuplicateGroups: result.normalizedDuplicateGroups.length,
  statementSwapGroups: result.statementSwapGroups.length,
  nearDuplicatePairs: result.nearDuplicatePairs.length,
  structuralClusters: result.structuralClusters.length,
  explanationOpeningClusters: result.explanationOpeningClusters.length,
  contextCount: Object.keys(result.contextCounts).length,
  objectCount: Object.keys(result.objectCounts).length,
  topNormalizedDuplicateGroups: result.normalizedDuplicateGroups.slice(0, 12),
  topStatementSwapGroups: result.statementSwapGroups.slice(0, 12),
  topNearDuplicatePairs: result.nearDuplicatePairs.slice(0, 20),
  topStructuralClusters: result.structuralClusters.slice(0, 12),
  topExplanationOpeningClusters: result.explanationOpeningClusters.slice(0, 12),
  violations: result.violations,
}, null, 2));

assert.equal(result.normalizedDuplicateGroups.length, 0, "Common-base corpus contains normalized number/entity-only duplicate questions.");
assert.equal(result.statementSwapGroups.length, 0, "Common-base corpus contains Statement-I/II swap clones.");
assert.equal(result.nearDuplicatePairs.length, 0, "Common-base corpus contains semantic near-duplicate question pairs at or above the frozen integration threshold.");
assert.equal(result.structuralClusters.length, 0, "Common-base corpus contains an over-repeated structural fingerprint cluster.");
assert.equal(result.explanationOpeningClusters.length, 0, "Common-base corpus over-repeats the same explanation opening.");
assert(result.passed, `Common-base editorial audit failed: ${result.violations.join(" ")}`);
