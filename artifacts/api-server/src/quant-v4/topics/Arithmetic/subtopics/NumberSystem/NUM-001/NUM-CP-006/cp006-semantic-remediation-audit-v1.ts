import assert from "node:assert/strict";
import { NUM_CP006_PERMANENT_QL_IDS } from "./permanent/allocation";
import { runNumCp006PermanentPipeline } from "./permanent/runtime";

const SEEDS_PER_QL = 64;

function numericSignature(value: string): string {
  return (value.match(/\b\d+(?:\.\d+)?\b/gu) ?? []).join("|");
}

const perQl: any[] = [];

for (const qlId of NUM_CP006_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const numeric = new Set<string>();
  const explanations = new Set<string>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q: any = runNumCp006PermanentPipeline({
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
  assert.ok(row.rawStemCount >= 16, row.qlId + ": learner stem breadth below 16 over 64 seeds");
  assert.ok(row.numericSignatureCount >= 8 || row.qlId === "NUM-QL-093", row.qlId + ": numeric-state breadth below governed target");
  assert.ok(row.explanationCount >= 16, row.qlId + ": explanation diversity below 16");
  assert.ok(row.minExplanationLength >= 180, row.qlId + ": explanation remains too thin");
}

const ql079 = perQl.find((row) => row.qlId === "NUM-QL-079");
assert.equal(ql079.answerCount, 3, "NUM-QL-079: unordered factor-pair authority must span exactly 2/4/8");

const ql093 = perQl.find((row) => row.qlId === "NUM-QL-093");
assert.equal(ql093.answerCount, 2, "NUM-QL-093: truth-value authority must remain Boolean");

const ql096 = perQl.find((row) => row.qlId === "NUM-QL-096");
assert.equal(ql096.answerCount, 4, "NUM-QL-096: data-sufficiency authority must span all four classes");

console.log(JSON.stringify({
  version: "NUM-CP-006-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  semanticNotes: {
    "NUM-QL-079": "Three legitimate unordered-pair counts from 2, 3 or 4 distinct prime-power blocks: 2, 4 and 8.",
    "NUM-QL-093": "Intrinsic Boolean claim-verification authority: True or False.",
    "NUM-QL-096": "Four standard data-sufficiency outcomes must all remain reachable.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP006_SEMANTIC_REMEDIATION_AUDIT_V1");
