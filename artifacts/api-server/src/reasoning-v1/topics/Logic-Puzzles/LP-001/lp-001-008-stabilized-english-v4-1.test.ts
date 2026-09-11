import assert from "node:assert/strict";
import { generateLp001BatchStabilizedV4 } from "./lp-001-008-stabilized-english-v4.ts";
import {
  LP_001_008_STABILIZED_ENGLISH_V4_1,
  generateLp001BatchStabilizedV4_1,
} from "./lp-001-008-stabilized-english-v4-1.ts";

function semanticClue(clue: any) {
  const { text: _text, ...semantic } = clue;
  return semantic;
}

function semanticChild(child: any) {
  const { stem: _stem, explanation: _explanation, ...semantic } = child;
  return semantic;
}

assert.equal(LP_001_008_STABILIZED_ENGLISH_V4_1.lp001ExclusionRender, "BINARY_EITHER_OR");
assert.equal(LP_001_008_STABILIZED_ENGLISH_V4_1.changesPuzzleSemantics, false);

const seed = "lp-v4-1-either-or-proof";
const base = generateLp001BatchStabilizedV4(seed, 100);
const revised = generateLp001BatchStabilizedV4_1(seed, 100);
assert.equal(revised.length, base.length);

let rewritten = 0;
for (let index = 0; index < revised.length; index += 1) {
  const before = base[index]!;
  const after = revised[index]!;

  assert.equal(after.caseletId, before.caseletId);
  assert.deepEqual(after.assignment, before.assignment);
  assert.deepEqual(after.people, before.people);
  assert.deepEqual(after.groups, before.groups);
  assert.equal(after.difficultyBand, before.difficultyBand);
  assert.deepEqual(after.clues.map(semanticClue), before.clues.map(semanticClue));
  assert.deepEqual(after.children.map(semanticChild), before.children.map(semanticChild));

  for (let clueIndex = 0; clueIndex < after.clues.length; clueIndex += 1) {
    const oldClue = before.clues[clueIndex]!;
    const newClue = after.clues[clueIndex]!;
    if (newClue.kind !== "NOT_IN_GROUP") {
      assert.equal(newClue.text, oldClue.text, `${after.caseletId}: non-exclusion clue copy changed`);
      continue;
    }

    rewritten += 1;
    assert.match(newClue.text, /\beither\b.+\bor\b/iu, `${after.caseletId}: exclusion was not rendered as either/or`);
    assert.doesNotMatch(newClue.text, /\bnot\b|does not|do not/iu, `${after.caseletId}: negative exclusion wording survived`);
    const allowed = after.groups.filter((group) => group !== newClue.group);
    assert.equal(allowed.length, 2);
    for (const group of allowed) assert.ok(newClue.text.includes(after.groupLabels[group]), `${after.caseletId}: either/or clue omits allowed group ${after.groupLabels[group]}`);
    assert.ok(!newClue.text.includes(after.groupLabels[newClue.group]), `${after.caseletId}: either/or clue incorrectly names excluded group ${after.groupLabels[newClue.group]}`);

    for (const child of after.children) {
      assert.ok(child.stem.includes(newClue.text), `${child.questionId}: rewritten clue missing from stem`);
      assert.ok(child.explanation.lines.some((line) => line.includes(newClue.text)), `${child.questionId}: rewritten clue missing from explanation`);
    }
  }
}

assert.ok(rewritten > 0, "No LP-001 exclusion clues were rewritten.");

const reference = generateLp001BatchStabilizedV4_1("lp-001-008-review-v3-3:LP-001", 12)[0]!;
const exclusionTexts = reference.clues.filter((clue) => clue.kind === "NOT_IN_GROUP").map((clue) => clue.text);
assert.ok(exclusionTexts.length >= 2, "Reference LP-001 case should expose the paired either/or pattern.");
assert.ok(exclusionTexts.every((text) => /\beither\b.+\bor\b/iu.test(text)), "Reference LP-001 exclusions were not converted to either/or clues.");

console.log(`LP-001 V4.1 either/or clue rendering passed for ${revised.length} caselets; ${rewritten} negative exclusions converted without semantic drift.`);
