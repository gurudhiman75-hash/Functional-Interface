import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { generateIopMixedSourceCaselet } from "./mixed-source-gap.ts";

const cases = Number(process.env.IOP_MIXED_SOURCE_CASES ?? 160);
const started = performance.now();
const caseletIds = new Set<string>();
const visibleCaselets = new Set<string>();
const answerPositions = new Map<string, number[]>([
  ["STEP_OUTPUT", [0, 0, 0, 0]],
  ["ELEMENT_AT_POSITION", [0, 0, 0, 0]],
  ["STEP_NUMBER", [0, 0, 0, 0]],
  ["FINAL_OUTPUT", [0, 0, 0, 0]],
]);
let competingRules = 0;

for (let index = 0; index < cases; index += 1) {
  const seed = `IOP-MIXED-SOURCE-PROOF-${String(index).padStart(4, "0")}`;
  const first = generateIopMixedSourceCaselet(seed);
  const replay = generateIopMixedSourceCaselet(seed);
  assert.deepEqual(first, replay, `Mixed source caselet was not deterministic for ${seed}`);
  assert.ok(first.identifiability.passed, `Mixed source identifiability failed for ${seed}`);
  assert.equal(first.identifiability.matchingRuleFingerprints.length, 1, `Mixed source ambiguity survived for ${seed}`);
  competingRules += first.identifiability.candidateRulesTested;

  assert.ok(!caseletIds.has(first.caseletId), `Duplicate mixed source caselet id ${first.caseletId}`);
  caseletIds.add(first.caseletId);
  const visible = [
    first.demonstration.input.map((token) => token.visibleValue).join("|"),
    first.demonstration.steps.map((step) => step.stateFingerprint).join("/"),
    first.target.input.map((token) => token.visibleValue).join("|"),
  ].join("::");
  assert.ok(!visibleCaselets.has(visible), `Duplicate mixed source visible caselet ${seed}`);
  visibleCaselets.add(visible);

  for (const child of first.children) answerPositions.get(child.kind)![child.answerIndex] += 1;
}

for (const [kind, counts] of answerPositions) {
  assert.ok(counts.every((count) => count > 0), `${kind} did not reach all four answer positions: ${counts.join(",")}`);
}

console.log("PASS_IOP_001_MIXED_SOURCE_GAP");
console.log(`source authority RBI_GRADE_B_2024_SHIFT1_PYQ_RECONSTRUCTION`);
console.log(`deterministic caselets ${cases}`);
console.log(`child questions ${cases * 4}`);
console.log(`competing rules audited ${competingRules}`);
console.log(`unique visible caselets ${visibleCaselets.size}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - started)}`);
console.log("permanent QLs 0");
