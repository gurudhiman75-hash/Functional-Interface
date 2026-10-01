import assert from "node:assert/strict";
import { NUM_CP010_PERMANENT_QL_IDS } from "./permanent-allocation";
import { generateNumCp010Permanent } from "./permanent-runtime";

const SEEDS_PER_QL = 64;

function numericSignature(value: string): string {
  return (value.match(/\b\d+(?:\.\d+)?\b/gu) ?? []).join("|");
}

const perQl: any[] = [];

for (const qlId of NUM_CP010_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  const explanations = new Set<string>();
  const numericSignatures = new Set<string>();
  const answerPositions = new Set<number>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q: any = generateNumCp010Permanent(qlId, seed);

    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((o: any) => o.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");
    assert.equal(q.verifierAnswer, q.canonicalAnswer, qlId + ": verifier drift");
    assert.ok(String(q.explanation.finalAnswer).includes(String(q.canonicalAnswer)), qlId + ": explanation answer drift");

    assert.equal(Boolean(q.lifecycle.active), false, qlId + ": active gate opened");
    assert.equal(Boolean(q.lifecycle.questionStudioDiscoverable), false, qlId + ": Question Studio gate opened");
    assert.equal(Boolean(q.lifecycle.questionBankWritable), false, qlId + ": Question Bank gate opened");
    assert.equal(Boolean(q.lifecycle.testEligible), false, qlId + ": test gate opened");
    assert.equal(Boolean(q.lifecycle.publiclyPublishable), false, qlId + ": public gate opened");

    const explanation = [
      q.explanation.coreConcept,
      q.explanation.strategy,
      ...q.explanation.steps,
      q.explanation.finalAnswer,
    ].join("\n");

    stems.add(String(q.stem));
    answers.add(String(q.canonicalAnswer));
    fingerprints.add(String(q.mathematicalFingerprint));
    explanations.add(explanation);
    numericSignatures.add(numericSignature(String(q.stem)));
    answerPositions.add(Number(q.correctIndex));
    minExplanationLength = Math.min(minExplanationLength, explanation.length);
  }

  perQl.push({
    qlId,
    stemCount: stems.size,
    answerCount: answers.size,
    answers: [...answers].sort(),
    fingerprintCount: fingerprints.size,
    explanationCount: explanations.size,
    numericSignatureCount: numericSignatures.size,
    answerPositionCount: answerPositions.size,
    minExplanationLength,
  });
}

for (const row of perQl) {
  assert.ok(row.stemCount >= 5, row.qlId + ": learner stem breadth below 5");
  assert.ok(row.fingerprintCount >= 16, row.qlId + ": mathematical-state breadth below 16");
  assert.ok(row.explanationCount >= 5, row.qlId + ": explanation diversity below 5");
  assert.ok(row.answerPositionCount >= 3, row.qlId + ": answer-position spread below 3");
  assert.ok(row.minExplanationLength >= 180, row.qlId + ": explanation remains too thin");
}

const ql198 = perQl.find((row) => row.qlId === "NUM-QL-198");
assert.ok(ql198.answerCount >= 6, "NUM-QL-198: missing-digit authority remains too narrow over extended sampling");

const ql204 = perQl.find((row) => row.qlId === "NUM-QL-204");
assert.ok(ql204.stemCount >= 8, "NUM-QL-204: consecutive-digit stem breadth remains below 8");
assert.ok(ql204.answerCount >= 8, "NUM-QL-204: consecutive-digit answer breadth remains below 8");
assert.ok(ql204.numericSignatureCount >= 6, "NUM-QL-204: consecutive-digit numeric-state breadth remains below 6");

const ql205 = perQl.find((row) => row.qlId === "NUM-QL-205");
assert.ok(ql205.answerCount >= 6, "NUM-QL-205: extremum answer breadth remains below 6");
assert.ok(ql205.numericSignatureCount >= 4, "NUM-QL-205: extremum numeric-state breadth remains below 4");

const ql209 = perQl.find((row) => row.qlId === "NUM-QL-209");
assert.equal(ql209.answerCount, 3, "NUM-QL-209: multiplicity authority must expose exactly no/one/many");

console.log(JSON.stringify({
  version: "NUM-CP-010-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  semanticNotes: {
    "NUM-QL-198": "Digit reconstruction should reach a broad range of missing digits over extended sampling.",
    "NUM-QL-204": "Merged increasing/decreasing consecutive-digit authority must show real stem, numeric-state and answer breadth.",
    "NUM-QL-205": "Least/greatest constrained numeral authority must vary both governed sum state and extremum answers.",
    "NUM-QL-209": "Protected three-class solution multiplicity authority: none, exactly one, more than one.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP010_SEMANTIC_REMEDIATION_AUDIT_V1");
