import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import {
  assertIopEnglishReviewCaseletIntegrity,
  generateIopEnglishReviewCaselet,
} from "./english-editorial.ts";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import type { IopPermanentQlId, IopPermanentSolveMode } from "./permanent-authorities.ts";

const casesPerQl = Number(process.env.IOP_ENGLISH_CASES_PER_QL ?? 12);
const started = performance.now();

const qlIds: readonly IopPermanentQlId[] = [
  "IOP-QL-001",
  "IOP-QL-002",
  "IOP-QL-003",
  "IOP-QL-004",
  "IOP-QL-005",
  "IOP-QL-006",
  "IOP-QL-007",
  "IOP-QL-008",
] as const;

const solveModes = new Set<IopPermanentSolveMode>();
const qlCounts = new Map<IopPermanentQlId, number>();
const modeCounts = new Map<string, number>();
const answerPositions = [0, 0, 0, 0];
const caseletIds = new Set<string>();
const visibleFingerprints = new Set<string>();
let generated = 0;
let childQuestions = 0;

function visibleFingerprint(caselet: ReturnType<typeof generateIopEnglishReviewCaselet>): string {
  return [
    caselet.qlId,
    caselet.sourceModeId,
    caselet.demonstration.input.join("|"),
    caselet.demonstration.steps.map((row) => row.join("|")).join("/"),
    caselet.target.input.join("|"),
    caselet.target.steps.map((row) => row.join("|")).join("/"),
  ].join("::");
}

assert.equal(IOP_ENGLISH_SOURCE_MODES.length, 19, "English V1 should expose exactly 19 whitelisted source modes");
assert.equal(new Set(IOP_ENGLISH_SOURCE_MODES.map((mode) => mode.sourceModeId)).size, 19, "Source-mode IDs must be unique");
for (const qlId of qlIds) assert.ok(IOP_ENGLISH_SOURCE_MODES.some((mode) => mode.qlId === qlId), `${qlId} has no English source mode`);

// Prove every whitelisted source mode explicitly at least once.
for (const mode of IOP_ENGLISH_SOURCE_MODES) {
  const seed = `IOP-EN-MODE-${mode.sourceModeId}`;
  const first = generateIopEnglishReviewCaselet(seed, mode.qlId, mode.sourceModeId);
  const replay = generateIopEnglishReviewCaselet(seed, mode.qlId, mode.sourceModeId);
  assert.deepEqual(first, replay, `${mode.sourceModeId} is not deterministic`);
  assertIopEnglishReviewCaseletIntegrity(first);
  assert.equal(first.sourceModeId, mode.sourceModeId);
  assert.ok(first.sourceEvidenceIds.length > 0, `${mode.sourceModeId} has no source evidence`);
  modeCounts.set(mode.sourceModeId, (modeCounts.get(mode.sourceModeId) ?? 0) + 1);
}

// Prove normal permanent-QL generation and query overlays at scale.
for (const qlId of qlIds) {
  for (let index = 0; index < casesPerQl; index += 1) {
    const seed = `IOP-EN-PROOF-${qlId}-${String(index).padStart(4, "0")}`;
    const first = generateIopEnglishReviewCaselet(seed, qlId);
    const replay = generateIopEnglishReviewCaselet(seed, qlId);
    assert.deepEqual(first, replay, `${qlId}/${seed} is not deterministic`);
    assertIopEnglishReviewCaseletIntegrity(first);

    generated += 1;
    childQuestions += first.children.length;
    qlCounts.set(qlId, (qlCounts.get(qlId) ?? 0) + 1);
    modeCounts.set(first.sourceModeId, (modeCounts.get(first.sourceModeId) ?? 0) + 1);

    assert.ok(!caseletIds.has(first.caseletId), `Duplicate caselet id ${first.caseletId}`);
    caseletIds.add(first.caseletId);
    const visible = visibleFingerprint(first);
    assert.ok(!visibleFingerprints.has(visible), `Duplicate visible English caselet ${qlId}/${seed}`);
    visibleFingerprints.add(visible);

    for (const child of first.children) {
      solveModes.add(child.kind);
      answerPositions[child.answerIndex] += 1;
      assert.ok(child.explanation.includes(child.answerDisplay), `${qlId}/${child.kind} explanation is not answer-specific`);
      assert.ok(!child.explanation.startsWith(first.ruleExplanation), `${qlId}/${child.kind} repeats the shared rule`);
    }

    assert.equal(first.lifecycle.maturity, "ENGLISH_REVIEW_CANDIDATE");
    assert.equal(first.lifecycle.permanentQlCount, 8);
    assert.equal(first.lifecycle.englishFreeze, false);
    assert.equal(first.lifecycle.questionStudioDiscoverable, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.testEligible, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);
  }
}

for (const qlId of qlIds) assert.equal(qlCounts.get(qlId), casesPerQl, `Unexpected English coverage for ${qlId}`);
for (const mode of IOP_ENGLISH_SOURCE_MODES) assert.ok((modeCounts.get(mode.sourceModeId) ?? 0) > 0, `${mode.sourceModeId} was never generated`);
for (const solveMode of [
  "STEP_OUTPUT",
  "FINAL_OUTPUT",
  "ELEMENT_AT_POSITION",
  "POSITION_OF_ELEMENT",
  "STEP_NUMBER",
  "PREVIOUS_STEP",
  "MISSING_STEP",
  "REMAINING_STEP_COUNT",
] as const) {
  assert.ok(solveModes.has(solveMode), `${solveMode} was not reached by English production proof`);
}
assert.ok(answerPositions.every((count) => count > 0), `English proof did not reach all four answer positions: ${answerPositions.join(",")}`);

console.log("PASS_IOP_001_ENGLISH_PRODUCTION_AUTHORITIES");
console.log(`permanent QLs ${qlIds.length}`);
console.log(`whitelisted source modes ${IOP_ENGLISH_SOURCE_MODES.length}`);
console.log(`scaled caselets ${generated}`);
console.log(`scaled child questions ${childQuestions}`);
console.log(`solve modes covered ${solveModes.size}`);
console.log(`unique scaled caselets ${visibleFingerprints.size}`);
console.log(`answer positions ${answerPositions.join(",")}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - started)}`);
console.log("English freeze false");
console.log("Question Studio false");
