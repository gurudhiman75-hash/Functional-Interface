import assert from "node:assert/strict";
import { generateLp002Batch, solveLp002 } from "./lp-002.ts";
import { STANDARD_EXAM_CITY_POOL } from "./standard-pools.ts";

const caselets = generateLp002Batch("lp-002-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Medium", "Hard"]));
assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))), new Set(["NOT_DAY", "NOT_LOCATION", "DAY_BEFORE", "LOCATION_BEFORE", "DAY_GAP"]));
const qlPositionCounts = new Map<string, number[]>();
const standardCities = new Set(STANDARD_EXAM_CITY_POOL);
const genericLocationLabels = new Set(["Village Health Centre", "Block Hospital", "Community Hall", "Women and Child Centre", "Government Senior Secondary School", "Model School", "Girls' School", "College Campus", "Upper Canal", "Village Tank", "Irrigation Dam", "River Outfall"]);
for (const caselet of caselets) {
  assert.equal(solveLp002(caselet).length, 1, caselet.caseletId);
  const renderedText = [caselet.scenario, ...caselet.clues.map((clue) => clue.text), ...caselet.children.flatMap((child) => [child.stem, child.explanation.summary, ...child.explanation.lines]), ...Object.values(caselet.locationLabels)].join("\n");
  assert.doesNotMatch(renderedText, /Mansa|Budhlada|Sardulgarh|Jhunir|Bathinda|Patiala|Ludhiana|Bareta|Bharatgarh|Model Town|Civil Lines|Railway Road|Court Road/u);
  for (const label of Object.values(caselet.locationLabels)) {
    const city = label.replace(/ (?:Branch|Centre)$/u, "");
    assert.ok(standardCities.has(city as (typeof STANDARD_EXAM_CITY_POOL)[number]) || genericLocationLabels.has(label), `${caselet.caseletId} uses an unapproved location object: ${label}`);
  }
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    const withoutOneClue = { people: caselet.people, clues: caselet.clues.filter((_, index) => index !== removed) };
    assert.ok(solveLp002(withoutOneClue).length > 1, `${caselet.caseletId} has a redundant clue`);
  }
  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    for (const option of child.options) assert.equal(typeof option, "string", `${caselet.caseletId} contains a non-text option`);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    const explanationText = child.explanation.lines.join("\n");
    assert.match(explanationText, /\| Person \|/u);
    assert.doesNotMatch(explanationText, /\.\./u);
    for (const person of caselet.people) {
      assert.doesNotMatch(explanationText, new RegExp(`; then ${person.toLowerCase()}(?:['’]s)?\\b`, "u"), `${caselet.caseletId} lowercased ${person} in a chained deduction`);
    }
    const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
    counts[child.correctIndex] += 1;
    qlPositionCounts.set(child.qlId, counts);
  }
}
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-slot balance failed`);
console.log("LP-002 proof passed: 100 unique multi-attribute caselets, 400 child questions, five clue families and balanced answer slots.");
