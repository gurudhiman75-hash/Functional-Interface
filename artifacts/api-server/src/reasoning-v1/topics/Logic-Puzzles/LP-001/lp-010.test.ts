import assert from "node:assert/strict";
import { generateLp010Batch } from "./lp-010.ts";

const caselets = generateLp010Batch("lp-010-proof", 120);
assert.equal(caselets.length, 120);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.mode)), new Set(["PROFESSION", "HEIGHT"]));
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.ok(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size >= 8);

for (const caselet of caselets) {
  assert.equal(caselet.people.length, 6);
  assert.equal(caselet.children.length, 4);
  assert.equal(caselet.labels.familyClues.length, 4);
  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    for (const familyClue of caselet.labels.familyClues) assert.ok(child.stem.includes(familyClue));
    for (const clue of caselet.clues) assert.ok(child.stem.includes(clue.text));
    const explanation = child.explanation.lines.join("\n\n");
    assert.match(explanation, /Step 1: Build the family tree/u);
    assert.match(explanation, /Complete the one-to-one table/u);
    assert.match(explanation, /\| Family member \|/u);
    assert.doesNotMatch(explanation, /use all the clues|apply all the clues/iu);
  }
}

assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.children.map((child) => child.qlId))), new Set(["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"]));
console.log("LP-010 review proof passed: hybrid family + profession/height caselets with standalone children and progressive explanations.");
