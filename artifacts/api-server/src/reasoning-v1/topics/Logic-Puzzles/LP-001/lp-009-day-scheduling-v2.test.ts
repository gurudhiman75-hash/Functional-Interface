import assert from "node:assert/strict";
import { LP_009_ENGLISH_FREEZE_V1 } from "./lp-009-permanent-freeze.ts";
import { generateLp009Batch } from "./lp-009.ts";
import { LP_001_010_PERMANENT_QL_REGISTRY_V1 } from "./lp-001-010-permanent-ql-registry-v1.ts";
import {
  LP_009_DAY_SCHEDULING_V2_REVIEW,
  generateLp009DaySchedulingV2,
  solveLp009Day,
} from "./lp-009-day-scheduling-v2.ts";

assert.equal(LP_009_DAY_SCHEDULING_V2_REVIEW.parentEnglishFreezeAuthorityId, LP_009_ENGLISH_FREEZE_V1.authorityId);
assert.deepEqual(LP_009_DAY_SCHEDULING_V2_REVIEW.permanentQlIds, ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]);
assert.equal(LP_009_DAY_SCHEDULING_V2_REVIEW.qlAllocation, "REUSE_EXISTING_PERMANENT_QLS");
assert.equal(LP_009_DAY_SCHEDULING_V2_REVIEW.nextAvailableQlId, "LP-QL-041");
assert.equal(LP_001_010_PERMANENT_QL_REGISTRY_V1.nextAvailableQlId, "LP-QL-041");
assert.equal(LP_001_010_PERMANENT_QL_REGISTRY_V1.permanentQlCount, 40);

// The frozen V1 generator remains the month/year authority and is not silently widened.
const frozenV1 = generateLp009Batch("lp009-v1-regression-day-v2", 24);
assert.deepEqual(new Set(frozenV1.map((caselet) => caselet.mode)), new Set(["MONTH", "YEAR"]));
assert.ok(frozenV1.every((caselet) => caselet.children.every((child) => LP_009_ENGLISH_FREEZE_V1.permanentQlIds.includes(child.qlId))));

const caselets = generateLp009DaySchedulingV2("lp-009-day-v2-proof", 100);
assert.equal(caselets.length, 100);
assert.equal(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size, 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));
assert.ok(new Set(caselets.flatMap((caselet) => Object.values(caselet.labels.people))).size >= 60, "Day V2 person-pool variation is too small");

const clueKinds = new Set(caselets.flatMap((caselet) => caselet.clues.map((clue) => clue.kind)));
assert.deepEqual(clueKinds, new Set(["PERSON_DAY", "BEFORE", "BETWEEN", "ADJACENT", "NOT_DAY"]));

const qlPositionCounts = new Map<string, number[]>([
  ["LP-QL-033", [0, 0, 0, 0]],
  ["LP-QL-034", [0, 0, 0, 0]],
  ["LP-QL-035", [0, 0, 0, 0]],
  ["LP-QL-036", [0, 0, 0, 0]],
]);
let explanationReorders = 0;

for (const caselet of caselets) {
  assert.equal(caselet.mode, "DAY");
  assert.equal(caselet.people.length, 6);
  assert.equal(caselet.days.length, 6);
  assert.equal(new Set(caselet.people).size, 6);
  assert.equal(new Set(caselet.days).size, 6);
  for (const person of Object.values(caselet.labels.people)) assert.ok(caselet.questionSetup.includes(person), `${caselet.caseletId} setup omits ${person}`);
  for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]) assert.ok(caselet.questionSetup.includes(day), `${caselet.caseletId} setup omits ${day}`);
  assert.match(caselet.questionSetup, /Exactly one/u);
  assert.doesNotMatch(caselet.questionSetup, /centre|city|location|associated|solver|candidate state/iu);

  const solved = solveLp009Day({ clues: caselet.clues });
  assert.deepEqual(solved, [caselet.assignment], `${caselet.caseletId} is not uniquely solved`);
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    assert.ok(solveLp009Day({ clues: caselet.clues.filter((_, index) => index !== removed) }).length > 1, `${caselet.caseletId} has a redundant displayed clue`);
  }

  const direct = caselet.clues.filter((clue) => clue.kind === "PERSON_DAY").length;
  const relations = new Set(caselet.clues.filter((clue) => clue.kind === "BEFORE" || clue.kind === "BETWEEN" || clue.kind === "ADJACENT").map((clue) => clue.kind)).size;
  const exclusions = caselet.clues.filter((clue) => clue.kind === "NOT_DAY").length;
  if (caselet.difficultyBand === "Easy") {
    assert.ok(direct >= 3, `${caselet.caseletId} Easy lacks direct anchors`);
    assert.ok(caselet.clues.length >= 4 && caselet.clues.length <= 6);
  }
  if (caselet.difficultyBand === "Medium") {
    assert.ok(direct >= 1 && direct <= 3);
    assert.ok(relations >= 1 && exclusions >= 1);
    assert.ok(caselet.clues.length >= 5);
  }
  if (caselet.difficultyBand === "Hard") {
    assert.ok(direct <= 1, `${caselet.caseletId} Hard has too many direct placements`);
    assert.ok(relations >= 2 && exclusions >= 1, `${caselet.caseletId} Hard lacks layered relations/exclusion`);
    assert.ok(caselet.clues.length >= 5);
  }

  assert.equal(caselet.children.length, 4);
  const displayedOrder = caselet.clues.map((clue) => clue.text);
  for (const child of caselet.children) {
    assert.ok(LP_009_DAY_SCHEDULING_V2_REVIEW.permanentQlIds.includes(child.qlId));
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
    assert.ok(child.stem.startsWith(caselet.questionSetup));
    assert.match(child.stem, /Clues:\n/u);
    for (const person of Object.values(caselet.labels.people)) assert.ok(child.stem.includes(person), `${child.questionId} omits ${person}`);
    for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]) assert.ok(child.stem.includes(day), `${child.questionId} omits ${day}`);
    for (const clue of caselet.clues) assert.ok(child.stem.includes(clue.text), `${child.questionId} omits displayed clue '${clue.text}'`);

    const explanation = child.explanation.lines.join("\n\n");
    assert.match(explanation, /\|---\|---\|/u);
    assert.match(explanation, /Step 1/u);
    assert.match(explanation, /Complete the schedule/u);
    assert.match(explanation, /Answer the question/u);
    assert.doesNotMatch(explanation, /remaining possibilities from|candidate states|solver found|associated/iu);
    const firstUsed = displayedOrder.findIndex((clue) => explanation.indexOf(clue) >= 0);
    if (firstUsed > 0) explanationReorders += 1;

    const counts = qlPositionCounts.get(child.qlId)!;
    counts[child.correctIndex] += 1;
  }
}

for (const [qlId, counts] of qlPositionCounts) assert.deepEqual(counts, [25, 25, 25, 25], `${qlId} answer-position balance failed`);
assert.ok(explanationReorders >= 80, `Dependency-driven explanation order is not visibly exercised enough (${explanationReorders}/400 children)`);

console.log("LP-009 Day Scheduling V2 proof passed: 100 source-backed day-only caselets, 400 standalone children, permanent QL reuse, unique/essential clues, structural difficulty, progressive explanations and balanced answers.");
