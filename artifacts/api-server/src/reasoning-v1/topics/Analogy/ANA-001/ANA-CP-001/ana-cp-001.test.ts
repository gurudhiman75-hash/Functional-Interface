import assert from "node:assert/strict";
import { ANA_CP001_FACTS, ANA_CP001_QLS, factsForRule } from "./task-registry";
import { generateSemanticAnalogy } from "./generator";

assert.equal(ANA_CP001_QLS.length, 36);
assert.equal(new Set(ANA_CP001_QLS.map((ql) => ql.qlId)).size, 36);
assert.deepEqual(
  ANA_CP001_QLS.map((ql) => ql.qlId),
  Array.from({ length: 36 }, (_, index) => `ANA-QL-${String(index + 1).padStart(3, "0")}`),
);
assert.equal(ANA_CP001_FACTS.length, 72);
assert.equal(new Set(ANA_CP001_FACTS.map((fact) => fact.id)).size, 72);

for (const ql of ANA_CP001_QLS) {
  assert.equal(factsForRule(ql.ruleId).length, 4, `${ql.ruleId} must have four curated facts`);
  const generated = generateSemanticAnalogy(ql.qlId, Number(ql.qlId.slice(-3)));
  assert.equal(generated.options.length, 4);
  assert.equal(new Set(generated.options.map((option) => String(option.value).toLowerCase())).size, 4);
  assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
  assert.equal(generated.options[generated.correctIndex].value, generated.targetB);
  assert.ok(generated.explanationTrace.sourceDemonstration.length > 0);
  assert.ok(generated.explanationTrace.targetApplication.length > 0);
}

console.log("ANA-CP-001 contract test passed.");
