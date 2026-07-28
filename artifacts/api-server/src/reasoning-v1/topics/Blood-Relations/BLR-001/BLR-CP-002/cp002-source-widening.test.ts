import assert from "node:assert/strict";

import { SeededRandom, stableHash } from "../foundation/prng";
import { buildCp002StructuredPrompt } from "./cp002-scenario-library";
import { cp002AssertionOnlyConstraintCount, solveBlrCp002Prompt } from "./cp002-role-solver";
import { BLR_CP002_SOURCE_WIDENING_SCENARIOS } from "./cp002-source-widening-scenarios";

const SEEDS_PER_SCENARIO = 64;
const answerCounts = new Map<string, number>();
const presentationCounts = new Map<string, number>();
let onlyAssertions = 0;
let samePersonAssertions = 0;

for (const scenario of BLR_CP002_SOURCE_WIDENING_SCENARIOS) {
  for (let seed = 0; seed < SEEDS_PER_SCENARIO; seed += 1) {
    const random = new SeededRandom(
      seed ^ Number.parseInt(stableHash([scenario.scenarioId]), 16),
    );
    const prompt = buildCp002StructuredPrompt(scenario, random);
    const solution = solveBlrCp002Prompt(prompt);

    assert.equal(
      solution.answerId,
      scenario.expectedAnswerId,
      `${scenario.scenarioId}/${seed} returned ${solution.answerId}.`,
    );
    assert.equal(solution.assertionVerified, true);
    assert.notEqual(solution.querySubjectId, solution.queryReferenceId);
    assert.ok(solution.pathLength >= 2);
    assert.ok(prompt.personNames[prompt.speakerId]);
    assert.ok(prompt.pointedPersonId && prompt.personNames[prompt.pointedPersonId]);

    answerCounts.set(
      solution.answerId,
      (answerCounts.get(solution.answerId) ?? 0) + 1,
    );
    presentationCounts.set(
      prompt.presentation,
      (presentationCounts.get(prompt.presentation) ?? 0) + 1,
    );
    if (cp002AssertionOnlyConstraintCount(prompt.assertion) > 0) {
      onlyAssertions += 1;
    }
    if (prompt.assertion.relation.kind === "SAME_PERSON") {
      samePersonAssertions += 1;
    }
  }
}

for (const answerId of [
  "MOTHER_IN_LAW",
  "DAUGHTER_IN_LAW",
  "FATHER_IN_LAW",
  "SISTER_IN_LAW",
  "BROTHER_IN_LAW",
  "AUNT",
  "NIECE",
  "UNCLE",
  "NEPHEW",
]) {
  assert.equal(
    answerCounts.get(answerId),
    SEEDS_PER_SCENARIO,
    `${answerId} source-widening coverage is incomplete.`,
  );
}

assert.ok(onlyAssertions > 0);
assert.ok(samePersonAssertions > 0);
assert.deepEqual(
  [...presentationCounts.keys()].sort(),
  ["INTRODUCTION", "PHOTOGRAPH", "POINTING", "STAGE"],
);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      gate: "SOURCE_WIDENING_AFFINAL_V1",
      scenarios: BLR_CP002_SOURCE_WIDENING_SCENARIOS.length,
      questions: BLR_CP002_SOURCE_WIDENING_SCENARIOS.length * SEEDS_PER_SCENARIO,
      answerCounts: Object.fromEntries([...answerCounts.entries()].sort()),
      presentationCounts: Object.fromEntries([...presentationCounts.entries()].sort()),
      onlyAssertions,
      samePersonAssertions,
      permanentQlCount: 0,
      provisionalAuthorityCount: 1,
    },
    null,
    2,
  ),
);
