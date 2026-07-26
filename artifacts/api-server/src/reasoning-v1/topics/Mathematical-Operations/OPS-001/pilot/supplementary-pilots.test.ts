import assert from "node:assert/strict";
import { formatExact, solveWithMapping, type OperatorMapping } from "../foundation";
import {
  OPS_SUPPLEMENTARY_PILOT_IDS,
  generateOpsSupplementaryPilot,
} from "./supplementary-pilots";

assert.equal(OPS_SUPPLEMENTARY_PILOT_IDS.length, 12);
assert.equal(new Set(OPS_SUPPLEMENTARY_PILOT_IDS).size, 12);

const answerPositions = [0, 0, 0, 0];
const checkpoints = new Set<string>();
const solveModes = new Set<string>();
const solverRoutes = new Set<string>();
let generatedCount = 0;

for (const candidateId of OPS_SUPPLEMENTARY_PILOT_IDS) {
  for (let seed = 0; seed < 150; seed += 1) {
    const first = generateOpsSupplementaryPilot(candidateId, seed);
    const second = generateOpsSupplementaryPilot(candidateId, seed);
    assert.deepEqual(first, second, `${candidateId} seed ${seed} must be deterministic`);
    assert.equal(first.candidateId, candidateId);
    assert.equal(first.seed, seed);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
    assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(first.options[first.correctIndex].value, first.answer);
    assert.equal(first.options[first.correctIndex].errorLabel, null);
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

assert.equal(generatedCount, 1_800);
assert.equal(solveModes.size, 12);
assert.ok(solverRoutes.size >= 10);
assert.deepEqual([...checkpoints].sort(), ["OPS-CP-001", "OPS-CP-002", "OPS-CP-003", "OPS-CP-004", "OPS-CP-005"]);
const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(minPosition > 0);
assert.ok(maxPosition / minPosition < 1.2, `Supplementary answer positions are imbalanced: ${answerPositions.join(", ")}`);

const hindiMapping: OperatorMapping = {
  entries: [
    { displayToken: "गुणा", semanticOperator: "MULTIPLY" },
    { displayToken: "जोड़", semanticOperator: "ADD" },
  ],
  preserveUnmappedStandardOperators: true,
};
const punjabiMapping: OperatorMapping = {
  entries: [
    { displayToken: "ਗੁਣਾ", semanticOperator: "MULTIPLY" },
    { displayToken: "ਜੋੜ", semanticOperator: "ADD" },
  ],
  preserveUnmappedStandardOperators: true,
};
const hindiSolved = solveWithMapping("4 गुणा 3 जोड़ 2", hindiMapping);
const punjabiSolved = solveWithMapping("4 ਗੁਣਾ 3 ਜੋੜ 2", punjabiMapping);
assert.equal(hindiSolved.evaluation.parsed.kind, "ARITHMETIC");
assert.equal(punjabiSolved.evaluation.parsed.kind, "ARITHMETIC");
assert.equal(formatExact(hindiSolved.evaluation.arithmeticValue!), "14");
assert.equal(formatExact(punjabiSolved.evaluation.arithmeticValue!), "14");

const wordTokenPilot = generateOpsSupplementaryPilot("OPS-CAND-005", 0);
assert.equal(wordTokenPilot.localeMode, "LANGUAGE_ADAPTED");
assert.match(wordTokenPilot.stem, /word operator/);

const missingArithmetic = generateOpsSupplementaryPilot("OPS-CAND-002", 0);
const directArbitraryMissing = generateOpsSupplementaryPilot("OPS-CAND-006", 0);
assert.equal(missingArithmetic.metadata.mergeProbeWith, "OPS-CAND-001");
assert.equal(directArbitraryMissing.metadata.mergeProbeWith, "OPS-CAND-004");

const doubleRepair = generateOpsSupplementaryPilot("OPS-CAND-017", 0);
assert.equal(doubleRepair.metadata.simplerSinglePairSurvivors, 0);
assert.equal(doubleRepair.metadata.doublePairSurvivors, 1);

console.log("OPS-001 supplementary pilot stress test passed.", {
  candidates: OPS_SUPPLEMENTARY_PILOT_IDS.length,
  instances: generatedCount,
  answerPositions,
  solverRoutes: solverRoutes.size,
  unicodeWordTokens: ["hi-IN", "pa-IN"],
});
