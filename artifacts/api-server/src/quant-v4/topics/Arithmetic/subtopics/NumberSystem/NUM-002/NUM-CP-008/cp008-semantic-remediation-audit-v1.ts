import assert from "node:assert/strict";
import { NUM_CP008_PERMANENT_ALLOCATION } from "./permanent-allocation";
import { generateNumCp008Permanent } from "./permanent-runtime";

const SEEDS_PER_QL = 64;
const perQl: any[] = [];

for (const allocation of NUM_CP008_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId;
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  const explanations = new Set<string>();
  const answerPositions = new Set<number>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q: any = generateNumCp008Permanent(qlId as any, seed);
    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((o: any) => o.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");
    assert.equal(q.verifierAnswer, q.canonicalAnswer, qlId + ": verifier drift");
    assert.equal(Boolean(q.lifecycle.active), false, qlId + ": active gate opened");
    assert.equal(Boolean(q.lifecycle.questionStudioDiscoverable), false, qlId + ": Question Studio gate opened");
    assert.equal(Boolean(q.lifecycle.questionBankWritable), false, qlId + ": Question Bank gate opened");
    assert.equal(Boolean(q.lifecycle.testEligible), false, qlId + ": test gate opened");
    assert.equal(Boolean(q.lifecycle.publiclyPublishable), false, qlId + ": public gate opened");

    const explanation = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps, q.explanation.finalAnswer].join("\n");
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
  assert.ok(row.minExplanationLength >= 220, row.qlId + ": explanation remains too thin");
}

assert.equal(perQl.find(r => r.qlId === "NUM-QL-169").answerCount, 1,
  "NUM-QL-169: unsolvable linear-congruence classification must remain a single impossibility class");
assert.equal(perQl.find(r => r.qlId === "NUM-QL-171").answerCount, 1,
  "NUM-QL-171: incompatible simultaneous-system classification must remain a single impossibility class");
assert.ok(perQl.find(r => r.qlId === "NUM-QL-173").answerCount >= 4,
  "NUM-QL-173: bounded solution-count authority lacks numeric answer breadth");
assert.equal(perQl.find(r => r.qlId === "NUM-QL-184").answerCount, 3,
  "NUM-QL-184: multiplicity classification must expose no/one/many");

console.log(JSON.stringify({
  version: "NUM-CP-008-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  semanticNotes: {
    "NUM-QL-169": "Single no-solution classification authority.",
    "NUM-QL-171": "Single incompatible-system classification authority.",
    "NUM-QL-173": "Numeric bounded solution-count authority; requires broader answer spread.",
    "NUM-QL-184": "Three protected multiplicity classes: no solution, one solution, multiple solutions.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP008_SEMANTIC_REMEDIATION_AUDIT_V1");
