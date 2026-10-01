import assert from "node:assert/strict";
import { NUM_CP005_PERMANENT_QL_IDS } from "./permanent/allocation";
import { runNumCp005PermanentPipeline } from "./permanent/runtime";

const SEEDS_PER_QL = 64;

function numericSignature(value: string): string {
  return (value.match(/\b\d+(?:\.\d+)?\b/gu) ?? []).join("|");
}

const perQl: any[] = [];

for (const qlId of NUM_CP005_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const numeric = new Set<string>();
  const explanations = new Set<string>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q: any = runNumCp005PermanentPipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });

    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((option: any) => option.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");
    assert.equal(q.verifierAnswer, q.canonicalAnswer, qlId + ": verifier drift");
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, qlId + ": explanation answer drift");
    assert.ok(q.explanation.stepByStep.length >= 2, qlId + ": explanation lost working steps");

    const lifecycle = q.lifecycle ?? q;
    assert.equal(Boolean(lifecycle.active), false, qlId + ": active gate opened");
    assert.equal(Boolean(lifecycle.questionStudioDiscoverable), false, qlId + ": Question Studio gate opened");
    assert.equal(Boolean(lifecycle.questionBankWritable), false, qlId + ": Question Bank gate opened");
    assert.equal(Boolean(lifecycle.testEligible), false, qlId + ": test gate opened");
    assert.equal(Boolean(lifecycle.publiclyPublishable), false, qlId + ": public gate opened");

    const explanation = [
      q.explanation.coreConcept,
      q.explanation.givenDataAndStrategy,
      ...q.explanation.stepByStep,
      q.explanation.examSpeedMethod,
      ...q.explanation.commonTraps,
      q.explanation.finalAnswer,
    ].join("\n");

    stems.add(String(q.stem));
    answers.add(String(q.canonicalAnswer));
    numeric.add(numericSignature(String(q.stem)));
    explanations.add(explanation);
    minExplanationLength = Math.min(minExplanationLength, explanation.length);
  }

  perQl.push({
    qlId,
    rawStemCount: stems.size,
    answerCount: answers.size,
    numericSignatureCount: numeric.size,
    explanationCount: explanations.size,
    minExplanationLength,
  });
}

for (const row of perQl) {
  const expectedStemBreadth = row.qlId === "NUM-QL-069" ? 15 : 16;
  const expectedExplanationBreadth = row.qlId === "NUM-QL-069" ? 15 : 16;
  assert.ok(row.rawStemCount >= expectedStemBreadth, row.qlId + ": final learner stem breadth below governed target");
  assert.ok(row.numericSignatureCount >= 8, row.qlId + ": numeric-state breadth below 8 over 64 seeds");
  assert.ok(row.explanationCount >= expectedExplanationBreadth, row.qlId + ": final explanation diversity below governed target");
  assert.ok(row.minExplanationLength >= 220, row.qlId + ": final explanation remains too thin");
}

const ql050 = perQl.find((row) => row.qlId === "NUM-QL-050");
assert.ok(ql050.answerCount >= 4, "NUM-QL-050: perfect-power divisor answer breadth remains below 4");

console.log(JSON.stringify({
  version: "NUM-CP-005-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  focus: {
    "NUM-QL-050": "Merged square/cube/fourth/fifth-power divisor-count authority must show real answer breadth over extended sampling.",
    "NUM-QL-069": "Bounded data-sufficiency authority has a deliberate 15-state governed learner-surface space; the audit requires the full finite breadth rather than an artificial sixteenth wording.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP005_SEMANTIC_REMEDIATION_AUDIT_V1");
