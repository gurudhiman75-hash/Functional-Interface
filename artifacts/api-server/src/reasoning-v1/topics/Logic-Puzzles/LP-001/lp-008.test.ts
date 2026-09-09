import assert from "node:assert/strict";
import { generateLp008Batch, solveLp008 } from "./lp-008.ts";

const caselets = generateLp008Batch("lp-008-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.people))).size >= 40, "LP-008 person pool variation is too small");
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.months))).size >= 7, "LP-008 month pool variation is too small");
assert.ok(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))).size >= 6, "LP-008 clue-family coverage is too small");

const qlPositionCounts = new Map<string, number[]>();
for (const caselet of caselets) {
  assert.equal(caselet.people.length, 8);
  assert.equal(caselet.months.length, 4);
  assert.equal(caselet.slots.length, 8);
  assert.equal(new Set(caselet.people).size, 8);
  assert.equal(new Set(caselet.slots).size, 8);
  assert.match(caselet.questionSetup, /each have one .* on one of the following eight dates:/u);
  assert.match(caselet.questionSetup, /No two .* have their .* on the same date in the same month/u);
  for (const person of Object.values(caselet.labels.people)) assert.ok(caselet.questionSetup.includes(person));
  for (const month of Object.values(caselet.labels.months)) {
    assert.ok(caselet.questionSetup.includes(`12th ${month}`));
    assert.ok(caselet.questionSetup.includes(`27th ${month}`));
  }
  assert.doesNotMatch(caselet.questionSetup, /People:|Days:|Study areas:|Cities:|associated|centre|slot|\.\.|\bBLR\b/u);

  const direct = caselet.clues.filter((clue) => clue.kind === "PERSON_SLOT").length;
  const relational = caselet.clues.filter((clue) => ["SAME_MONTH", "SAME_DATE", "BEFORE", "BETWEEN"].includes(clue.kind)).length;
  const exclusions = caselet.clues.filter((clue) => clue.kind === "NOT_MONTH").length;
  if (caselet.difficultyBand === "Easy") assert.equal(direct, 7, `${caselet.caseletId} Easy should use seven direct entries`);
  if (caselet.difficultyBand === "Medium") {
    assert.ok(direct >= 1, `${caselet.caseletId} Medium lacks a direct anchor`);
    assert.ok(relational >= 1 || exclusions >= 1, `${caselet.caseletId} Medium lacks a narrowing clue`);
    assert.ok(new Set(caselet.clues.map((clue) => clue.kind)).size >= 2, `${caselet.caseletId} Medium clue topology is too shallow`);
  }
  if (caselet.difficultyBand === "Hard") {
    assert.ok(direct >= 1 && direct <= 3, `${caselet.caseletId} Hard should retain only a small number of direct anchors`);
    assert.ok(relational >= 1, `${caselet.caseletId} Hard lacks a relational deduction`);
    assert.ok(exclusions >= 1, `${caselet.caseletId} Hard lacks a month exclusion`);
  }

  assert.deepEqual(solveLp008({ clues: caselet.clues }), [caselet.assignment], `${caselet.caseletId} hidden assignment mismatch`);
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    assert.ok(solveLp008({ clues: caselet.clues.filter((_, index) => index !== removed) }).length > 1, `${caselet.caseletId} has a redundant clue`);
  }

  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    assert.ok(child.stem.startsWith(caselet.questionSetup));
    assert.match(child.stem, /Clues:\n/u);
    for (const clue of caselet.clues) assert.ok(child.stem.includes(clue.text), `${child.questionId} omits a clue from its standalone stem`);
    const evidence = child.explanation.lines.join("\n");
    assert.match(evidence, /\| Person \| Date and month \|/u);
    assert.match(evidence, /Step 1:/u);
    assert.match(evidence, /Step 2:/u);
    assert.doesNotMatch(`${child.stem}\n${evidence}`, /associated|centre|slot|\.\.|\bBLR\b/u);
    const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
    counts[child.correctIndex] += 1;
    qlPositionCounts.set(child.qlId, counts);
  }
}

assert.deepEqual(new Set(qlPositionCounts.keys()), new Set(["LP-QL-029", "LP-QL-030", "LP-QL-031", "LP-QL-032"]));
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-slot balance failed`);
console.log("LP-008 proof passed: 100 unique month/date caselets, 400 standalone child questions, six clue families, progressive tables and balanced answer slots.");
