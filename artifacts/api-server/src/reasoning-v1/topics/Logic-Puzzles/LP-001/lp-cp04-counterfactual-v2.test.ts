import assert from "node:assert/strict";
import { generateLpCp04BatchV2, LP_CP04_COUNTERFACTUAL_V2 } from "./lp-cp04-counterfactual-v2.ts";

assert.equal(LP_CP04_COUNTERFACTUAL_V2.permanentQlId, null);
assert.equal(LP_CP04_COUNTERFACTUAL_V2.status, "HUMAN_REVIEW_CANDIDATE_V2");
assert.deepEqual(LP_CP04_COUNTERFACTUAL_V2.supportedDifficulties, ["Easy", "Medium", "Hard"]);

const batch = generateLpCp04BatchV2("lp-cp04-v2-proof", 18);
const difficultyCounts = new Map<string, number>();
const answerSlots = [0, 0, 0, 0];

function parse(caselet: (typeof batch)[number], text: string) {
  const match = text.match(/^(.+) is assigned to (.+)\.$/u);
  assert.ok(match, `${text}: proposition surface is not parseable`);
  const person = match[1]!;
  const group = caselet.groups.find((id) => caselet.groupLabels[id] === match[2]);
  assert.ok(group, `${text}: group label is not recognized`);
  return { person, group };
}

for (const caselet of batch) {
  const child = caselet.counterfactualChild;
  difficultyCounts.set(caselet.difficultyBand, (difficultyCounts.get(caselet.difficultyBand) ?? 0) + 1);
  assert.equal(child.difficultyBand, caselet.difficultyBand);
  assert.equal(child.parentStateCount, caselet.validStates.length);
  assert.equal(child.options.length, 4);
  assert.equal(new Set(child.options).size, 4);
  assert.equal(child.answer, child.options[child.correctIndex]);
  answerSlots[child.correctIndex] += 1;

  const conditionPeople = new Set(child.temporaryConditions.map((condition) => condition.person));
  const states = caselet.validStates.filter((state) => child.temporaryConditions.every((condition) => state[condition.person] === condition.group));
  assert.equal(states.length, child.conditionedStateCount);
  assert.ok(child.conditionedStateCount < child.parentStateCount, `${child.questionId}: conditions do not reduce the possibility set`);

  const correct = parse(caselet, child.answer);
  assert.equal(conditionPeople.has(correct.person), false, `${child.questionId}: correct answer merely repeats a condition person`);
  assert.equal(states.every((state) => state[correct.person] === correct.group), true, `${child.questionId}: answer is not true in all conditioned states`);
  assert.equal(caselet.validStates.every((state) => state[correct.person] === correct.group), false, `${child.questionId}: answer was already forced before the additional condition`);

  for (let optionIndex = 0; optionIndex < child.options.length; optionIndex += 1) {
    if (optionIndex === child.correctIndex) continue;
    const distractor = parse(caselet, child.options[optionIndex]!);
    assert.equal(conditionPeople.has(distractor.person), false, `${child.questionId}: distractor trivially restates/contradicts a condition person`);
    assert.equal(caselet.validStates.some((state) => state[distractor.person] === distractor.group), true, `${child.questionId}: distractor was impossible even before the condition`);
    assert.equal(states.every((state) => state[distractor.person] === distractor.group), false, `${child.questionId}: distractor is also must-true after condition`);
  }

  if (caselet.difficultyBand === "Easy") {
    assert.equal(child.temporaryConditions.length, 1);
    assert.equal(child.parentStateCount, 2);
    assert.equal(child.conditionedStateCount, 1);
  }
  if (caselet.difficultyBand === "Medium") {
    assert.equal(child.temporaryConditions.length, 1);
    assert.ok(child.parentStateCount >= 3 && child.parentStateCount <= 4);
    assert.ok(child.conditionedStateCount >= 1 && child.conditionedStateCount <= 2);
  }
  if (caselet.difficultyBand === "Hard") {
    assert.equal(child.temporaryConditions.length, 2);
    assert.notEqual(child.temporaryConditions[0]!.person, child.temporaryConditions[1]!.person);
    assert.ok(child.parentStateCount >= 5, `${child.questionId}: Hard parent ambiguity is too narrow`);
    assert.ok(child.conditionedStateCount >= 1 && child.conditionedStateCount <= 2);
    for (const condition of child.temporaryConditions) {
      const singlyConditioned = caselet.validStates.filter((state) => state[condition.person] === condition.group);
      assert.equal(singlyConditioned.every((state) => state[correct.person] === correct.group), false, `${child.questionId}: one Hard condition alone already forces the answer`);
    }
  }
  assert.ok(child.explanation.lines.some((line) => line.includes("| Person | Assignment |")));
  assert.ok(child.explanation.lines.some((line) => line.includes(`${child.parentStateCount} valid arrangements`)));
  assert.ok(child.explanation.lines.at(-1)?.includes(child.answer));
  assert.match(child.explanation.summary, /original clues do not force the answer/i);
}

assert.deepEqual(difficultyCounts, new Map([["Easy", 6], ["Medium", 6], ["Hard", 6]]));
assert.ok(answerSlots.every((count) => count >= 3), `CP04 V2 answer slots too concentrated: ${answerSlots.join(",")}`);

console.log(`CP04 V2 compound-Hard difficulty and condition dependency passed: ${batch.length} caselets; answer slots ${answerSlots.join("/")}.`);
