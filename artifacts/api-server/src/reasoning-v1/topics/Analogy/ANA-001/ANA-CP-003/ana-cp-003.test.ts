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
assert.ok(ANA_CP003_QLS.every((ql) => ql.difficultyBand === "INSTANCE_DERIVED"));

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const fallbackByRule = new Map<string, number>();
let generatedCount = 0;
let multiReferenceCount = 0;
let misconceptionDistractorCount = 0;
let fallbackDistractorCount = 0;

for (const ql of ANA_CP003_QLS) {
  for (let seed = 0; seed < 50; seed += 1) {
    const first = generateNumericAnalogy(ql.qlId, seed);
    const second = generateNumericAnalogy(ql.qlId, seed);
    assert.deepEqual(first, second, `${ql.qlId}/${seed} must be deterministic`);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => JSON.stringify(option.value))).size, 4);
    assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.ok(["EASY", "MEDIUM", "HARD"].includes(first.difficulty));
    difficulties.add(first.difficulty);

    assert.ok(verifyNumericTransfer(first.ruleId, first.context,
      { input: first.sourceA, output: first.sourceB },
      { input: first.targetA, output: first.targetB }));
    const basePairs = [
      { input: first.sourceA, output: first.sourceB },
      { input: first.targetA, output: first.targetB },
    ];
    const matches = matchingNumericRules(basePairs);
    assert.ok(matches.some((match) => match.ruleId === first.ruleId));

    if (first.additionalReference) {
      multiReferenceCount += 1;
      assert.equal(first.presentationMode, "MISSING_FOURTH_TERM");
      assert.ok(first.stem.includes(`${first.additionalReference.input} : ${first.additionalReference.output}`));
      assert.ok(verifyNumericTransfer(
        first.ruleId,
        first.context,
        { input: first.sourceA, output: first.sourceB },
        first.additionalReference,
      ));
    }

    assert.ok(Number.isInteger(first.targetB) && first.targetB > 0 && first.targetB <= 2000);
    assert.ok(first.explanation.ruleStatement.length > 15);
    assert.ok(first.explanation.sourceDemonstration.includes(String(first.sourceA)));
    assert.ok(first.explanation.targetApplication.includes(String(first.targetA)));

    for (const option of first.options) {
      if (option.errorLabel === null) continue;
      assert.notEqual(option.errorLabel, "NEAR_VALUE_WRONG_OPERATION");
      assert.notEqual(option.errorLabel, "VALID_INPUT_WRONG_NUMERIC_RELATION");
      if (option.errorLabel === "ARITHMETIC_OFF_BY_ONE_FALLBACK") {
        fallbackDistractorCount += 1;
        fallbackByRule.set(first.ruleId, (fallbackByRule.get(first.ruleId) ?? 0) + 1);
      } else misconceptionDistractorCount += 1;
    }

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
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.ok(multiReferenceCount > 0, "Expected source-style multi-reference numeric analogies.");
assert.ok(misconceptionDistractorCount > fallbackDistractorCount, "Rule-specific misconceptions must dominate arithmetic fallbacks.");

console.log("ANA-CP-003 audit-remediated contract test passed.", {
  generatedCount,
  answerPositions,
  difficulties: [...difficulties],
  multiReferenceCount,
  misconceptionDistractorCount,
  fallbackDistractorCount,
  fallbackByRule: Object.fromEntries([...fallbackByRule.entries()].sort((a, b) => b[1] - a[1])),
});
