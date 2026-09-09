import assert from "node:assert/strict";
import { generateLp004Batch, solveLp004 } from "./lp-004.ts";

const caselets = generateLp004Batch("lp-004-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Medium", "Hard"]));
assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))), new Set(["MUST_SELECT", "MUST_NOT_SELECT", "TOGETHER", "NOT_TOGETHER", "EXACTLY_ONE", "IF_SELECTED"]));

const qlPositionCounts = new Map<string, number[]>();
for (const caselet of caselets) {
  assert.equal(caselet.committeeSize, 4);
  assert.equal(caselet.candidates.length, 7);
  assert.equal(caselet.candidates.filter((candidate) => caselet.assignment[candidate]).length, 4);
  assert.equal(solveLp004(caselet).length, 1, caselet.caseletId);
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    const withoutOneClue = { candidates: caselet.candidates, committeeSize: caselet.committeeSize, clues: caselet.clues.filter((_, index) => index !== removed) };
    assert.ok(solveLp004(withoutOneClue).length > 1, `${caselet.caseletId} has a redundant clue`);
  }
  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    const explanationText = child.explanation.lines.join("\n");
    assert.match(explanationText, /\| Candidate \| Status \|/u);
    assert.doesNotMatch(`${child.stem}\n${explanationText}`, /slot|\.\.|There are 1 |Exactly 1 [^\n]+ are kept|entirely included|completely included|fully present|consists only of selected team members/u);
    const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
    counts[child.correctIndex] += 1;
    qlPositionCounts.set(child.qlId, counts);
  }
}
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-slot balance failed`);
console.log("LP-004 proof passed: 100 unique selection caselets, 400 child questions, six clue families and balanced answer slots.");
