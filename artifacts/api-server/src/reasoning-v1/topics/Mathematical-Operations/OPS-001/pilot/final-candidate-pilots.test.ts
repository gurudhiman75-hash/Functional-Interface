import assert from "node:assert/strict";
import {
  OPS_FINAL_CANDIDATE_PILOT_IDS,
  generateOpsFinalCandidatePilot,
} from "./final-candidate-pilots";
import { OPS_REPRESENTATIVE_PILOT_IDS } from "./representative-pilots";
import { OPS_SUPPLEMENTARY_PILOT_IDS } from "./supplementary-pilots";

assert.equal(OPS_FINAL_CANDIDATE_PILOT_IDS.length, 10);
assert.equal(new Set(OPS_FINAL_CANDIDATE_PILOT_IDS).size, 10);

const answerPositions = [0, 0, 0, 0];
const checkpoints = new Set<string>();
const solveModes = new Set<string>();
const solverRoutes = new Set<string>();
let generatedCount = 0;

for (const candidateId of OPS_FINAL_CANDIDATE_PILOT_IDS) {
  for (let seed = 0; seed < 150; seed += 1) {
    const first = generateOpsFinalCandidatePilot(candidateId, seed);
    const second = generateOpsFinalCandidatePilot(candidateId, seed);
    assert.deepEqual(first, second, `${candidateId} seed ${seed} must be deterministic`);
    assert.equal(first.candidateId, candidateId);
    assert.equal(first.seed, seed);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
    assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(first.options[first.correctIndex].errorLabel, null);
    assert.equal(first.options[first.correctIndex].value, first.answer);
    assert.ok(first.options.filter((option) => option.errorLabel !== null).every((option) => Boolean(option.errorLabel)));
    assert.equal(first.proof.unique, true);
    assert.equal(first.proof.survivingCandidateCount, 1);
    assert.ok(first.proof.eligibleCandidateCount >= 1);
    assert.ok(first.proof.semanticFingerprint.length > 3);
    assert.ok(first.explanation.ruleStatement.length > 20);
    assert.ok(first.explanation.steps.length >= 1);
    assert.ok(!first.stem.includes("OPS-CAND"));
    answerPositions[first.correctIndex] += 1;
    checkpoints.add(first.checkpointId);
    solveModes.add(first.solveMode);
    solverRoutes.add(first.proof.solverRoute);
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 1_500);
assert.equal(solveModes.size, 10);
assert.ok(solverRoutes.size >= 9);
assert.deepEqual([...checkpoints].sort(), ["OPS-CP-006", "OPS-CP-007", "OPS-CP-008", "OPS-CP-009"]);
const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(minPosition > 0);
assert.ok(maxPosition / minPosition < 1.2, `Final candidate answer positions are imbalanced: ${answerPositions.join(", ")}`);

const allCandidateIds = [
  ...OPS_REPRESENTATIVE_PILOT_IDS,
  ...OPS_SUPPLEMENTARY_PILOT_IDS,
  ...OPS_FINAL_CANDIDATE_PILOT_IDS,
].sort();
const expectedCandidateIds = Array.from({ length: 34 }, (_, index) => `OPS-CAND-${String(index + 1).padStart(3, "0")}`);
assert.equal(allCandidateIds.length, 34);
assert.equal(new Set(allCandidateIds).size, 34);
assert.deepEqual(allCandidateIds, expectedCandidateIds);

const operatorDigit = generateOpsFinalCandidatePilot("OPS-CAND-027", 0);
assert.equal(operatorDigit.metadata.completePoolRepairCount, 1);
assert.equal(operatorDigit.metadata.leadingZeroPolicy, "REJECT");

const hiddenMissing = generateOpsFinalCandidatePilot("OPS-CAND-031", 0);
assert.equal(hiddenMissing.metadata.mergeProbeWith, "OPS-CAND-030");

const mappingMeaning = generateOpsFinalCandidatePilot("OPS-CAND-033", 0);
assert.equal(mappingMeaning.answer, "−");
assert.equal(mappingMeaning.metadata.recoveredMeaning, "SUBTRACT");

console.log("OPS-001 final candidate pilot stress test passed.", {
  candidates: OPS_FINAL_CANDIDATE_PILOT_IDS.length,
  instances: generatedCount,
  totalCandidateCoverage: allCandidateIds.length,
  answerPositions,
  solverRoutes: solverRoutes.size,
});
