import assert from "node:assert/strict";
import { letterFromPosition, letterPosition } from "../foundation/alphabet";
import { checkAlphabetAmbiguity } from "./ambiguity-checker";
import { generateAlphabetAnalogy } from "./generator";
import { matchingAlphabetRules, solveAlphabetRule } from "./independent-solver";
import { ANA_CP005_QLS } from "./question-language.en";
import { ANA_CP005_RULES } from "./rule-definitions";

const EXPECTED_RULE_IDS = [
  "ALPHA_FIXED_SHIFT_FORWARD",
  "ALPHA_FIXED_SHIFT_BACKWARD",
  "ALPHA_CYCLIC_SHIFT_FORWARD",
  "ALPHA_CYCLIC_SHIFT_BACKWARD",
  "ALPHA_OPPOSITE",
  "ALPHA_EQUAL_DISTANCE",
  "ALPHA_REVERSE_POSITION",
  "ALPHA_DOUBLED_MOVEMENT",
  "ALPHA_CLASS_CORRESPONDENCE",
  "ALPHA_TWO_STEP_POSITION",
] as const;

assert.equal(ANA_CP005_QLS.length, 20);
assert.equal(new Set(ANA_CP005_QLS.map((ql) => ql.qlId)).size, 20);
assert.deepEqual(
  ANA_CP005_QLS.map((ql) => ql.qlId),
  Array.from({ length: 20 }, (_, index) => `ANA-QL-${String(141 + index).padStart(3, "0")}`),
);
assert.deepEqual(ANA_CP005_RULES.map((rule) => rule.id), EXPECTED_RULE_IDS);
assert.deepEqual(
  ANA_CP005_QLS.filter((_, index) => index % 2 === 0).map((ql) => ql.presentationMode),
  Array(10).fill("DIRECT_COMPLETION"),
);
assert.deepEqual(
  ANA_CP005_QLS.filter((_, index) => index % 2 === 1).map((ql) => ql.presentationMode),
  Array(10).fill("PAIR_SELECTION"),
);
assert.ok(ANA_CP005_QLS.every((ql) => ql.taskKind === "singleLetterTransform"));
assert.ok(ANA_CP005_QLS.every((ql) => ql.solveMode === "ALPHABET_RULE"));

// Registry-level collision audit: compare only positions where both contexts
// actually produce a valid output. Null outside a rule domain is not a mapping.
for (let firstIndex = 0; firstIndex < ANA_CP005_RULES.length; firstIndex += 1) {
  const firstRule = ANA_CP005_RULES[firstIndex];
  for (const firstContext of firstRule.contexts) {
    for (let secondIndex = firstIndex + 1; secondIndex < ANA_CP005_RULES.length; secondIndex += 1) {
      const secondRule = ANA_CP005_RULES[secondIndex];
      for (const secondContext of secondRule.contexts) {
        const sharedLetters = Array.from({ length: 26 }, (_, index) => letterFromPosition(index + 1))
          .filter((letter) => firstRule.apply(letter, firstContext) && secondRule.apply(letter, secondContext));
        if (sharedLetters.length < 2) continue;
        const identical = sharedLetters.every(
          (letter) => firstRule.apply(letter, firstContext) === secondRule.apply(letter, secondContext),
        );
        assert.equal(
          identical,
          false,
          `Complete rule collision: ${firstRule.id} and ${secondRule.id}`,
        );
      }
    }
  }
}

const answerPositions = [0, 0, 0, 0];
const layouts = new Set<string>();
const difficulties = new Set<string>();
const stemsByQl = new Map<string, Set<string>>();
let generatedCount = 0;

for (const ql of ANA_CP005_QLS) {
  const stems = new Set<string>();
  stemsByQl.set(ql.qlId, stems);
  for (let seed = 0; seed < 80; seed += 1) {
    const generated = generateAlphabetAnalogy(ql.qlId, seed);
    generatedCount += 1;
    stems.add(generated.stem);
    layouts.add(generated.layout);
    difficulties.add(generated.difficulty);

    assert.equal(generated.qlId, ql.qlId);
    assert.equal(generated.ruleId, ql.ruleId);
    assert.equal(generated.options.length, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(new Set(generated.options.map((option) => JSON.stringify(option.value))).size, 4);
    assert.ok(generated.correctIndex >= 0 && generated.correctIndex < 4);
    answerPositions[generated.correctIndex] += 1;

    const solvedTarget = solveAlphabetRule(generated.ruleId, generated.context, generated.target.left);
    assert.equal(solvedTarget, generated.target.right);
    assert.equal(
      checkAlphabetAmbiguity(generated.ruleId, generated.context, [generated.source, generated.target]).accepted,
      true,
    );
    const matches = matchingAlphabetRules([generated.source, generated.target]);
    assert.ok(matches.some((match) => match.ruleId === generated.ruleId));

    if (generated.ruleId === "ALPHA_FIXED_SHIFT_FORWARD") {
      assert.ok(letterPosition(generated.source.left) + generated.context.shift! <= 26);
      assert.ok(letterPosition(generated.target.left) + generated.context.shift! <= 26);
    }
    if (generated.ruleId === "ALPHA_FIXED_SHIFT_BACKWARD") {
      assert.ok(letterPosition(generated.source.left) - generated.context.shift! >= 1);
      assert.ok(letterPosition(generated.target.left) - generated.context.shift! >= 1);
    }
    if (generated.ruleId === "ALPHA_CYCLIC_SHIFT_FORWARD") {
      assert.ok(letterPosition(generated.source.left) + generated.context.shift! > 26);
      assert.ok(letterPosition(generated.target.left) + generated.context.shift! > 26);
      assert.ok(generated.explanation.sourceDemonstration.includes("- 26"));
    }
    if (generated.ruleId === "ALPHA_CYCLIC_SHIFT_BACKWARD") {
      assert.ok(letterPosition(generated.source.left) - generated.context.shift! < 1);
      assert.ok(letterPosition(generated.target.left) - generated.context.shift! < 1);
      assert.ok(generated.explanation.sourceDemonstration.includes("+ 26"));
    }
    if (generated.ruleId === "ALPHA_EQUAL_DISTANCE") {
      assert.notEqual(
        letterPosition(generated.source.left) <= 13,
        letterPosition(generated.target.left) <= 13,
        "Equal-distance evidence must activate both direction branches.",
      );
    }

    if (generated.presentationMode === "DIRECT_COMPLETION") {
      assert.ok(generated.options.every((option) => typeof option.value === "string"));
      assert.equal(generated.options[generated.correctIndex].value, generated.target.right);
    } else {
      assert.ok(generated.options.every((option) => Array.isArray(option.value)));
      assert.deepEqual(generated.options[generated.correctIndex].value, [generated.target.left, generated.target.right]);
      for (const [index, option] of generated.options.entries()) {
        const [left, right] = option.value as readonly [string, string];
        assert.equal(
          solveAlphabetRule(generated.ruleId, generated.context, left) === right,
          index === generated.correctIndex,
        );
      }
    }

    assert.ok(generated.explanation.ruleStatement.length > 20);
    assert.ok(generated.explanation.sourceDemonstration.includes(generated.source.left));
    assert.ok(generated.explanation.targetApplication.includes(generated.target.left));
    assert.ok(!generated.explanation.ruleStatement.includes("ALPHA_"));
  }
  assert.ok(stems.size >= 12, `${ql.qlId} has insufficient visible stem variety: ${stems.size}`);
}

assert.deepEqual([...layouts].sort(), ["ARROW", "BOXED_PAIRS", "INLINE", "TWO_ROW_TABLE"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
const minAnswerPosition = Math.min(...answerPositions);
const maxAnswerPosition = Math.max(...answerPositions);
assert.ok(maxAnswerPosition / minAnswerPosition < 1.35, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log("ANA-CP-005 canonical exhaustive runtime audit passed.", {
  generatedCount,
  ruleIds: EXPECTED_RULE_IDS,
  layouts: [...layouts],
  difficulties: [...difficulties],
  answerPositions,
  minimumStemVariety: Math.min(...[...stemsByQl.values()].map((stems) => stems.size)),
});
