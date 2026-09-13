import assert from "node:assert/strict";
import { generateLpCp04BatchV3, LP_CP04_COUNTERFACTUAL_V3, type Lp004HardCounterfactualCaselet } from "./lp-cp04-counterfactual-v3.ts";

assert.equal(LP_CP04_COUNTERFACTUAL_V3.permanentQlId, null);
assert.equal(LP_CP04_COUNTERFACTUAL_V3.status, "HUMAN_REVIEW_CANDIDATE_V3");

const batch = generateLpCp04BatchV3("lp-cp04-v3-proof", 12);
const counts = new Map<string, number>();
const answerSlots = [0, 0, 0, 0];

for (const caselet of batch) {
  const child: any = caselet.counterfactualChild;
  counts.set(caselet.difficultyBand, (counts.get(caselet.difficultyBand) ?? 0) + 1);
  assert.equal(child.difficultyBand, caselet.difficultyBand);
  assert.equal(child.options.length, 4);
  assert.equal(new Set(child.options).size, 4);
  assert.equal(child.answer, child.options[child.correctIndex]);
  answerSlots[child.correctIndex] += 1;

  if (caselet.difficultyBand !== "Hard") {
    const grouping: any = caselet;
    assert.ok(grouping.validStates.length >= 2);
    const conditions = child.temporaryConditions;
    assert.equal(conditions.length, 1);
    const condition = conditions[0]!;
    const after = grouping.validStates.filter((state: any) => state[condition.person] === condition.group);
    assert.equal(after.length, child.conditionedStateCount);
    assert.equal(child.parentStateCount, grouping.validStates.length);

    const parse = (text: string) => {
      const match = text.match(/^(.+) is assigned to (.+)\.$/u);
      assert.ok(match);
      const group = grouping.groups.find((id: string) => grouping.groupLabels[id] === match![2]);
      assert.ok(group);
      return { person: match![1]!, group };
    };
    const correct = parse(child.answer);
    assert.notEqual(correct.person, condition.person);
    assert.equal(grouping.validStates.every((state: any) => state[correct.person] === correct.group), false);
    assert.equal(after.every((state: any) => state[correct.person] === correct.group), true);

    if (caselet.difficultyBand === "Easy") {
      assert.equal(grouping.validStates.length, 2);
      assert.equal(after.length, 1);
    } else {
      assert.ok(grouping.validStates.length >= 3 && grouping.validStates.length <= 4);
      assert.ok(after.length >= 1 && after.length <= 2);
    }
    continue;
  }

  const hard = caselet as Lp004HardCounterfactualCaselet;
  assert.equal(hard.parentTopology, "LP-004_COMMITTEE_SELECTION");
  assert.ok(hard.validStates.length >= 5, `${hard.caseletId}: Hard parent set too narrow`);
  assert.equal(child.parentStateCount, hard.validStates.length);
  assert.ok(child.conditionedStateCount >= 1 && child.conditionedStateCount <= 4);

  const condition = child.temporaryCondition;
  const after = hard.validStates.filter((state) => state[condition.candidate] === condition.selected);
  assert.equal(after.length, child.conditionedStateCount);
  assert.ok(after.length < hard.validStates.length);

  const candidateForLabel = (label: string) => hard.candidates.find((candidate) => hard.candidateLabels[candidate] === label)!;
  const correctCandidate = candidateForLabel(child.answer);
  assert.ok(correctCandidate);
  assert.notEqual(correctCandidate, condition.candidate);
  const targetValue = child.queryMode === "MUST_BE_SELECTED";
  assert.equal(hard.validStates.every((state) => state[correctCandidate] === targetValue), false, `${hard.caseletId}: Hard answer already fixed before condition`);
  assert.equal(after.every((state) => state[correctCandidate] === targetValue), true, `${hard.caseletId}: Hard answer not fixed after condition`);

  for (let optionIndex = 0; optionIndex < child.options.length; optionIndex += 1) {
    if (optionIndex === child.correctIndex) continue;
    const candidate = candidateForLabel(child.options[optionIndex]!);
    assert.notEqual(candidate, condition.candidate);
    assert.equal(hard.validStates.some((state) => state[candidate] === targetValue), true, `${hard.caseletId}: implausible Hard distractor`);
    assert.equal(after.every((state) => state[candidate] === targetValue), false, `${hard.caseletId}: Hard distractor is also must-true`);
  }
  assert.ok(child.explanation.lines.some((line: string) => line.includes(`${hard.validStates.length} valid committees`)));
}

assert.deepEqual(counts, new Map([["Easy", 4], ["Medium", 4], ["Hard", 4]]));
assert.ok(answerSlots.every((count) => count >= 2), `CP04 V3 answer slots too concentrated: ${answerSlots.join(",")}`);

console.log(`CP04 V3 mixed-parent proof passed: ${batch.length} caselets; Easy/Medium LP-001 and Hard LP-004; answer slots ${answerSlots.join("/")}.`);
