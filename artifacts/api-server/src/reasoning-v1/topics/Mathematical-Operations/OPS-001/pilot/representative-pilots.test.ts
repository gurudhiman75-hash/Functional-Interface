import assert from "node:assert/strict";
import {
  OPS_REPRESENTATIVE_PILOT_IDS,
  generateOpsRepresentativePilot,
} from "./representative-pilots";

assert.equal(OPS_REPRESENTATIVE_PILOT_IDS.length, 12);
assert.equal(new Set(OPS_REPRESENTATIVE_PILOT_IDS).size, 12);
assert.ok(OPS_REPRESENTATIVE_PILOT_IDS.every((id) => id.startsWith("OPS-CAND-")));
assert.ok(OPS_REPRESENTATIVE_PILOT_IDS.every((id) => !id.startsWith("OPS-QL-")));

const answerPositions = [0, 0, 0, 0];
const generatedCounts = new Map<string, number>();
const solverRoutes = new Set<string>();
const solveModes = new Set<string>();
const checkpoints = new Set<string>();

for (const candidateId of OPS_REPRESENTATIVE_PILOT_IDS) {
  for (let seed = 0; seed < 200; seed += 1) {
    const first = generateOpsRepresentativePilot(candidateId, seed);
    const second = generateOpsRepresentativePilot(candidateId, seed);
    assert.deepEqual(first, second, `${candidateId} seed ${seed} must be deterministic`);
    assert.equal(first.candidateId, candidateId);
    assert.equal(first.seed, seed);
    assert.equal(first.locale, "en-IN");
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
    assert.ok(first.explanation.conclusion.includes(first.answer) || first.explanation.conclusion.length > 30);
    assert.ok(!first.stem.includes("OPS-CAND"));
    assert.ok(!first.explanation.ruleStatement.includes("OPS-CAND"));
    assert.ok(!first.explanation.conclusion.includes("OPS-CAND"));
    answerPositions[first.correctIndex] += 1;
    generatedCounts.set(candidateId, (generatedCounts.get(candidateId) ?? 0) + 1);
    solverRoutes.add(first.proof.solverRoute);
    solveModes.add(first.solveMode);
    checkpoints.add(first.checkpointId);
  }
}

assert.deepEqual([...generatedCounts.values()], Array.from({ length: 12 }, () => 200));
assert.equal(solveModes.size, 12);
assert.ok(solverRoutes.size >= 10);
assert.deepEqual([...checkpoints].sort(), ["OPS-CP-001", "OPS-CP-004", "OPS-CP-005", "OPS-CP-006", "OPS-CP-007", "OPS-CP-008", "OPS-CP-009"]);

const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(minPosition > 0);
assert.ok(maxPosition / minPosition < 1.2, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log("OPS-001 representative pilot stress test passed.", {
  candidates: OPS_REPRESENTATIVE_PILOT_IDS.length,
  instances: OPS_REPRESENTATIVE_PILOT_IDS.length * 200,
  answerPositions,
  solverRoutes: solverRoutes.size,
});
