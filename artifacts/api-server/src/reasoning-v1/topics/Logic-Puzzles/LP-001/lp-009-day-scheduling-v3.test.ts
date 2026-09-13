import assert from "node:assert/strict";
import { solveLp009Day } from "./lp-009-day-scheduling-v2.ts";
import {
  LP_009_DAY_SCHEDULING_V3_REVIEW,
  generateLp009DaySchedulingV3,
  lp009DayV3TopologyAcceptable,
} from "./lp-009-day-scheduling-v3.ts";

const caselets = generateLp009DaySchedulingV3("lp-009-day-v3-proof", 60);

assert.equal(LP_009_DAY_SCHEDULING_V3_REVIEW.status, "HUMAN_REVIEW_CANDIDATE");
assert.equal(LP_009_DAY_SCHEDULING_V3_REVIEW.qlAllocation, "REUSE_EXISTING_PERMANENT_QLS");
assert.deepEqual(LP_009_DAY_SCHEDULING_V3_REVIEW.permanentQlIds, ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]);
assert.equal(LP_009_DAY_SCHEDULING_V3_REVIEW.questionBankWritable, false);
assert.equal(LP_009_DAY_SCHEDULING_V3_REVIEW.testEligible, false);
assert.equal(LP_009_DAY_SCHEDULING_V3_REVIEW.publiclyPublishable, false);

const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
const profileIds = new Set<string>();

for (const caselet of caselets) {
  difficultyCounts[caselet.difficultyBand] += 1;
  profileIds.add(caselet.scenarioProfileId);

  assert.ok(lp009DayV3TopologyAcceptable(caselet), `${caselet.caseletId} fails V3 topology rules.`);
  assert.ok(!caselet.questionSetup.startsWith(caselet.scenario), `${caselet.caseletId} repeats its scenario opening.`);
  assert.match(caselet.questionSetup, /Monday to Saturday/u);
  assert.match(caselet.questionSetup, /Monday, Tuesday, Wednesday, Thursday, Friday and Saturday/u);

  const solved = solveLp009Day({ clues: caselet.clues });
  assert.equal(solved.length, 1, `${caselet.caseletId} must have one unique assignment.`);

  assert.equal(caselet.children.length, 4);
  assert.deepEqual(caselet.children.map((child) => child.qlId), ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]);

  for (const child of caselet.children) {
    assert.ok(child.stem.startsWith(caselet.questionSetup), `${child.questionId} must use the cleaned setup.`);
    assert.equal(new Set(child.options).size, 4, `${child.questionId} must have four distinct options.`);
    assert.equal(child.options[child.correctIndex], child.answer, `${child.questionId} answer/index mismatch.`);
    assert.ok(child.explanation.lines.some((line) => line.includes("final table")), `${child.questionId} explanation must include a final table.`);
  }
}

assert.deepEqual(difficultyCounts, { Easy: 20, Medium: 20, Hard: 20 });
assert.ok(profileIds.size >= 4, "Expected broad scenario-profile coverage in the V3 proof batch.");

console.log(`LP-009 Day V3 proof passed: ${caselets.length} caselets / ${caselets.length * 4} child questions.`);
console.log(`Difficulty distribution: ${JSON.stringify(difficultyCounts)}; profiles: ${profileIds.size}.`);
