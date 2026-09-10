import assert from "node:assert/strict";
import { generateLp009Batch, LP_009_REVIEW_PACKAGE, solveLp009 } from "./lp-009.ts";
import { LP_009_ENGLISH_FREEZE_V1, LP_009_PERMANENT_QL_ALLOCATIONS } from "./lp-009-permanent-freeze.ts";

const expectedAllocations = [
  ["LP-QL-033", "VALUE_TO_ENTITY_LOOKUP"],
  ["LP-QL-034", "ENTITY_TO_VALUE_LOOKUP"],
  ["LP-QL-035", "ORDERED_PAIR_MATCH"],
  ["LP-QL-036", "ORDERED_POSITION_ENTITY_LOOKUP"],
] as const;

assert.deepEqual(
  LP_009_PERMANENT_QL_ALLOCATIONS.map(({ qlId, authorityId }) => [qlId, authorityId]),
  expectedAllocations,
  "LP-009 permanent QL ownership changed",
);
assert.deepEqual(LP_009_ENGLISH_FREEZE_V1.permanentQlIds, LP_009_REVIEW_PACKAGE.qlIds);
assert.equal(LP_009_ENGLISH_FREEZE_V1.permanentQlCount, 4);
assert.equal(LP_009_ENGLISH_FREEZE_V1.permanentQlAllocationStatus, "ALLOCATED");
assert.equal(LP_009_ENGLISH_FREEZE_V1.englishFreezeStatus, "FROZEN");
assert.equal(LP_009_ENGLISH_FREEZE_V1.approvedEditorialAuthority, "LP-009-ENGLISH-EDITORIAL-APPROVAL-V2");
assert.equal(LP_009_ENGLISH_FREEZE_V1.nextAvailableQlId, "LP-QL-037");

// Permanent QL allocation does not unlock any delivery gate.
assert.equal(LP_009_ENGLISH_FREEZE_V1.runtimeMode, "REVIEW_ONLY");
assert.equal(LP_009_ENGLISH_FREEZE_V1.reviewOnly, true);
assert.equal(LP_009_ENGLISH_FREEZE_V1.localizationStatus, "NOT_STARTED");
assert.equal(LP_009_ENGLISH_FREEZE_V1.questionBankWritable, false);
assert.equal(LP_009_ENGLISH_FREEZE_V1.testEligible, false);
assert.equal(LP_009_ENGLISH_FREEZE_V1.mockTestEligible, false);
assert.equal(LP_009_ENGLISH_FREEZE_V1.publiclyPublishable, false);
assert.equal(LP_009_ENGLISH_FREEZE_V1.automaticStudentPublication, false);

const caselets = generateLp009Batch("lp-009-permanent-freeze-v1", 100);
const qlCounts = new Map<string, number>();
const qlAnswerPositions = new Map<string, number[]>();
const permanentIds = new Set(LP_009_PERMANENT_QL_ALLOCATIONS.map(({ qlId }) => qlId));

assert.equal(caselets.length, 100);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.mode)), new Set(["MONTH", "YEAR"]));
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 8);

for (const caselet of caselets) {
  assert.deepEqual(solveLp009({ clues: caselet.clues }), [caselet.assignment], `${caselet.caseletId} no longer has one unique solution`);

  for (const child of caselet.children) {
    assert.ok(permanentIds.has(child.qlId), `${child.questionId} emitted a non-permanent LP-009 QL`);
    qlCounts.set(child.qlId, (qlCounts.get(child.qlId) ?? 0) + 1);
    const positions = qlAnswerPositions.get(child.qlId) ?? [0, 0, 0, 0];
    positions[child.correctIndex] += 1;
    qlAnswerPositions.set(child.qlId, positions);

    const evidence = child.explanation.lines.join("\n\n");
    assert.match(evidence, /Step 1: Record the direct entries/u, `${child.questionId} lost the approved V2 direct-entry opening`);
    assert.match(evidence, /Step \d+: Complete the schedule/u, `${child.questionId} lost the approved V2 completed schedule`);
    assert.ok(evidence.includes(child.answer), `${child.questionId} explanation no longer states its answer`);
    assert.doesNotMatch(evidence, /use all the clues|apply all the clues|simply choose|obviously/iu);
    assert.ok((evidence.match(/\|---\|---\|/gu) ?? []).length >= 2, `${child.questionId} lost progressive explanation tables`);

    if (caselet.difficultyBand !== "Easy") {
      const applySteps = evidence.match(/Step \d+: Apply the next clue/gu) ?? [];
      const nonDirectClues = caselet.clues.filter((clue) => clue.kind !== "PERSON_VALUE").length;
      assert.equal(applySteps.length, nonDirectClues, `${child.questionId} no longer explains every non-direct clue`);
    }
  }
}

assert.equal(caselets.flatMap((caselet) => caselet.children).length, 400);
assert.deepEqual(new Set(qlCounts.keys()), permanentIds);
for (const qlId of permanentIds) {
  assert.equal(qlCounts.get(qlId), 100, `${qlId} permanent runtime count changed`);
  assert.deepEqual(qlAnswerPositions.get(qlId), [25, 25, 25, 25], `${qlId} answer-position balance changed`);
}

console.log("LP-009 permanent freeze V1 passed: four permanent QLs, 100 unique schedules, 400 approved-V2 English children, balanced answers and all delivery locks retained.");
