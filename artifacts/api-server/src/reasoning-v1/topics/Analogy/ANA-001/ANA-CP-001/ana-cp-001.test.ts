import assert from "node:assert/strict";
import { ANA_CP001_FACTS, ANA_CP001_QLS, factsForRule } from "./task-registry";
import { ANA_CP001_RELATIONS } from "./relation-definitions";
import { generateSemanticAnalogy } from "./generator";

assert.equal(ANA_CP001_QLS.length, 36);
assert.equal(new Set(ANA_CP001_QLS.map((ql) => ql.qlId)).size, 36);
assert.deepEqual(
  ANA_CP001_QLS.map((ql) => ql.qlId),
  Array.from({ length: 36 }, (_, index) => `ANA-QL-${String(index + 1).padStart(3, "0")}`),
);
assert.equal(ANA_CP001_RELATIONS.length, 18);
assert.equal(ANA_CP001_FACTS.length, 216);
assert.equal(new Set(ANA_CP001_FACTS.map((fact) => fact.id)).size, 216);

for (const relation of ANA_CP001_RELATIONS) {
  const facts = factsForRule(relation.id);
  assert.equal(facts.length, 12, `${relation.id} must have twelve curated facts`);
  assert.ok(facts.every((fact) => fact.predicate.length > 10));
  assert.ok(facts.every((fact) => fact.answerCategory === relation.answerCategory));
  assert.ok(facts.every((fact) => fact.sourceCategory === relation.sourceCategory));
  assert.ok(facts.every((fact) => fact.version === "2.0.0"));
}

const answerPositionCounts = [0, 0, 0, 0];
for (const ql of ANA_CP001_QLS) {
  for (let seed = 0; seed < 100; seed += 1) {
    const generated = generateSemanticAnalogy(ql.qlId, seed);
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => JSON.stringify(option.value).toLowerCase())).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.deepEqual(generated.options[generated.correctIndex].value,
      generated.presentationMode === "MISSING_FOURTH_TERM"
        ? generated.targetB
        : [generated.targetA, generated.targetB]);
    assert.ok(generated.explanationTrace.ruleStatement.length > 15);
    assert.ok(!generated.explanationTrace.ruleStatement.includes("SEM_"));
    assert.ok(generated.explanationTrace.sourceDemonstration[0].result.includes(generated.sourceA));
    assert.ok(generated.explanationTrace.targetApplication[0].result.includes(generated.targetA));
    assert.ok(generated.options.filter((option) => option.errorLabel !== null).every((option) => option.errorLabel));
    if (generated.presentationMode === "MISSING_FOURTH_TERM") {
      assert.ok(generated.options.every((option) => typeof option.value === "string"));
      assert.ok(!generated.options.some((option) => option.value === generated.targetA));
    } else {
      assert.ok(generated.options.every((option) => Array.isArray(option.value)));
    }
    answerPositionCounts[generated.correctIndex] += 1;
  }
}

const minPositionCount = Math.min(...answerPositionCounts);
const maxPositionCount = Math.max(...answerPositionCounts);
assert.ok(maxPositionCount / minPositionCount < 1.2, `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}`);

console.log("ANA-CP-001 exhaustive contract test passed.", { answerPositionCounts });
