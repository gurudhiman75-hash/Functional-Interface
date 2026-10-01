import assert from "node:assert/strict";
import { NUM_CP007_PERMANENT_QL_IDS } from "./permanent/allocation";
import { runNumCp007PermanentPipeline } from "./permanent/runtime";

const SEEDS_PER_QL = 64;
const perQl: any[] = [];

for (const qlId of NUM_CP007_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const optionSurfaces = new Set<string>();
  const fingerprints = new Set<string>();
  const explanations = new Set<string>();
  const answerPositions = new Set<number>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q: any = runNumCp007PermanentPipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });

    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((option: any) => option.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");
    assert.equal(q.verifierAnswer, q.canonicalAnswer, qlId + ": verifier drift");

    const lifecycle = q.lifecycle ?? q;
    assert.equal(Boolean(lifecycle.active), false, qlId + ": active gate opened");
    assert.equal(Boolean(lifecycle.questionStudioDiscoverable), false, qlId + ": Question Studio gate opened");
    assert.equal(Boolean(lifecycle.questionBankWritable), false, qlId + ": Question Bank gate opened");
    assert.equal(Boolean(lifecycle.testEligible), false, qlId + ": test gate opened");
    assert.equal(Boolean(lifecycle.publiclyPublishable), false, qlId + ": public gate opened");

    const explanation = JSON.stringify(q.explanation);
    stems.add(String(q.stem));
    optionSurfaces.add(q.options.map((option: any) => option.value).join(" | "));
    fingerprints.add(String(q.mathematicalFingerprint));
    explanations.add(explanation);
    answerPositions.add(Number(q.correctIndex));
    minExplanationLength = Math.min(minExplanationLength, explanation.length);
  }

  perQl.push({
    qlId,
    rawStemCount: stems.size,
    optionSurfaceCount: optionSurfaces.size,
    fingerprintCount: fingerprints.size,
    explanationCount: explanations.size,
    answerPositionCount: answerPositions.size,
    minExplanationLength,
  });
}

for (const row of perQl) {
  if (row.qlId !== "NUM-QL-102") {
    assert.ok(row.rawStemCount >= 8, row.qlId + ": learner stem breadth below 8");
  }
  assert.ok(row.optionSurfaceCount >= 16, row.qlId + ": option/state surface breadth below 16");
  assert.ok(row.fingerprintCount >= 16, row.qlId + ": mathematical-state breadth below 16");
  assert.ok(row.explanationCount >= 16, row.qlId + ": explanation diversity below 16");
  assert.ok(row.answerPositionCount >= 3, row.qlId + ": answer-position spread below 3");
  assert.ok(row.minExplanationLength >= 160, row.qlId + ": explanation remains too thin");
}

const ql102 = perQl.find((row) => row.qlId === "NUM-QL-102");
assert.equal(ql102.rawStemCount, 1, "NUM-QL-102: fixed validity-classification stem unexpectedly changed");
assert.ok(ql102.optionSurfaceCount >= 32, "NUM-QL-102: fixed stem lacks option-state breadth");
assert.ok(ql102.fingerprintCount >= 32, "NUM-QL-102: fixed stem lacks mathematical-state breadth");
assert.ok(ql102.explanationCount >= 32, "NUM-QL-102: fixed stem lacks explanation-state breadth");

console.log(JSON.stringify({
  version: "NUM-CP-007-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  semanticNotes: {
    "NUM-QL-102": "Intentional fixed validity-classification stem; learner diversity is carried by division states, option sets, fingerprints and explanations.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP007_SEMANTIC_REMEDIATION_AUDIT_V1");
