import assert from "node:assert/strict";
import { generateLp009Batch, solveLp009 } from "./lp-009.ts";

const caselets = generateLp009Batch("lp-009-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 8);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.mode)), new Set(["MONTH", "YEAR"]));
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.people))).size >= 60, "LP-009 person pool variation is too small");
assert.ok(new Set(caselets.filter((caselet) => caselet.mode === "MONTH").flatMap((caselet) => Object.values(caselet.labels.values))).size >= 8, "LP-009 month pool variation is too small");
assert.ok(new Set(caselets.filter((caselet) => caselet.mode === "YEAR").flatMap((caselet) => Object.values(caselet.labels.values))).size >= 10, "LP-009 year pool variation is too small");
assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))), new Set(["PERSON_VALUE", "BEFORE", "BETWEEN", "ADJACENT", "NOT_VALUE", "POSITION"]));

const qlPositionCounts = new Map<string, number[]>();
for (const caselet of caselets) {
  assert.equal(caselet.people.length, 6);
  assert.equal(caselet.values.length, 6);
  assert.equal(new Set(caselet.people).size, 6);
  assert.equal(new Set(caselet.values).size, 6);
  for (const person of Object.values(caselet.labels.people)) assert.ok(caselet.questionSetup.includes(person));
  for (const value of Object.values(caselet.labels.values)) assert.ok(caselet.questionSetup.includes(value));
  assert.doesNotMatch(caselet.questionSetup, /People:|Days:|Study areas:|Cities:|associated|centre|slot|\bBLR\b|\.{2,}/u);
  if (caselet.mode === "MONTH") {
    assert.match(caselet.questionSetup, /six (?:different )?months/u);
    assert.match(caselet.questionSetup, /listed in calendar order/u);
  } else {
    assert.match(caselet.questionSetup, /six different years/u);
    assert.match(caselet.questionSetup, /no age calculation is required/u);
  }

  const direct = caselet.clues.filter((clue) => clue.kind === "PERSON_VALUE").length;
  const relations = caselet.clues.filter((clue) => clue.kind === "BEFORE" || clue.kind === "BETWEEN" || clue.kind === "ADJACENT").length;
  const exclusions = caselet.clues.filter((clue) => clue.kind === "NOT_VALUE").length;
  if (caselet.difficultyBand === "Easy") assert.equal(direct, 5, `${caselet.caseletId} Easy should use five direct entries`);
  if (caselet.difficultyBand === "Medium") {
    assert.ok(direct >= 1, `${caselet.caseletId} Medium lacks a direct anchor`);
    assert.ok(relations >= 1 && exclusions >= 1, `${caselet.caseletId} Medium lacks a mixed narrowing chain`);
  }
  if (caselet.difficultyBand === "Hard") {
    assert.ok(direct >= 1 && direct <= 3, `${caselet.caseletId} Hard should retain only a small number of direct anchors`);
    assert.ok(relations >= 2 && exclusions >= 1, `${caselet.caseletId} Hard lacks layered order restrictions`);
    if (caselet.mode === "YEAR") assert.ok(caselet.clues.some((clue) => clue.kind === "POSITION"), `${caselet.caseletId} Year Hard lacks the second-oldest position clue`);
  }

  assert.deepEqual(solveLp009({ clues: caselet.clues }), [caselet.assignment], `${caselet.caseletId} hidden assignment mismatch`);
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    assert.ok(solveLp009({ clues: caselet.clues.filter((_, index) => index !== removed) }).length > 1, `${caselet.caseletId} has a redundant clue`);
  }

  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    assert.ok(child.stem.startsWith(caselet.questionSetup));
    assert.match(child.stem, /Clues:\n/u);
    for (const clue of caselet.clues) assert.ok(child.stem.includes(clue.text), `${child.questionId} omits a clue from its standalone stem`);
    const evidence = child.explanation.lines.join("\n");
    assert.match(evidence, caselet.mode === "MONTH" ? /\| (Student|Applicant|Course|Officer) \| (Birth month|Interview month|Starting month|Review-meeting month) \|/u : /\| (Person|Officer|Researcher|Member) \| Birth year \|/u);
    assert.match(evidence, /Step 1:/u);
    assert.match(evidence, /Step 2:/u);
    assert.match(evidence, /Step \d+: Complete the schedule/u);
    assert.doesNotMatch(`${child.stem}\n${evidence}`, /associated|centre|slot|\.{2,}|\bBLR\b/u);
    const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
    counts[child.correctIndex] += 1;
    qlPositionCounts.set(child.qlId, counts);
  }
}

assert.deepEqual(new Set(qlPositionCounts.keys()), new Set(["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]));
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-slot balance failed`);
console.log("LP-009 proof passed: 100 month/year scheduling caselets, 400 standalone child questions, source-aligned clue families, progressive tables and balanced answer slots.");
