import assert from "node:assert/strict";
import { generateLp010Batch, LP_010_REVIEW_PACKAGE, solveLp010 } from "./lp-010.ts";
import { LP_010_ENGLISH_FREEZE_V1, LP_010_PERMANENT_QL_ALLOCATIONS } from "./lp-010-permanent-freeze.ts";

const expectedAllocations = [
  ["LP-QL-037", "PERSON_TO_DAY_TIME_LOOKUP"],
  ["LP-QL-038", "DAY_TIME_TO_PERSON_LOOKUP"],
  ["LP-QL-039", "DAY_TIME_PAIR_MATCH"],
  ["LP-QL-040", "IMMEDIATE_NEXT_PERSON_LOOKUP"],
] as const;

assert.deepEqual(
  LP_010_PERMANENT_QL_ALLOCATIONS.map(({ qlId, authorityId }) => [qlId, authorityId]),
  expectedAllocations,
  "LP-010 permanent QL ownership changed",
);
assert.deepEqual(LP_010_ENGLISH_FREEZE_V1.permanentQlIds, LP_010_REVIEW_PACKAGE.qlIds);
assert.equal(LP_010_ENGLISH_FREEZE_V1.permanentQlCount, 4);
assert.equal(LP_010_ENGLISH_FREEZE_V1.permanentQlAllocationStatus, "ALLOCATED");
assert.equal(LP_010_ENGLISH_FREEZE_V1.englishFreezeStatus, "FROZEN");
assert.equal(LP_010_ENGLISH_FREEZE_V1.approvedEditorialAuthority, "LP-010-ENGLISH-EDITORIAL-APPROVAL-V4");
assert.equal(LP_010_ENGLISH_FREEZE_V1.nextAvailableQlId, "LP-QL-041");
assert.equal(LP_010_ENGLISH_FREEZE_V1.questionStudioStatus, "PENDING_LOCALIZATION");

const caselets = generateLp010Batch("lp-010-permanent-freeze-v1", 100);
const permanentIds = new Set(LP_010_PERMANENT_QL_ALLOCATIONS.map(({ qlId }) => qlId));
const qlCounts = new Map<string, number>();
const qlAnswerPositions = new Map<string, number[]>();

assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.deepEqual(new Set(caselets.map((caselet) => caselet.labels.times.length)), new Set([2, 4, 5, 6]));
assert.equal(caselets.filter((caselet) => caselet.labels.times.length === 2).length, 25);
assert.equal(caselets.filter((caselet) => caselet.labels.times.length === 4).length, 25);
assert.equal(caselets.filter((caselet) => caselet.labels.times.length === 5).length, 25);
assert.equal(caselets.filter((caselet) => caselet.labels.times.length === 6).length, 25);

for (const caselet of caselets) {
  assert.deepEqual(solveLp010({ clues: caselet.clues }), [caselet.assignment], `${caselet.caseletId} no longer has one unique solution`);
  for (const time of caselet.labels.times) {
    const clueLinesUsingTime = caselet.clues.filter((clue) => clue.text.includes(time)).length;
    assert.ok(clueLinesUsingTime <= Math.ceil(caselet.clues.length / 2), `${caselet.caseletId} over-repeats ${time}`);
  }

  for (const child of caselet.children) {
    assert.ok(permanentIds.has(child.qlId), `${child.questionId} emitted a non-permanent LP-010 QL`);
    qlCounts.set(child.qlId, (qlCounts.get(child.qlId) ?? 0) + 1);
    const positions = qlAnswerPositions.get(child.qlId) ?? [0, 0, 0, 0];
    positions[child.correctIndex] += 1;
    qlAnswerPositions.set(child.qlId, positions);

    const evidence = child.explanation.lines.join("\n\n");
    assert.match(evidence, /Step 1: Use the clue/u, `${child.questionId} lost the approved explanation opening`);
    assert.match(evidence, /Read the completed schedule/u, `${child.questionId} lost the completed schedule step`);
    assert.ok(evidence.includes(child.answer), `${child.questionId} explanation no longer states its answer`);
    assert.ok((evidence.match(/\|---\|---\|/gu) ?? []).length >= 2, `${child.questionId} lost progressive explanation tables`);
    assert.doesNotMatch(evidence, /associated|centre|city|use all the clues|apply all the clues|possible complete schedules from/iu);
  }
}

assert.equal(caselets.flatMap((caselet) => caselet.children).length, 400);
assert.deepEqual(new Set(qlCounts.keys()), permanentIds);
for (const qlId of permanentIds) {
  assert.equal(qlCounts.get(qlId), 100, `${qlId} permanent runtime count changed`);
  assert.deepEqual(qlAnswerPositions.get(qlId), [25, 25, 25, 25], `${qlId} answer-position balance changed`);
}

console.log("LP-010 English freeze V1 passed: four permanent QLs, 100 unique schedules, balanced 2/4/5/6 time layouts, 400 approved-V4 children and balanced answers.");
