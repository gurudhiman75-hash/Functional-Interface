import assert from "node:assert/strict";
import { generateLp005Batch, solveLp005 } from "./lp-005.ts";
import { STANDARD_EXAM_CITY_POOL } from "./standard-pools.ts";

const caselets = generateLp005Batch("lp-005-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Medium", "Hard"]));
assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))), new Set(["PERSON_DUTY", "NOT_PERSON_DUTY", "PERSON_PLACE", "NOT_PERSON_PLACE", "DUTY_PLACE", "NOT_DUTY_PLACE"]));

const qlPositionCounts = new Map<string, number[]>();
const standardCities = new Set(STANDARD_EXAM_CITY_POOL);
for (const caselet of caselets) {
  assert.equal(caselet.people.length, 5);
  assert.equal(caselet.duties.length, 5);
  assert.equal(caselet.places.length, 5);
  if (caselet.difficultyBand === "Hard") {
    assert.ok(caselet.clues.filter((clue) => clue.kind === "NOT_PERSON_DUTY" || clue.kind === "NOT_PERSON_PLACE").length >= 2, `${caselet.caseletId} Hard caselet lacks mixed exclusion clues`);
  } else {
    assert.ok(caselet.clues.filter((clue) => clue.kind === "PERSON_DUTY" || clue.kind === "PERSON_PLACE").length >= 7, `${caselet.caseletId} Medium caselet lacks direct anchors`);
  }
  assert.equal(solveLp005(caselet).length, 1, caselet.caseletId);
  const renderedText = [caselet.scenario, ...caselet.clues.map((clue) => clue.text), ...caselet.children.flatMap((child) => [child.stem, child.explanation.summary, ...child.explanation.lines]), ...Object.values(caselet.labels.places)].join("\n");
  assert.doesNotMatch(renderedText, /Mansa|Budhlada|Sardulgarh|Jhunir|Bathinda|Patiala|Ludhiana|Bareta|Bharatgarh/u);
  for (const label of Object.values(caselet.labels.places)) {
    if (label.endsWith(" branch") || label.endsWith(" Branch")) {
      const city = label.replace(/ branch$/iu, "");
      assert.ok(standardCities.has(city as (typeof STANDARD_EXAM_CITY_POOL)[number]), `${caselet.caseletId} uses a non-standard city: ${label}`);
    }
  }
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    const reduced = { people: caselet.people, clues: caselet.clues.filter((_, index) => index !== removed) };
    assert.ok(solveLp005(reduced).length > 1, `${caselet.caseletId} has a redundant clue`);
  }
  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    const text = `${child.stem}\n${child.explanation.lines.join("\n")}`;
    assert.match(text, /\| Person \| Duty \| Location \|/u);
    assert.doesNotMatch(text, /slot|\.\.|associated|at position|entirely|completely/u);
    const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
    counts[child.correctIndex] += 1;
    qlPositionCounts.set(child.qlId, counts);
  }
}
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-slot balance failed`);
console.log("LP-005 proof passed: 100 unique matching caselets, 400 child questions, six clue families and balanced answer slots.");
