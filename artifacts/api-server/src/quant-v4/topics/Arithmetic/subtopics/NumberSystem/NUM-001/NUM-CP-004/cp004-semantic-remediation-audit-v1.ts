import assert from "node:assert/strict";
import { NUM_CP004_PERMANENT_QL_IDS } from "./permanent/allocation";
import { runNumCp004EditorialV2ReviewFinal } from "./permanent/editorial-v2-review-final";

const SEEDS_PER_QL = 64;

function numericSignature(value: string): string {
  return (value.match(/\b\d+(?:\.\d+)?\b/gu) ?? []).join("|");
}

const perQl: any[] = [];

for (const qlId of NUM_CP004_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const numeric = new Set<string>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q: any = runNumCp004EditorialV2ReviewFinal({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });

    assert.equal(q.editorialVersion, "NUM-CP-004-EDITORIAL-V2", qlId + ": editorial surface missing");
    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((option: any) => option.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");
    assert.equal(q.verifierAnswer, q.canonicalAnswer, qlId + ": verifier drift");
    assert.ok(q.explanation.solution.length >= 2 && q.explanation.solution.length <= 4, qlId + ": solution line count drift");
    assert.ok(q.explanation.solution[0]?.startsWith("Rule:"), qlId + ": explanation is not rule-first");

    const lifecycle = q.lifecycle ?? q;
    assert.equal(Boolean(lifecycle.active), false, qlId + ": active gate opened");
    assert.equal(Boolean(lifecycle.questionStudioDiscoverable), false, qlId + ": Question Studio gate opened");
    assert.equal(Boolean(lifecycle.questionBankWritable), false, qlId + ": Question Bank gate opened");
    assert.equal(Boolean(lifecycle.testEligible), false, qlId + ": test gate opened");
    assert.equal(Boolean(lifecycle.publiclyPublishable), false, qlId + ": public gate opened");

    const explanation = [
      q.explanation.concept,
      ...q.explanation.solution,
      q.explanation.finalAnswer,
    ].join("\n");

    stems.add(String(q.stem));
    answers.add(String(q.canonicalAnswer));
    numeric.add(numericSignature(String(q.stem)));
    minExplanationLength = Math.min(minExplanationLength, explanation.length);
  }

  perQl.push({
    qlId,
    rawStemCount: stems.size,
    answerCount: answers.size,
    numericSignatureCount: numeric.size,
    minExplanationLength,
  });
}

for (const row of perQl) {
  assert.ok(row.rawStemCount >= 4, row.qlId + ": learner stem breadth below 4");
  assert.ok(row.numericSignatureCount >= 4, row.qlId + ": numeric-state breadth below 4");
  assert.ok(row.minExplanationLength >= 160, row.qlId + ": final Editorial V2 explanation is too thin");
}

const ql026 = perQl.find((row) => row.qlId === "NUM-QL-026");
assert.equal(ql026.answerCount, 3, "NUM-QL-026: distinct-prime-factor count should span the designed 2/3/4 support sizes");

const ql027 = perQl.find((row) => row.qlId === "NUM-QL-027");
assert.ok(ql027.answerCount >= 4, "NUM-QL-027: multiplicity count answer breadth remains below 4");

const ql029 = perQl.find((row) => row.qlId === "NUM-QL-029");
assert.equal(ql029.answerCount, 3, "NUM-QL-029: comparison authority must reach A, B and EQUAL");

const ql031 = perQl.find((row) => row.qlId === "NUM-QL-031");
assert.equal(ql031.answerCount, 3, "NUM-QL-031: missing exponent should span the designed exponents 1/2/3");

const ql036 = perQl.find((row) => row.qlId === "NUM-QL-036");
assert.equal(ql036.answerCount, 3, "NUM-QL-036: co-prime classification must expose its three valid classes");

console.log(JSON.stringify({
  version: "NUM-CP-004-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  semanticNotes: {
    "NUM-QL-026": "Three designed distinct-factor support sizes: 2, 3 and 4.",
    "NUM-QL-029": "Three comparison classes: A, B and EQUAL.",
    "NUM-QL-031": "Three designed missing-exponent values: 1, 2 and 3.",
    "NUM-QL-036": "Three mathematically valid co-prime classification classes.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP004_SEMANTIC_REMEDIATION_AUDIT_V1");
