import assert from "node:assert/strict";
import { ANA_CP002_FACTS, ANA_CP002_QLS, lexicalFactsForRule } from "./task-registry";
import { ANA_CP002_RELATIONS } from "./relation-definitions";
import { generateLexicalAnalogy } from "./generator";

assert.equal(ANA_CP002_QLS.length, 24);
assert.deepEqual(
  ANA_CP002_QLS.map((ql) => ql.qlId),
  Array.from({ length: 24 }, (_, index) => `ANA-QL-${String(index + 37).padStart(3, "0")}`),
);
assert.equal(new Set(ANA_CP002_QLS.map((ql) => ql.qlId)).size, 24);
assert.equal(ANA_CP002_RELATIONS.length, 12);
assert.equal(ANA_CP002_FACTS.length, 144);
assert.equal(new Set(ANA_CP002_FACTS.map((fact) => fact.id)).size, 144);

for (const relation of ANA_CP002_RELATIONS) {
  const facts = lexicalFactsForRule(relation.id);
  assert.equal(facts.length, 12, `${relation.id} must have twelve curated facts`);
  assert.equal(new Set(facts.map((fact) => fact.left.toLocaleLowerCase("en-IN"))).size, 12);
  for (const fact of facts) {
    assert.ok(fact.predicate.length > 10);
    assert.equal(fact.version, "1.0.0");
    assert.equal(fact.status, "CURATED");
  }
}

const positionCounts = [0, 0, 0, 0];
for (const ql of ANA_CP002_QLS) {
  for (let seed = 0; seed < 100; seed += 1) {
    const generated = generateLexicalAnalogy(ql.qlId, seed);
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => JSON.stringify(option.value).toLocaleLowerCase("en-IN"))).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(generated.options[generated.correctIndex].errorLabel, null);
    assert.ok(!generated.explanationTrace.ruleStatement.includes("LEX_"));
    assert.ok(!generated.explanationTrace.conclusion.includes("LEX_"));
    positionCounts[generated.correctIndex] += 1;
    if (generated.presentationMode === "MISSING_FOURTH_TERM") {
      assert.equal(generated.options[generated.correctIndex].value, generated.targetB);
      assert.ok(!generated.options.some((option) => option.value === generated.targetA));
    } else {
      assert.deepEqual(generated.options[generated.correctIndex].value, [generated.targetA, generated.targetB]);
    }
  }
}

const minPosition = Math.min(...positionCounts);
const maxPosition = Math.max(...positionCounts);
assert.ok(minPosition > 0);
assert.ok(maxPosition / minPosition < 1.2, `Answer positions are imbalanced: ${positionCounts.join(", ")}`);

console.log("ANA-CP-002 lexical contract test passed.", { positionCounts });
