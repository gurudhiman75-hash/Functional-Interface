import assert from "node:assert/strict";
import { generateLpCp04Batch, LP_CP04_COUNTERFACTUAL_V1 } from "./lp-cp04-counterfactual-v1.ts";

assert.equal(LP_CP04_COUNTERFACTUAL_V1.status, "HUMAN_REVIEW_CANDIDATE");
assert.equal(LP_CP04_COUNTERFACTUAL_V1.permanentQlId, null);
assert.equal(LP_CP04_COUNTERFACTUAL_V1.runtimeMode, "REVIEW_ONLY");

const caselets = generateLpCp04Batch("lp-cp04-proof", 48);
assert.equal(caselets.length, 48);
const conditionWidths = new Set<number>();
const answerPositions = [0, 0, 0, 0];

for (const caselet of caselets) {
  const child = caselet.counterfactualChild;
  assert.equal(child.options.length, 4);
  assert.equal(new Set(child.options).size, 4, `${child.questionId}: duplicate options`);
  assert.equal(child.options[child.correctIndex], child.answer);
  assert.ok(child.conditionedStateCount >= 1 && child.conditionedStateCount < caselet.validStates.length);
  conditionWidths.add(child.conditionedStateCount);
  answerPositions[child.correctIndex] += 1;

  const conditioned = caselet.validStates.filter((state) => state[child.temporaryCondition.person] === child.temporaryCondition.group);
  assert.equal(conditioned.length, child.conditionedStateCount);
  const semanticMatches = child.options.map((option) => {
    for (const person of caselet.people) for (const group of caselet.groups) {
      if (`${person} is assigned to ${caselet.groupLabels[group]}.` !== option) continue;
      return conditioned.every((state) => state[person] === group);
    }
    throw new Error(`Unknown option ${option}`);
  });
  assert.deepEqual(semanticMatches.flatMap((match, index) => match ? [index] : []), [child.correctIndex], `${child.questionId}: must-be-true semantics mismatch`);
  assert.ok(child.explanation.lines.some((line) => line.includes("Additional condition")));
  assert.ok(child.explanation.lines.some((line) => line.includes("Remaining case")));
}

assert.ok(conditionWidths.size >= 2, `Expected multiple conditioned-state widths, found ${[...conditionWidths].join(",")}`);
assert.ok(answerPositions.every((count) => count >= 8), `Answer positions too concentrated: ${answerPositions.join("/")}`);

console.log(`CP04 counterfactual proof passed: ${caselets.length} caselets; conditioned widths ${[...conditionWidths].sort().join(",")}; answer positions ${answerPositions.join("/")}.`);
