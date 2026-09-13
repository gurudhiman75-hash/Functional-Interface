import assert from "node:assert/strict";
import { generateLpCp04BatchV2, LP_CP04_COUNTERFACTUAL_V2 } from "./lp-cp04-counterfactual-v2.ts";

assert.equal(LP_CP04_COUNTERFACTUAL_V2.permanentQlId, null);
assert.equal(LP_CP04_COUNTERFACTUAL_V2.status, "HUMAN_REVIEW_CANDIDATE_V2");
assert.deepEqual(LP_CP04_COUNTERFACTUAL_V2.supportedDifficulties, ["Easy", "Medium", "Hard"]);

const batch = generateLpCp04BatchV2("lp-cp04-v2-proof", 18);
const difficultyCounts = new Map<string, number>();
const answerSlots = [0, 0, 0, 0];

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
  const correctTruth = states.every((state) => {
    const match = child.answer.match(/^(.+) is assigned to (.+)\.$/u);
    if (!match) return false;
    const person = match[1]!;
    const group = caselet.groups.find((id) => caselet.groupLabels[id] === match[2]);
    return Boolean(group) && state[person] === group;
  });
  assert.equal(correctTruth, true, `${child.questionId}: answer is not true in all conditioned states`);

  if (caselet.difficultyBand === "Easy") assert.equal(child.conditionedStateCount, 1);
  if (caselet.difficultyBand === "Medium") assert.equal(child.conditionedStateCount, 2);
  if (caselet.difficultyBand === "Hard") assert.ok(child.conditionedStateCount >= 3);
  assert.ok(child.explanation.lines.some((line) => line.includes("| Person | Assignment |")));
  assert.ok(child.explanation.lines.at(-1)?.includes(child.answer));
}

assert.deepEqual(difficultyCounts, new Map([["Easy", 6], ["Medium", 6], ["Hard", 6]]));
assert.ok(answerSlots.every((count) => count >= 3), `CP04 V2 answer slots too concentrated: ${answerSlots.join(",")}`);

console.log(`CP04 V2 structural difficulty passed: ${batch.length} caselets; answer slots ${answerSlots.join("/")}.`);
