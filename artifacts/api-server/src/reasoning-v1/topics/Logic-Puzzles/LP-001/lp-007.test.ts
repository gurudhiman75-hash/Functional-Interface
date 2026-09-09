import assert from "node:assert/strict";
import { generateLp007Batch, solveLp007 } from "./lp-007.ts";

const caselets = generateLp007Batch("lp-007-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.people))).size >= 40, "LP-007 person pool variation is too small");
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.values))).size >= 35, "LP-007 variable pool variation is too small");
assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))), new Set(["PERSON_VALUE", "PERSON_EITHER", "NOT_PERSON_VALUE"]));

const qlPositionCounts = new Map<string, number[]>();
for (const caselet of caselets) {
  assert.equal(caselet.people.length, 5);
  assert.equal(caselet.values.length, 5);
  assert.equal(new Set(caselet.people).size, 5);
  assert.equal(new Set(caselet.values).size, 5);
  assert.match(caselet.questionSetup, /The .*s—/u);
  assert.match(caselet.questionSetup, /each assigned one different /u);
  assert.match(caselet.questionSetup, /Each .* is (assigned to|liked by|handled by|chosen by|used by) exactly one /u);
  assert.doesNotMatch(caselet.questionSetup, /People:|Days:|Study areas:|Cities:|slot|BLR/u);
  for (const person of Object.values(caselet.labels.people)) assert.ok(caselet.questionSetup.includes(person));
  for (const value of Object.values(caselet.labels.values)) assert.ok(caselet.questionSetup.includes(value));

  if (caselet.difficultyBand === "Easy") assert.ok(caselet.clues.every((clue) => clue.kind === "PERSON_VALUE"), `${caselet.caseletId} Easy caselet contains a deduction clue`);
  if (caselet.difficultyBand === "Medium") {
    assert.ok(caselet.clues.some((clue) => clue.kind === "PERSON_EITHER"), `${caselet.caseletId} Medium caselet lacks an either-or clue`);
    assert.ok(caselet.clues.some((clue) => clue.kind === "NOT_PERSON_VALUE"), `${caselet.caseletId} Medium caselet lacks an exclusion clue`);
    assert.ok(caselet.clues.filter((clue) => clue.kind === "PERSON_VALUE").length >= 1 && caselet.clues.length >= 4, `${caselet.caseletId} Medium clue set is too short`);
  }
  if (caselet.difficultyBand === "Hard") {
    assert.ok(caselet.clues.some((clue) => clue.kind === "PERSON_EITHER"), `${caselet.caseletId} Hard caselet lacks an either-or clue`);
    assert.ok(caselet.clues.some((clue) => clue.kind === "NOT_PERSON_VALUE"), `${caselet.caseletId} Hard caselet lacks an exclusion clue`);
    assert.equal(caselet.clues.filter((clue) => clue.kind === "PERSON_VALUE").length, 1, `${caselet.caseletId} Hard caselet should retain one direct anchor`);
    assert.ok(caselet.clues.filter((clue) => clue.kind === "PERSON_EITHER").length >= 2, `${caselet.caseletId} Hard caselet is missing layered either-or deductions`);
  }
  assert.deepEqual(solveLp007({ clues: caselet.clues }), [caselet.assignment], `${caselet.caseletId} hidden assignment mismatch`);
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    assert.ok(solveLp007({ clues: caselet.clues.filter((_, index) => index !== removed) }).length > 1, `${caselet.caseletId} has a redundant clue`);
  }

  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    assert.match(child.stem, /Clues:\n/u);
    assert.match(child.stem, /each assigned one different /u);
    for (const clue of caselet.clues) assert.ok(child.stem.includes(clue.text), `${child.questionId} omits a clue from its standalone stem`);
    const evidence = child.explanation.lines.join("\n");
    assert.match(evidence, /\| .* \| .* \|/u);
    assert.match(evidence, /Step 1:/u);
    assert.match(evidence, /Step 2:/u);
    assert.doesNotMatch(`${child.stem}\n${evidence}`, /associated|centre|slot|\.\.|\bBLR\b/u);
    const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
    counts[child.correctIndex] += 1;
    qlPositionCounts.set(child.qlId, counts);
  }
}
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-slot balance failed`);
console.log("LP-007 proof passed: 100 unique variable/preference caselets, 400 child questions, either-or and exclusion clues, progressive tables and balanced answer slots.");
