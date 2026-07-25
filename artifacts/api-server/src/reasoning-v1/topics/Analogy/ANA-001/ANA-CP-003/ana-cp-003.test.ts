import assert from "node:assert/strict";
import { ANA_CP003_QLS } from "./question-language.en";
import { ANA_CP003_RULES } from "./rule-definitions";
import { generateNumericAnalogy } from "./generator";
import { matchingNumericRules, verifyNumericTransfer } from "./independent-solver";

assert.equal(ANA_CP003_QLS.length, 48);
assert.equal(new Set(ANA_CP003_QLS.map((ql) => ql.qlId)).size, 48);
assert.deepEqual(
  ANA_CP003_QLS.map((ql) => ql.qlId),
  Array.from({ length: 48 }, (_, index) => `ANA-QL-${String(61 + index).padStart(3, "0")}`),
);
assert.equal(ANA_CP003_RULES.length, 24);
assert.equal(new Set(ANA_CP003_RULES.map((rule) => rule.id)).size, 24);

const answerPositions = [0, 0, 0, 0];
let generatedCount = 0;
for (const ql of ANA_CP003_QLS) {
  for (let seed = 0; seed < 50; seed += 1) {
    const first = generateNumericAnalogy(ql.qlId, seed);
    const second = generateNumericAnalogy(ql.qlId, seed);
    assert.deepEqual(first, second, `${ql.qlId}/${seed} must be deterministic`);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => JSON.stringify(option.value))).size, 4);
    assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.ok(verifyNumericTransfer(first.ruleId, first.context,
      { input: first.sourceA, output: first.sourceB },
      { input: first.targetA, output: first.targetB }));
    const matches = matchingNumericRules([
      { input: first.sourceA, output: first.sourceB },
      { input: first.targetA, output: first.targetB },
    ]);
    assert.ok(matches.some((match) => match.ruleId === first.ruleId));
    assert.ok(Number.isInteger(first.targetB) && first.targetB > 0 && first.targetB <= 2000);
    assert.ok(first.explanation.ruleStatement.length > 15);
    assert.ok(first.explanation.sourceDemonstration.includes(String(first.sourceA)));
    assert.ok(first.explanation.targetApplication.includes(String(first.targetA)));
    if (first.presentationMode === "MISSING_FOURTH_TERM") {
      assert.equal(first.options[first.correctIndex].value, first.targetB);
    } else {
      assert.deepEqual(first.options[first.correctIndex].value, [first.targetA, first.targetB]);
    }
    answerPositions[first.correctIndex] += 1;
    generatedCount += 1;
  }
}

const minimum = Math.min(...answerPositions);
const maximum = Math.max(...answerPositions);
assert.ok(minimum > 0);
assert.ok(maximum / minimum < 1.35, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log("ANA-CP-003 exhaustive contract test passed.", { generatedCount, answerPositions });
