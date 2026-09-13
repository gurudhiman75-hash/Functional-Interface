import assert from "node:assert/strict";
import { generateLp004BatchStabilizedV4_2 } from "./lp-001-008-stabilized-english-v4-2.ts";
import {
  generateLp004CardinalityDepthBatchV1,
  LP_004_CARDINALITY_DEPTH_V1,
  satisfiesLp004DepthClue,
  solveLp004Depth,
} from "./lp-004-cardinality-depth-v1.ts";

assert.equal(LP_004_CARDINALITY_DEPTH_V1.status, "HUMAN_REVIEW_CANDIDATE");
assert.equal(LP_004_CARDINALITY_DEPTH_V1.allocatesNewQl, false);
assert.deepEqual(LP_004_CARDINALITY_DEPTH_V1.permanentQlIds, ["LP-QL-013", "LP-QL-014", "LP-QL-015", "LP-QL-016"]);

const seed = "lp-004-cardinality-depth-proof";
const count = 60;
const base = generateLp004BatchStabilizedV4_2(seed, count);
const extended = generateLp004CardinalityDepthBatchV1(seed, count);
assert.equal(extended.length, base.length);

const familyCounts = new Map<string, number>();
const answerPositions = new Map<string, number[]>([
  ["LP-QL-013", [0, 0, 0, 0]],
  ["LP-QL-014", [0, 0, 0, 0]],
  ["LP-QL-015", [0, 0, 0, 0]],
  ["LP-QL-016", [0, 0, 0, 0]],
]);

for (let index = 0; index < count; index += 1) {
  const before = base[index]!;
  const after = extended[index]!;
  assert.deepEqual(after.assignment, before.assignment, `${after.caseletId}: hidden committee changed`);
  assert.deepEqual(after.candidates, before.candidates);
  assert.equal(after.committeeSize, 4);
  assert.deepEqual(after.sourceClues, before.clues);

  const solved = solveLp004Depth(after);
  assert.equal(solved.length, 1, `${after.caseletId}: depth clues must leave one committee`);
  assert.deepEqual(solved[0], after.assignment, `${after.caseletId}: solver result differs from hidden committee`);

  for (const clue of after.clues) {
    assert.equal(satisfiesLp004DepthClue(after.assignment, clue), true, `${after.caseletId}: displayed clue is false`);
    familyCounts.set(clue.kind, (familyCounts.get(clue.kind) ?? 0) + 1);
  }

  for (let removed = 0; removed < after.clues.length; removed += 1) {
    const trial = { ...after, clues: after.clues.filter((_, clueIndex) => clueIndex !== removed) };
    assert.ok(solveLp004Depth(trial).length > 1, `${after.caseletId}: clue ${removed + 1} is redundant`);
  }

  const newDepthClues = after.clues.filter((clue) => clue.kind === "AT_LEAST_ONE_SUBSET" || clue.kind === "SUBSET_COUNT" || clue.kind === "IF_NOT_SELECTED");
  if (after.difficultyBand === "Hard") assert.ok(newDepthClues.length >= 2, `${after.caseletId}: Hard needs at least two interacting depth clues`);
  else assert.ok(newDepthClues.length >= 1, `${after.caseletId}: Medium needs a cardinality depth clue`);

  assert.deepEqual(after.children.map((child) => child.qlId), before.children.map((child) => child.qlId));
  for (let childIndex = 0; childIndex < after.children.length; childIndex += 1) {
    const oldChild = before.children[childIndex]!;
    const child = after.children[childIndex]!;
    assert.deepEqual(child.options, oldChild.options, `${child.questionId}: options changed`);
    assert.equal(child.correctIndex, oldChild.correctIndex, `${child.questionId}: answer position changed`);
    assert.equal(child.answer, oldChild.answer, `${child.questionId}: answer changed`);
    assert.equal(new Set(child.options).size, 4);
    assert.ok(child.explanation.lines.some((line) => line.includes("Final committee")), `${child.questionId}: final table missing`);
    assert.ok(child.explanation.lines.some((line) => line.includes(child.answer)), `${child.questionId}: final answer missing`);
    answerPositions.get(child.qlId)![child.correctIndex] += 1;
  }
}

assert.ok((familyCounts.get("SUBSET_COUNT") ?? 0) >= 30, `SUBSET_COUNT too rare: ${familyCounts.get("SUBSET_COUNT") ?? 0}`);
assert.ok((familyCounts.get("IF_NOT_SELECTED") ?? 0) >= 10, `IF_NOT_SELECTED too rare: ${familyCounts.get("IF_NOT_SELECTED") ?? 0}`);
assert.ok((familyCounts.get("AT_LEAST_ONE_SUBSET") ?? 0) >= 1, "AT_LEAST_ONE_SUBSET never appears");

for (const [qlId, counts] of answerPositions) {
  assert.ok(counts.every((value) => value >= 10), `${qlId}: answer positions too concentrated ${counts.join("/")}`);
}

console.log(`LP-004 cardinality depth proof passed: ${count} caselets / ${count * 4} children.`);
console.log(`Depth-family counts: ${JSON.stringify(Object.fromEntries(familyCounts))}`);
