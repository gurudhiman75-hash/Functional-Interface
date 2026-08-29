import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { advancedStateFingerprint } from "./advanced-engine.ts";
import { assertIopAdvancedCaseletIntegrity, generateIopAdvancedCaselet } from "./advanced-generator.ts";
import { IOP_ADVANCED_PROTOTYPES } from "./advanced-prototypes.ts";
import type { IopAdvancedCheckpointId, IopAdvancedQueryKind } from "./advanced-types.ts";

const casesPerPrototype = Number(process.env.IOP_ADVANCED_CASES ?? 40);
const started = performance.now();
let generated = 0;
let childQuestions = 0;
let competingProgramExecutions = 0;
let rejectedAlternativeExecutions = 0;
const caseletIds = new Set<string>();
const visibleCaselets = new Set<string>();
const checkpointCounts = new Map<IopAdvancedCheckpointId, number>();
const answerPositions = new Map<IopAdvancedQueryKind, number[]>([
  ["STEP_OUTPUT", [0, 0, 0, 0]],
  ["ELEMENT_AT_POSITION", [0, 0, 0, 0]],
  ["STEP_NUMBER", [0, 0, 0, 0]],
  ["FINAL_OUTPUT", [0, 0, 0, 0]],
  ["PREVIOUS_STEP", [0, 0, 0, 0]],
  ["MISSING_STEP", [0, 0, 0, 0]],
  ["REMAINING_STEP_COUNT", [0, 0, 0, 0]],
]);

function actionError(message: string): never {
  console.error(`::error title=IOP advanced proof::${message.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A")}`);
  throw new Error(message);
}

assert.equal(IOP_ADVANCED_PROTOTYPES.length, 18, "Checkpoint B should begin with 18 temporary authorities");

for (const authority of IOP_ADVANCED_PROTOTYPES) {
  for (let index = 0; index < casesPerPrototype; index += 1) {
    const seed = `IOP-ADV-PROOF-${authority.prototypeId}-${String(index).padStart(4, "0")}`;
    try {
      const first = generateIopAdvancedCaselet(seed, authority.prototypeId);
      const replay = generateIopAdvancedCaselet(seed, authority.prototypeId);
      assert.deepEqual(first, replay, `${authority.prototypeId}/${seed} was not deterministic`);
      assertIopAdvancedCaseletIntegrity(first);

      generated += 1;
      childQuestions += first.children.length;
      competingProgramExecutions += first.identifiability.candidateProgramsTested;
      rejectedAlternativeExecutions += first.identifiability.candidateProgramsTested - 1;
      checkpointCounts.set(authority.checkpointId, (checkpointCounts.get(authority.checkpointId) ?? 0) + 1);

      if (caseletIds.has(first.caseletId)) actionError(`Duplicate caselet id at ${authority.prototypeId}/${seed}: ${first.caseletId}`);
      caseletIds.add(first.caseletId);
      const visible = [
        authority.prototypeId,
        first.demonstration.layout,
        advancedStateFingerprint(first.demonstration.input),
        first.demonstration.steps.map((step) => step.stateFingerprint).join("/"),
        advancedStateFingerprint(first.target.input),
      ].join("|");
      if (visibleCaselets.has(visible)) actionError(`Duplicate visible caselet at ${authority.prototypeId}/${seed}`);
      visibleCaselets.add(visible);

      for (const child of first.children) answerPositions.get(child.kind)![child.answerIndex] += 1;
    } catch (error) {
      const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      actionError(`Failed at ${authority.prototypeId}/${seed}: ${message}`);
    }
  }
}

for (const checkpoint of ["IOP-CP-005", "IOP-CP-006", "IOP-CP-007", "IOP-CP-008", "IOP-CP-009", "IOP-CP-010"] as const) {
  const actual = checkpointCounts.get(checkpoint);
  const expected = 3 * casesPerPrototype;
  if (actual !== expected) actionError(`Unexpected coverage for ${checkpoint}: ${actual ?? 0}/${expected}`);
}

for (const [kind, counts] of answerPositions) {
  if (!counts.every((count) => count > 0)) actionError(`${kind} did not reach all four answer positions: ${counts.join(",")}`);
}

console.log("PASS_IOP_001_CP005_CP010_ADVANCED_DISCOVERY");
console.log(`temporary prototype authorities ${IOP_ADVANCED_PROTOTYPES.length}`);
console.log(`deterministic caselets ${generated}`);
console.log(`child questions ${childQuestions}`);
console.log(`competing program executions audited ${competingProgramExecutions}`);
console.log(`non-matching alternatives rejected ${rejectedAlternativeExecutions}`);
console.log(`unique visible caselets ${visibleCaselets.size}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - started)}`);
console.log("permanent QLs 0");
