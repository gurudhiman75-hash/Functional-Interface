import assert from "node:assert/strict";

import { SeededRandom, stableHash } from "../foundation/prng";
import { BLR_CP002_ONLY_CHILD_SCENARIOS } from "./cp002-only-child-scenarios";
import {
  buildCp002StructuredPrompt,
  cp002Anchor,
  cp002Chain,
  cp002Step,
  type BlrCp002ScenarioTemplate,
} from "./cp002-scenario-library";
import {
  cp002AssertionOnlyConstraintCount,
  solveBlrCp002Prompt,
} from "./cp002-role-solver";
import { BLR_CP002_SOURCE_WIDENING_SCENARIOS } from "./cp002-source-widening-scenarios";

const SEEDS_PER_SCENARIO = 64;
const POSITIVE_SCENARIOS = [
  ...BLR_CP002_SOURCE_WIDENING_SCENARIOS,
  ...BLR_CP002_ONLY_CHILD_SCENARIOS,
] as const;
const answerCounts = new Map<string, number>();
const presentationCounts = new Map<string, number>();
let onlyAssertions = 0;
let samePersonAssertions = 0;
let selfCases = 0;
let onlyChildPositiveCases = 0;
let onlyChildRejections = 0;

for (const scenario of POSITIVE_SCENARIOS) {
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
    if (solution.answerId === "SELF") {
      selfCases += 1;
      assert.equal(solution.querySubjectId, solution.queryReferenceId);
      assert.equal(solution.pathLength, 0);
    } else {
      assert.notEqual(solution.querySubjectId, solution.queryReferenceId);
      assert.ok(solution.pathLength >= 1);
    }
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
    if (
      JSON.stringify(prompt.assertion).includes('"relationId":"CHILD"') ||
      JSON.stringify(prompt.query).includes('"relationId":"CHILD"')
    ) {
      onlyChildPositiveCases += 1;
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
  "DAUGHTER",
  "MOTHER",
  "SELF",
]) {
  assert.equal(
    answerCounts.get(answerId),
    SEEDS_PER_SCENARIO,
    `${answerId} source-widening coverage is incomplete.`,
  );
}

const ambiguousOnlyChildScenario: BlrCp002ScenarioTemplate = {
  scenarioId: "CP002-ONLY-CHILD-REJECT-TWO-CHILDREN",
  prototypeId: "BLR-CP002-PROT-SELF-IDENTITY",
  presentation: "PHOTOGRAPH",
  sourcePattern: "PHOTO",
  clues: [
    { subjectId: "F", relationId: "FATHER", referenceId: "S" },
    { subjectId: "S", relationId: "DAUGHTER", referenceId: "F" },
    { subjectId: "F", relationId: "FATHER", referenceId: "B" },
    { subjectId: "B", relationId: "SON", referenceId: "F" },
  ],
  speakerId: "S",
  pointedPersonId: "S",
  assertion: {
    subject: cp002Anchor("POINTED_PERSON"),
    relation: { kind: "SAME_PERSON" },
    reference: cp002Chain(
      "SPEAKER",
      cp002Step("FATHER"),
      cp002Step("CHILD", "ONLY"),
    ),
  },
  query: {
    subject: cp002Anchor("POINTED_PERSON"),
    reference: cp002Anchor("SPEAKER"),
  },
  expectedAnswerId: "SELF",
};

for (let seed = 0; seed < SEEDS_PER_SCENARIO; seed += 1) {
  const random = new SeededRandom(seed ^ 0x0c11d);
  const prompt = buildCp002StructuredPrompt(ambiguousOnlyChildScenario, random);
  assert.throws(
    () => solveBlrCp002Prompt(prompt),
    /exactly one child/i,
    `Two-child ONLY_CHILD case ${seed} was not rejected.`,
  );
  onlyChildRejections += 1;
}

assert.ok(onlyAssertions > 0);
assert.ok(samePersonAssertions > 0);
assert.equal(selfCases, SEEDS_PER_SCENARIO);
assert.equal(onlyChildPositiveCases, BLR_CP002_ONLY_CHILD_SCENARIOS.length * SEEDS_PER_SCENARIO);
assert.equal(onlyChildRejections, SEEDS_PER_SCENARIO);
assert.deepEqual(
  [...presentationCounts.keys()].sort(),
  ["INTRODUCTION", "PHOTOGRAPH", "POINTING", "STAGE"],
);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      gate: "SOURCE_WIDENING_AFFINAL_ONLY_CHILD_V2",
      positiveScenarios: POSITIVE_SCENARIOS.length,
      positiveQuestions: POSITIVE_SCENARIOS.length * SEEDS_PER_SCENARIO,
      negativeOnlyChildQuestions: onlyChildRejections,
      totalQuestions:
        POSITIVE_SCENARIOS.length * SEEDS_PER_SCENARIO + onlyChildRejections,
      answerCounts: Object.fromEntries([...answerCounts.entries()].sort()),
      presentationCounts: Object.fromEntries([...presentationCounts.entries()].sort()),
      onlyAssertions,
      samePersonAssertions,
      selfCases,
      onlyChildPositiveCases,
      onlyChildRejections,
      permanentQlCount: 0,
      provisionalAuthorityCount: 1,
    },
    null,
    2,
  ),
);
