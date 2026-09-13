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
  assert.equal(child.options.length, 4);
  assert.equal(new Set(child.options).size, 4);
  assert.equal(child.answer, child.options[child.correctIndex]);
  answerSlots[child.correctIndex] += 1;

  const states = caselet.validStates.filter((state) => state[child.temporaryCondition.person] === child.temporaryCondition.group);
  assert.equal(states.length, child.conditionedStateCount);

  const correct = parse(caselet, child.answer);
  assert.notEqual(correct.person, child.temporaryCondition.person, `${child.questionId}: correct answer merely repeats the condition person`);
  assert.equal(states.every((state) => state[correct.person] === correct.group), true, `${child.questionId}: answer is not true in all conditioned states`);
  assert.equal(caselet.validStates.every((state) => state[correct.person] === correct.group), false, `${child.questionId}: answer was already forced before the additional condition`);

  for (let optionIndex = 0; optionIndex < child.options.length; optionIndex += 1) {
    if (optionIndex === child.correctIndex) continue;
    const distractor = parse(caselet, child.options[optionIndex]!);
    assert.notEqual(distractor.person, child.temporaryCondition.person, `${child.questionId}: distractor trivially restates/contradicts the condition person`);
    assert.equal(caselet.validStates.some((state) => state[distractor.person] === distractor.group), true, `${child.questionId}: distractor was impossible even before the condition`);
    assert.equal(states.every((state) => state[distractor.person] === distractor.group), false, `${child.questionId}: distractor is also must-true after condition`);
  }

  if (caselet.difficultyBand === "Easy") {
    assert.equal(child.conditionedStateCount, 1);
  }
  if (caselet.difficultyBand === "Medium") {
    assert.ok(caselet.validStates.length >= 3 && caselet.validStates.length <= 4);
    assert.equal(child.conditionedStateCount, 2);
  }
  if (caselet.difficultyBand === "Hard") {
    assert.ok(caselet.validStates.length >= 5, `${child.questionId}: Hard parent ambiguity is too narrow`);
    assert.ok(child.conditionedStateCount >= 2, `${child.questionId}: Hard should retain multiple conditioned cases`);
  }
  assert.ok(child.explanation.lines.some((line) => line.includes("| Person | Assignment |")));
  assert.ok(child.explanation.lines.at(-1)?.includes(child.answer));
  assert.match(child.explanation.summary, /original clues do not force the answer/i);
}

assert.deepEqual(difficultyCounts, new Map([["Easy", 6], ["Medium", 6], ["Hard", 6]]));
assert.ok(answerSlots.every((count) => count >= 3), `CP04 V2 answer slots too concentrated: ${answerSlots.join(",")}`);

console.log(`CP04 V2 structural difficulty and condition dependency passed: ${batch.length} caselets; answer slots ${answerSlots.join("/")}.`);
