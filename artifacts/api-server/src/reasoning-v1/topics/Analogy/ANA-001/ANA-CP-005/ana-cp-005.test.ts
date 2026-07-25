import assert from "node:assert/strict";
import { letterFromPosition } from "../foundation/alphabet";
import { checkAlphabetAmbiguity } from "./ambiguity-checker";
import { generateAlphabetAnalogy } from "./generator";
import { matchingAlphabetRules, solveAlphabetRule } from "./independent-solver";
import { ANA_CP005_QLS } from "./question-language.en";
import { ANA_CP005_RULES } from "./rule-definitions";

assert.equal(ANA_CP005_QLS.length, 20);
assert.equal(new Set(ANA_CP005_QLS.map((ql) => ql.qlId)).size, 20);
assert.deepEqual(
  ANA_CP005_QLS.map((ql) => ql.qlId),
  Array.from({ length: 20 }, (_, index) => `ANA-QL-${String(141 + index).padStart(3, "0")}`),
);
assert.equal(ANA_CP005_RULES.length, 10);
assert.equal(new Set(ANA_CP005_RULES.map((rule) => rule.id)).size, 10);

// Registry-level collision audit: no two rule/context combinations may produce
// the same complete mapping across their shared eligible domain.
for (let firstIndex = 0; firstIndex < ANA_CP005_RULES.length; firstIndex += 1) {
  const firstRule = ANA_CP005_RULES[firstIndex];
  for (const firstContext of firstRule.contexts) {
    for (let secondIndex = firstIndex + 1; secondIndex < ANA_CP005_RULES.length; secondIndex += 1) {
      const secondRule = ANA_CP005_RULES[secondIndex];
      for (const secondContext of secondRule.contexts) {
        const sharedPositions = firstRule.eligibleInputPositions.filter((position) =>
          secondRule.eligibleInputPositions.includes(position),
        );
        if (sharedPositions.length < 2) continue;
        const identical = sharedPositions.every((position) => {
          const letter = letterFromPosition(position);
          return firstRule.apply(letter, firstContext) === secondRule.apply(letter, secondContext);
        });
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

    if (generated.presentationMode === "MISSING_FOURTH_TERM") {
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

console.log("ANA-CP-005 exhaustive runtime audit passed.", {
  generatedCount,
  layouts: [...layouts],
  difficulties: [...difficulties],
  answerPositions,
  minimumStemVariety: Math.min(...[...stemsByQl.values()].map((stems) => stems.size)),
});
