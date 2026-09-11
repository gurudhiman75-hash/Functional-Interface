import assert from "node:assert/strict";
import { independentlySolveAnaCp010Numeric, independentlyValidateAnaCp010Set } from "./independent-solver";
import { ANA_CP010_QLS } from "./question-language.en";
import { generateAnaCp010 } from "./runtime";
import { anaCp010NumericRuleById } from "./rule-definitions";

assert.equal(ANA_CP010_QLS.length, 16);
assert.deepEqual(
  ANA_CP010_QLS.map((entry) => entry.qlId),
  Array.from({ length: 16 }, (_, index) => `ANA-QL-${String(251 + index).padStart(3, "0")}`),
);
assert.equal(new Set(ANA_CP010_QLS.map((entry) => entry.qlId)).size, 16);

const sourceFixtures = [
  ["NUM_HIGHER_FIXED_POWER", 3, { exponent: 5 }, 243],
  ["NUM_HIGHER_FIXED_POWER", 5, { exponent: 5 }, 3125],
  ["NUM_EXACT_SQUARE_ROOT", 484, {}, 22],
  ["NUM_EXACT_SQUARE_ROOT", 1024, {}, 32],
  ["NUM_CUBE_ROOT_ADJUST", 2744, { adjust: -1 }, 13],
  ["NUM_CUBE_ROOT_ADJUST", 2197, { adjust: -1 }, 12],
  ["NUM_CUBE_SUBTRACT", 10, { constant: 4 }, 996],
  ["NUM_DIGIT_QUOTIENT", 93, {}, 3],
  ["NUM_DIGIT_QUOTIENT", 82, {}, 4],
  ["NUM_THREE_DIGIT_SUM", 654, {}, 15],
  ["NUM_THREE_DIGIT_SUM", 732, {}, 12],
  ["NUM_THREE_DIGIT_PRODUCT", 258, {}, 80],
  ["NUM_THREE_DIGIT_PRODUCT", 369, {}, 162],
] as const;

for (const [ruleId, input, context, expected] of sourceFixtures) {
  const rule = anaCp010NumericRuleById(ruleId);
  assert.equal(rule.apply(input, context), expected, `${ruleId} generator fixture mismatch`);
  assert.equal(independentlySolveAnaCp010Numeric(ruleId, input, context), expected, `${ruleId} solver fixture mismatch`);
}

assert.ok(independentlyValidateAnaCp010Set("SET_ALL_PRIME", [11, 23, 37]));
assert.ok(!independentlyValidateAnaCp010Set("SET_ALL_PRIME", [11, 25, 37]));
assert.ok(independentlyValidateAnaCp010Set("SET_FIXED_RATIO_PROGRESSION", [6, 12, 24]));
assert.ok(!independentlyValidateAnaCp010Set("SET_FIXED_RATIO_PROGRESSION", [6, 12, 25]));

const answerPositions = [0, 0, 0, 0];
const seenDifficulties = new Set<string>();
const seenRules = new Set<string>();

for (const ql of ANA_CP010_QLS) {
  for (let seed = 0; seed < 60; seed += 1) {
    const generated = generateAnaCp010(ql.qlId, seed);
    assert.equal(generated.qlId, ql.qlId);
    assert.equal(generated.options.length, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.ok(generated.correctIndex >= 0 && generated.correctIndex < 4);
    assert.equal(generated.options[generated.correctIndex].errorLabel, null);
    assert.ok(generated.stem.length > 25);
    assert.ok(generated.explanation.length >= 3);
    assert.ok(generated.explanation.every((line) => line.length > 8));
    assert.ok(generated.options.filter((option) => option.errorLabel !== null).every((option) => option.errorLabel));

    if (generated.kind === "NUMERIC") {
      assert.equal(
        independentlySolveAnaCp010Numeric(generated.ruleId, generated.source.input, generated.context),
        generated.source.output,
      );
      assert.equal(
        independentlySolveAnaCp010Numeric(generated.ruleId, generated.target.input, generated.context),
        generated.target.output,
      );
      if (generated.presentationMode === "MISSING_FOURTH_TERM") {
        assert.equal(generated.options[generated.correctIndex].value, generated.target.output);
      } else {
        assert.deepEqual(generated.options[generated.correctIndex].value, [generated.target.input, generated.target.output]);
      }
    } else if (generated.ruleId === "SET_ALL_PRIME") {
      assert.equal(generated.options.filter((option) => independentlyValidateAnaCp010Set("SET_ALL_PRIME", option.value)).length, 1);
    } else {
      const ratio = generated.source[1] / generated.source[0];
      assert.equal(
        generated.options.filter((option) => independentlyValidateAnaCp010Set("SET_FIXED_RATIO_PROGRESSION", option.value) && option.value[1] / option.value[0] === ratio).length,
        1,
      );
    }

    answerPositions[generated.correctIndex] += 1;
    seenDifficulties.add(generated.difficulty);
    seenRules.add(generated.ruleId);
  }
}

assert.deepEqual(new Set(["EASY", "MEDIUM", "HARD"]), seenDifficulties);
assert.equal(seenRules.size, 9);
const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(maxPosition / minPosition < 1.25, `ANA-CP-010 answer positions imbalanced: ${answerPositions.join(", ")}`);

console.log("ANA-CP-010 numeric/set source-gap proof passed.", {
  qlCount: ANA_CP010_QLS.length,
  rules: [...seenRules],
  difficulties: [...seenDifficulties],
  answerPositions,
});
