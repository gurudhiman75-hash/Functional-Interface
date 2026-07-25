import assert from "node:assert/strict";
import { ANA_CP004_QLS } from "./question-language.en";
import { ANA_CP004_RULES } from "./rule-definitions";
import { generateSetAnalogy } from "./generator";
import { matchingSetRules, verifySetTransfer } from "./independent-solver";

assert.equal(ANA_CP004_QLS.length, 32);
assert.equal(new Set(ANA_CP004_QLS.map((ql) => ql.qlId)).size, 32);
assert.deepEqual(
  ANA_CP004_QLS.map((ql) => ql.qlId),
  Array.from({ length: 32 }, (_, index) => `ANA-QL-${String(109 + index).padStart(3, "0")}`),
);
assert.equal(ANA_CP004_RULES.length, 16);
assert.equal(new Set(ANA_CP004_RULES.map((rule) => rule.id)).size, 16);

const answerPositions = [0, 0, 0, 0];
const layouts = new Set<string>();
const difficulties = new Set<string>();
const missingPositions = new Set<number>();
const stemsByQl = new Map<string, Set<string>>();
let generatedCount = 0;

for (const ql of ANA_CP004_QLS) {
  const qlStems = new Set<string>();
  stemsByQl.set(ql.qlId, qlStems);
  for (let seed = 0; seed < 60; seed += 1) {
    const first = generateSetAnalogy(ql.qlId, seed);
    const second = generateSetAnalogy(ql.qlId, seed);
    assert.deepEqual(first, second, `${ql.qlId}/${seed} must be deterministic`);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => JSON.stringify(option.value))).size, 4);
    assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.ok(verifySetTransfer(first.ruleId, first.context, first.source, first.target));
    const matches = matchingSetRules([first.source, first.target]);
    assert.ok(matches.some((match) => match.ruleId === first.ruleId));
    for (const value of [first.source.first, first.source.second, first.source.third, first.target.first, first.target.second, first.target.third]) {
      assert.ok(Number.isInteger(value) && value > 0 && value <= 2000);
    }
    assert.ok(first.explanation.ruleStatement.length > 15);
    assert.ok(first.explanation.sourceDemonstration.includes(String(first.source.first)));
    assert.ok(first.explanation.targetApplication.includes(String(first.target.first)));
    assert.ok(first.stem.length > 12);
    layouts.add(first.layout);
    difficulties.add(first.difficulty);
    qlStems.add(first.stem);

    if (first.presentationMode === "MISSING_MEMBER") {
      assert.equal(first.options[first.correctIndex].value, first.target.third);
      assert.notEqual(first.missingPosition, null);
      missingPositions.add(first.missingPosition!);
      assert.ok(first.stem.includes("?"));
    } else {
      assert.equal(first.missingPosition, null);
      assert.deepEqual(first.options[first.correctIndex].value, [first.target.first, first.target.second, first.target.third]);
      for (const [index, option] of first.options.entries()) {
        if (index === first.correctIndex) continue;
        const [a,b,c] = option.value as readonly [number,number,number];
        assert.ok(!verifySetTransfer(first.ruleId, first.context, { first: a, second: b, third: c }));
      }
    }
    answerPositions[first.correctIndex] += 1;
    generatedCount += 1;
  }
  assert.ok(qlStems.size >= 12, `${ql.qlId} lacks visible stem variety: ${qlStems.size}`);
}

assert.deepEqual([...layouts].sort(), ["BOXED_SETS", "INLINE", "TWO_ROW_TABLE", "VERTICAL_GRID"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...missingPositions].sort(), [0, 1, 2]);

const minimum = Math.min(...answerPositions);
const maximum = Math.max(...answerPositions);
assert.ok(minimum > 0);
assert.ok(maximum / minimum < 1.35, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log("ANA-CP-004 expanded variety audit passed.", {
  generatedCount,
  answerPositions,
  layouts: [...layouts],
  difficulties: [...difficulties],
  missingPositions: [...missingPositions],
});
