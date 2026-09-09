import assert from "node:assert/strict";
import { generateLp003Batch, solveLp003 } from "./lp-003.ts";

const caselets = generateLp003Batch("lp-003-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Medium", "Hard"]));
assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))), new Set(["ABOVE", "IMMEDIATELY_ABOVE", "BOXES_BETWEEN", "NOT_ADJACENT", "NOT_POSITION"]));

const qlPositionCounts = new Map<string, number[]>();
for (const caselet of caselets) {
  assert.equal(caselet.boxes.length, 7);
  assert.equal(new Set(caselet.boxes).size, 7);
  assert.equal(solveLp003(caselet).length, 1, caselet.caseletId);
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    const withoutOneClue = { boxes: caselet.boxes, clues: caselet.clues.filter((_, index) => index !== removed) };
    assert.ok(solveLp003(withoutOneClue).length > 1, `${caselet.caseletId} has a redundant clue`);
  }
  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    for (const option of child.options) assert.equal(typeof option, "string", `${caselet.caseletId} contains a non-text option`);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    const explanationText = child.explanation.lines.join("\n");
    assert.match(explanationText, /\| Position from bottom \|/u);
    assert.doesNotMatch(explanationText, /slot|\.\.|\bat position \d+(?:st|nd|rd|th)\b|\b1 (?:cartons|crates|boxes|archive boxes|record boxes|sealed boxes|supply boxes)\b/u);
    const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
    counts[child.correctIndex] += 1;
    qlPositionCounts.set(child.qlId, counts);
  }
}
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-slot balance failed`);
console.log("LP-003 proof passed: 100 unique box-stack caselets, 400 child questions, five clue families and balanced answer slots.");
