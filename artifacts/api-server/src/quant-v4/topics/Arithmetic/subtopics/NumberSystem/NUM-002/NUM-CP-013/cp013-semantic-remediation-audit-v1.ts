import assert from "node:assert/strict";
import { NUM_CP013_PERMANENT_QL_IDS } from "./permanent-allocation";
import { generateNumCp013Permanent } from "./permanent-runtime";

const SEEDS_PER_QL = 64;
const perQl: any[] = [];

for (const qlId of NUM_CP013_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  const explanations = new Set<string>();
  const optionSurfaces = new Set<string>();
  const answerPositions = new Set<number>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q: any = generateNumCp013Permanent(qlId, seed);

    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((o: any) => o.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");
    assert.equal(q.verifierAnswer, q.canonicalAnswer, qlId + ": verifier drift");
    assert.ok(String(q.explanation.finalAnswer).includes(String(q.canonicalAnswer)), qlId + ": explanation answer drift");

    assert.equal(Boolean(q.lifecycle.active), false, qlId + ": active gate opened");
    assert.equal(Boolean(q.lifecycle.questionStudioDiscoverable), false, qlId + ": Question Studio gate opened");
    assert.equal(Boolean(q.lifecycle.questionBankWritable), false, qlId + ": Question Bank gate opened");
    assert.equal(Boolean(q.lifecycle.testEligible), false, qlId + ": test gate opened");
    assert.equal(Boolean(q.lifecycle.mockTestEligible), false, qlId + ": mock-test gate opened");
    assert.equal(Boolean(q.lifecycle.publiclyPublishable), false, qlId + ": public gate opened");
    assert.equal(Boolean(q.lifecycle.automaticStudentPublication), false, qlId + ": automatic publication gate opened");

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
    optionSurfaces.add(q.options.map((o: any) => o.value).join(" | "));
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
    optionSurfaceCount: optionSurfaces.size,
    answerPositionCount: answerPositions.size,
    minExplanationLength,
  });
}

for (const row of perQl) {
  assert.ok(row.stemCount >= 8, row.qlId + ": learner stem breadth below 8");
  assert.ok(row.fingerprintCount >= 16, row.qlId + ": mathematical-state breadth below 16");
  assert.ok(row.explanationCount >= 8, row.qlId + ": explanation diversity below 8");
  assert.ok(row.optionSurfaceCount >= 16, row.qlId + ": option-state breadth below 16");
  assert.ok(row.answerPositionCount === 4, row.qlId + ": permanent option normalization must exercise all four answer positions");
  assert.ok(row.minExplanationLength >= 220, row.qlId + ": explanation remains too thin");
}

const ql245 = perQl.find((row) => row.qlId === "NUM-QL-245");
assert.deepEqual(
  ql245.answers,
  ["=", ">", "<"].sort(),
  "NUM-QL-245: cross-base comparison must expose exactly <, = and >",
);

console.log(JSON.stringify({
  version: "NUM-CP-013-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  semanticNotes: {
    "NUM-QL-245": "Cross-base comparison is intrinsically a three-relation authority: less than, equal to, or greater than.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP013_SEMANTIC_REMEDIATION_AUDIT_V1");
