import assert from "node:assert/strict";
import { generateLp010Batch, solveLp010 } from "./lp-010.ts";

const caselets = generateLp010Batch("lp-010-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.people))).size >= 50, "LP-010 person-pool variation is too small");
assert.deepEqual(new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind))), new Set(["PERSON_SLOT", "PERSON_DAY", "PERSON_TIME", "BEFORE", "BETWEEN", "IMMEDIATE_BEFORE", "SAME_TIME", "SAME_DAY", "NOT_DAY"]));
assert.equal(new Set(caselets.slice(0, 12).map((caselet) => caselet.labels.times.join("|"))).size, 12, "First 12 LP-010 caselets should use distinct time pairs");
assert.ok(caselets.some((caselet) => caselet.labels.times.some((time) => time.includes(":30"))), "LP-010 should include half-hour exam schedules");
assert.ok(caselets.some((caselet) => caselet.labels.times.every((time) => time.includes(":00"))), "LP-010 should include whole-hour exam schedules");

const qlPositionCounts = new Map<string, number[]>();
for (const caselet of caselets) {
  assert.equal(caselet.people.length, 6);
  assert.equal(caselet.slots.length, 6);
  for (const person of Object.values(caselet.labels.people)) assert.ok(caselet.questionSetup.includes(person));
  for (const day of caselet.labels.days) assert.ok(caselet.questionSetup.includes(day));
  for (const time of caselet.labels.times) {
    assert.ok(caselet.questionSetup.includes(time));
    assert.match(time, /^(?:[1-9]|1[0-2]):(?:00|30) (?:AM|PM)$/u, `${caselet.caseletId} has non-standard time formatting`);
  }
  assert.notEqual(caselet.labels.times[0], caselet.labels.times[1]);
  assert.match(caselet.questionSetup, /six slots, in chronological order/u);
  assert.doesNotMatch(caselet.questionSetup, /associated|centre|city|slot setting|\.\.|\ba\.m\.|\bp\.m\./u);

  const direct = caselet.clues.filter((clue) => clue.kind === "PERSON_SLOT").length;
  const partial = caselet.clues.filter((clue) => clue.kind === "PERSON_DAY" || clue.kind === "PERSON_TIME").length;
  const relations = caselet.clues.filter((clue) => clue.kind === "BEFORE" || clue.kind === "BETWEEN" || clue.kind === "IMMEDIATE_BEFORE" || clue.kind === "SAME_TIME" || clue.kind === "SAME_DAY").length;
  const exclusions = caselet.clues.filter((clue) => clue.kind === "NOT_DAY").length;
  if (caselet.difficultyBand === "Easy") {
    assert.equal(direct, 4, `${caselet.caseletId} Easy should use four direct placements`);
    assert.equal(relations, 1, `${caselet.caseletId} Easy should require one ordering deduction`);
  }
  if (caselet.difficultyBand === "Medium") assert.ok(direct >= 1 && partial >= 1 && relations >= 1 && exclusions >= 1, `${caselet.caseletId} Medium topology is not mixed enough`);
  if (caselet.difficultyBand === "Hard") {
    assert.ok(direct <= 1, `${caselet.caseletId} Hard has too many direct slot anchors`);
    assert.ok(partial >= 1 && relations >= 3 && exclusions >= 1, `${caselet.caseletId} Hard lacks layered scheduling deductions`);
  }

  assert.deepEqual(solveLp010({ clues: caselet.clues }), [caselet.assignment], `${caselet.caseletId} hidden assignment mismatch`);
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    assert.ok(solveLp010({ clues: caselet.clues.filter((_, index) => index !== removed) }).length > 1, `${caselet.caseletId} contains a redundant clue`);
  }

  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    assert.ok(child.stem.startsWith(caselet.questionSetup));
    assert.match(child.stem, /Clues:\n/u);
    for (const clue of caselet.clues) assert.ok(child.stem.includes(clue.text), `${child.questionId} omits a clue`);
    const evidence = child.explanation.lines.join("\n");
    assert.match(evidence, /Step 1: Use the clue/u);
    assert.match(evidence, /Possible day\/time slot\(s\)/u);
    assert.match(evidence, /Read the completed schedule/u);
    assert.doesNotMatch(evidence, /use all the clues|apply all the clues|as shown above|possible complete schedules from/u);
    const counts = qlPositionCounts.get(child.qlId) ?? [0, 0, 0, 0];
    counts[child.correctIndex] += 1;
    qlPositionCounts.set(child.qlId, counts);
  }
}

assert.deepEqual(new Set(qlPositionCounts.keys()), new Set(["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"]));
for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-position balance failed`);
console.log("LP-010 proof passed: 100 day-time scheduling caselets, 400 standalone children, diverse exam-style time pairs, unique clue sets, progressive explanations and balanced answer positions.");
