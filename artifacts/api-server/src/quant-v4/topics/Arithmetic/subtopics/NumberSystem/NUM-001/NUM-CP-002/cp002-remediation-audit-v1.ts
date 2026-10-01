import assert from "node:assert/strict";
import { NUM_CP002_PERMANENT_QL_IDS } from "./permanent/allocation";
import { runNumCp002PermanentPipeline } from "./permanent/runtime";

const SEEDS_PER_QL = 12;

function numericSignature(text: string): string {
  return (text.match(/\\frac\{\d+\}\{\d+\}|\b\d+(?:\.\d+)?\b/gu) ?? [])
    .map((token) => token.replace(/\s+/gu, ""))
    .join("|");
}

const perQl: any[] = [];

for (const qlId of NUM_CP002_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const numeric = new Set<string>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q = runNumCp002PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" });
    assert.equal(q.lifecycle.active, false, qlId + ": active gate opened");
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, qlId + ": Question Studio gate opened");
    assert.equal(q.lifecycle.questionBankWritable, false, qlId + ": Question Bank gate opened");
    assert.equal(q.lifecycle.testEligible, false, qlId + ": test gate opened");
    assert.equal(q.lifecycle.publiclyPublishable, false, qlId + ": public gate opened");
    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");
    assert.equal(q.verifierAnswer, q.canonicalAnswer, qlId + ": verifier drift");

    const explanation = [q.explanation.concept ?? "", ...q.explanation.solution, q.explanation.finalAnswer].join("\n");
    stems.add(q.stem);
    answers.add(q.canonicalAnswer);
    numeric.add(numericSignature(q.stem));
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
  assert.ok(row.minExplanationLength >= 120, row.qlId + ": explanation remains below remediation depth target");
}

const ql163 = perQl.find((row) => row.qlId === "NUM-QL-163");
assert.ok(ql163.rawStemCount >= 4, "NUM-QL-163: learner stem breadth remains below 4");
assert.ok(ql163.numericSignatureCount >= 4, "NUM-QL-163: inverse numeric-state breadth remains below 4");
assert.ok(ql163.answerCount >= 4, "NUM-QL-163: inverse answer breadth remains below 4");

const ql151 = perQl.find((row) => row.qlId === "NUM-QL-151");
assert.equal(ql151.answerCount, 2, "NUM-QL-151: exact comparison should retain its two relation classes");

const ql154 = perQl.find((row) => row.qlId === "NUM-QL-154");
assert.equal(ql154.answerCount, 2, "NUM-QL-154: termination classification should retain two answer classes");

console.log(JSON.stringify({
  version: "NUM-CP-002-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  perQl,
}, null, 2));
console.log("PASS_NUM_CP002_REMEDIATION_AUDIT_V1");
