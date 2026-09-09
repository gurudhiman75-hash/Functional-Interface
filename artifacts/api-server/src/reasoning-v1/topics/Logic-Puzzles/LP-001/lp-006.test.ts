import assert from "node:assert/strict";
import { generateLp006Batch, solveLp006 } from "./lp-006.ts";
import { STANDARD_EXAM_CITY_POOL } from "./standard-pools.ts";

const caselets = generateLp006Batch("lp-006-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))), new Set(["PERSON_DAY", "PERSON_SUBJECT", "PERSON_CITY", "DAY_BEFORE", "SUBJECT_CITY", "NOT_SUBJECT_CITY"]));

const qlPositionCounts = new Map<string, number[]>();
const standardCities = new Set(STANDARD_EXAM_CITY_POOL);
assert.ok(STANDARD_EXAM_CITY_POOL.length >= 24, "LP-006 standard city pool was not expanded");
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.people))).size >= 40, "LP-006 person pool variation is too small");
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.subjects))).size >= 30, "LP-006 study-area pool variation is too small");
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.cities))).size >= 20, "LP-006 city pool variation is too small");
for (const caselet of caselets) {
  assert.equal(caselet.people.length, 4);
  assert.equal(caselet.days.length, 4);
  assert.equal(caselet.subjects.length, 4);
  assert.equal(caselet.cities.length, 4);
  assert.match(caselet.questionSetup, /Four persons—/u);
  assert.match(caselet.questionSetup, /one each to the four days \(Monday, Tuesday, Wednesday and Thursday\)/u);
  assert.match(caselet.questionSetup, /one each to the four study areas \(/u);
  assert.match(caselet.questionSetup, /one each to the four cities \(/u);
  assert.doesNotMatch(caselet.questionSetup, /People:|Days:|Study areas:|Cities:/u);
  for (const person of Object.values(caselet.labels.people)) assert.match(caselet.questionSetup, new RegExp(person, "u"));
  for (const subject of Object.values(caselet.labels.subjects)) assert.match(caselet.questionSetup, new RegExp(subject, "u"));
  for (const city of Object.values(caselet.labels.cities)) assert.match(caselet.questionSetup, new RegExp(city, "u"));
  if (caselet.difficultyBand === "Easy") assert.ok(caselet.clues.every((clue) => clue.kind === "PERSON_DAY" || clue.kind === "PERSON_SUBJECT" || clue.kind === "PERSON_CITY"), `${caselet.caseletId} Easy caselet contains a relational clue`);
  if (caselet.difficultyBand === "Medium") assert.ok(caselet.clues.some((clue) => clue.kind === "DAY_BEFORE") && caselet.clues.some((clue) => clue.kind === "NOT_SUBJECT_CITY"), `${caselet.caseletId} Medium caselet lacks its ordering/linkage deduction`);
  if (caselet.difficultyBand === "Hard") assert.ok(caselet.clues.some((clue) => clue.kind === "DAY_BEFORE") && caselet.clues.some((clue) => clue.kind === "SUBJECT_CITY") && caselet.clues.some((clue) => clue.kind === "NOT_SUBJECT_CITY") && caselet.clues.filter((clue) => clue.kind === "PERSON_CITY").length === 1, `${caselet.caseletId} Hard caselet lacks its mixed linkage chain`);
  assert.deepEqual(solveLp006(caselet), [caselet.assignment], `${caselet.caseletId} hidden assignment mismatch`);
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    const reduced = { people: caselet.people, clues: caselet.clues.filter((_, index) => index !== removed) };
    assert.ok(solveLp006(reduced).length > 1, `${caselet.caseletId} has a redundant clue`);
  }
  for (const city of Object.values(caselet.labels.cities)) assert.ok(standardCities.has(city), `${caselet.caseletId} uses a non-standard city: ${city}`);
  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    const text = `${child.stem}\n${child.explanation.lines.join("\n")}`;
    assert.match(child.stem, /Four persons—/u);
    assert.match(child.stem, /one each to the four days \(Monday, Tuesday, Wednesday and Thursday\)/u);
    assert.match(child.stem, /one each to the four study areas \(/u);
    assert.match(child.stem, /one each to the four cities \(/u);
    assert.doesNotMatch(child.stem, /People:|Days:|Study areas:|Cities:/u);
    assert.match(child.stem, /Clues:\n/u);
    assert.match(text, /\| Person \| Day \| Study area \| City \|/u);
    assert.doesNotMatch(text, /Centre|associated|slot|\.\.|entirely|completely|\bBLR\b/u);
    const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
    counts[child.correctIndex] += 1;
    qlPositionCounts.set(child.qlId, counts);
  }
}
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-slot balance failed`);
console.log("LP-006 proof passed: 100 unique three-attribute caselets, 400 child questions, linkage and ordering clues, standard city pool and balanced answer slots.");
