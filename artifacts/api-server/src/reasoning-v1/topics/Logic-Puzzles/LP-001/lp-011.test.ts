import assert from "node:assert/strict";
import { lp011ClueSatisfied, LP_011_REVIEW_PACKAGE, solveLp011 } from "./lp-011.ts";
import { generateLp011BatchStabilizedV1_1, LP_011_STABILIZED_V1_1 } from "./lp-011-stabilized-v1-1.ts";

assert.equal(LP_011_REVIEW_PACKAGE.runtimeMode, "REVIEW_ONLY");
assert.equal(LP_011_REVIEW_PACKAGE.qlAllocationStatus, "CANDIDATE_NOT_PERMANENT");
assert.deepEqual(LP_011_REVIEW_PACKAGE.qlIds, ["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044"]);
assert.equal(LP_011_STABILIZED_V1_1.status, "HUMAN_REVIEW_CANDIDATE");

const caselets = generateLp011BatchStabilizedV1_1("lp-011-proof-v1-1", 100);
assert.equal(caselets.length, 100);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.ok(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size >= 5);
assert.equal(new Set(caselets.map((caselet) => caselet.caseletId)).size, caselets.length);

const answerPositions = new Map<string, number[]>();
for (const caselet of caselets) {
  assert.equal(caselet.boxes.length, 5);
  assert.equal(caselet.positions.length, 5);
  assert.equal(caselet.attributes.length, 5);
  assert.equal(new Set(Object.values(caselet.assignment.positionByBox)).size, 5, `${caselet.caseletId} position assignment is not bijective`);
  assert.equal(new Set(Object.values(caselet.assignment.attributeByBox)).size, 5, `${caselet.caseletId} attribute assignment is not bijective`);
  assert.ok(caselet.clues.length >= 3 && caselet.clues.length <= 9, `${caselet.caseletId} clue count ${caselet.clues.length}`);
  assert.ok(caselet.clues.every((clue) => lp011ClueSatisfied(caselet.assignment, clue)), `${caselet.caseletId} has a false clue`);

  const solutions = solveLp011(caselet.clues, 3);
  assert.equal(solutions.length, 1, `${caselet.caseletId} is not uniquely solvable`);

  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    const withoutOne = caselet.clues.filter((_, index) => index !== removed);
    assert.ok(solveLp011(withoutOne, 2).length > 1, `${caselet.caseletId} contains a redundant displayed clue at ${removed + 1}`);
  }

  for (const label of Object.values(caselet.attributeLabels)) assert.match(caselet.scenario, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"));
  for (const box of caselet.boxes) assert.match(caselet.scenario, new RegExp(`\\b${box}\\b`, "u"));

  if (caselet.difficultyBand === "Hard") assert.ok(caselet.clues.every((clue) => clue.kind !== "BOX_HAS_ATTRIBUTE"), `${caselet.caseletId} Hard caselet has a direct attribute placement`);
  if (caselet.difficultyBand === "Easy") assert.ok(caselet.clues.some((clue) => ["BOX_HAS_ATTRIBUTE", "BOX_IMMEDIATELY_ABOVE_BOX", "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX", "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE"].includes(clue.kind)), `${caselet.caseletId} Easy caselet lacks a strong anchor`);

  assert.equal(caselet.children.length, 4);
  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4, `${child.questionId} duplicate options`);
    assert.equal(child.options[child.correctIndex], child.answer, `${child.questionId} correct index mismatch`);
    const explanation = child.explanation.lines.join("\n\n");
    assert.match(explanation, /\| Position from bottom \| Box \|/u);
    assert.match(explanation, /Complete the arrangement/u);
    assert.match(explanation, /Answer the question/u);
    assert.doesNotMatch(explanation, /candidate states|solver count|associated with/iu);
    const positions = answerPositions.get(child.qlId) ?? [];
    positions.push(child.correctIndex);
    answerPositions.set(child.qlId, positions);
  }
}

for (const [qlId, positions] of answerPositions) {
  const counts = [0, 0, 0, 0];
  for (const position of positions) counts[position] += 1;
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `${qlId} answer positions are not balanced: ${counts.join(",")}`);
}

console.log("LP-011 V1.1 proof passed: 100 source-backed box-and-attribute caselets, 400 questions, clue necessity, difficulty structure, option integrity and progressive explanations are green.");
