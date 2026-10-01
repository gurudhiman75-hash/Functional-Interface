import assert from "node:assert/strict";
import { NUM_CP009_PERMANENT_QL_IDS } from "./permanent-allocation";
import { generateNumCp009Permanent } from "./permanent-runtime";

const SEEDS_PER_QL = 64;
const perQl: any[] = [];

for (const qlId of NUM_CP009_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  const explanations = new Set<string>();
  const answerPositions = new Set<number>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q: any = generateNumCp009Permanent(qlId, seed);

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
    answerPositionCount: answerPositions.size,
    minExplanationLength,
  });
}

for (const row of perQl) {
  assert.ok(row.stemCount >= 8, row.qlId + ": learner stem breadth below 8");
  assert.ok(row.fingerprintCount >= 16, row.qlId + ": mathematical-state breadth below 16");
  assert.ok(row.explanationCount >= 8, row.qlId + ": explanation diversity below 8");
  assert.ok(row.answerPositionCount >= 3, row.qlId + ": answer-position spread below 3");
  assert.ok(row.minExplanationLength >= 180, row.qlId + ": explanation remains too thin");
}

const ql188 = perQl.find((row) => row.qlId === "NUM-QL-188");
assert.deepEqual(ql188.answers, ["1", "2", "4"], "NUM-QL-188: cycle-length authority must span exactly 1/2/4");

console.log(JSON.stringify({
  version: "NUM-CP-009-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  semanticNotes: {
    "NUM-QL-188": "Decimal unit-digit cycles have only three legitimate lengths: 1, 2 and 4.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP009_SEMANTIC_REMEDIATION_AUDIT_V1");
