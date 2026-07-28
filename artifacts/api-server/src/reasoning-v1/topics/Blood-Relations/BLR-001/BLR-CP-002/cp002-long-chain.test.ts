import assert from "node:assert/strict";

import { BLR_CP002_LONG_CHAIN_SCENARIOS } from "./cp002-long-chain-scenarios";
import { generateBlrCp002ScenarioReviewQuestion } from "./cp002-review-registry";
import { solveBlrCp002Prompt } from "./cp002-role-solver";

const SEEDS_PER_SCENARIO = 64;
const answerPositions = [0, 0, 0, 0];
const answers = new Set<string>();
const prototypes = new Set<string>();
const presentations = new Set<string>();
let selfRecords = 0;
let conversationRecords = 0;
let samePersonAssertions = 0;
let onlyConstraints = 0;

assert.equal(BLR_CP002_LONG_CHAIN_SCENARIOS.length, 6);

for (const scenario of BLR_CP002_LONG_CHAIN_SCENARIOS) {
  for (let seed = 0; seed < SEEDS_PER_SCENARIO; seed += 1) {
    const question = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    const reproduced = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    assert.deepEqual(reproduced, question, `${scenario.scenarioId}/${seed} is not deterministic.`);

    const expressions = [
      question.structuredPrompt.assertion.subject,
      question.structuredPrompt.assertion.reference,
      question.structuredPrompt.query.subject,
      question.structuredPrompt.query.reference,
    ];
    assert.ok(
      expressions.some(
        (expression) => expression.kind === "ROLE_CHAIN" && expression.steps.length >= 4,
      ),
      `${scenario.scenarioId} does not contain a four-step expression.`,
    );

    assert.equal(question.metadata.scenarioId, scenario.scenarioId);
    assert.equal(question.metadata.answerId, scenario.expectedAnswerId);
    assert.equal(question.options[question.correctIndex]?.answerId, scenario.expectedAnswerId);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(new Set(question.options.map((option) => option.answerId)).size, 4);
    assert.ok(question.stem.length >= 100);
    assert.ok(question.stem.endsWith("?"));
    assert.ok(!question.stem.includes("undefined"));
    assert.ok(!question.stem.includes("herself or himself"));
    assert.ok(question.explanation.coreConcept && question.explanation.coreConcept.length >= 3);
    assert.ok(question.explanation.normalizedClues.length >= 4);
    assert.ok(question.explanation.familyTreeGrid?.includes("Connections:"));
    assert.ok(question.explanation.queryPath.length >= 3);
    assert.ok(question.explanation.examShortcut?.includes("one possessive role at a time"));
    assert.equal(question.explanation.distractorAnalysis?.length, 3);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.questionBankEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);

    const solved = solveBlrCp002Prompt(question.structuredPrompt);
    assert.equal(solved.answerId, scenario.expectedAnswerId);
    assert.equal(solved.assertionVerified, true);

    if (question.metadata.selfIdentity) selfRecords += 1;
    if (question.metadata.presentation === "CONVERSATION") conversationRecords += 1;
    if (question.structuredPrompt.assertion.relation.kind === "SAME_PERSON") {
      samePersonAssertions += 1;
    }
    onlyConstraints += question.metadata.onlyConstraintCount;
    answerPositions[question.correctIndex] += 1;
    answers.add(question.metadata.answerId);
    prototypes.add(question.prototypeId);
    presentations.add(question.metadata.presentation);
  }
}

assert.deepEqual(answerPositions, [96, 96, 96, 96]);
assert.deepEqual(
  [...answers].sort(),
  ["AUNT", "FATHER", "NEPHEW", "NIECE", "SELF"],
);
assert.deepEqual(
  [...prototypes].sort(),
  [
    "BLR-CP002-PROT-NESTED-QUERY-ENDPOINT",
    "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    "BLR-CP002-PROT-SELF-IDENTITY",
    "BLR-CP002-PROT-SPEAKER-TO-POINTED",
    "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
  ],
);
assert.deepEqual(
  [...presentations].sort(),
  ["CONVERSATION", "INTRODUCTION", "PHOTOGRAPH", "POINTING", "STAGE"],
);
assert.equal(selfRecords, SEEDS_PER_SCENARIO);
assert.equal(conversationRecords, SEEDS_PER_SCENARIO);
assert.ok(samePersonAssertions >= SEEDS_PER_SCENARIO * 5);
assert.ok(onlyConstraints >= SEEDS_PER_SCENARIO * 6);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      gate: "FOUR_STEP_ROLE_CHAIN_V1",
      scenarios: BLR_CP002_LONG_CHAIN_SCENARIOS.length,
      questions: BLR_CP002_LONG_CHAIN_SCENARIOS.length * SEEDS_PER_SCENARIO,
      answerPositions,
      answers: [...answers].sort(),
      prototypes: [...prototypes].sort(),
      presentations: [...presentations].sort(),
      selfRecords,
      conversationRecords,
      samePersonAssertions,
      onlyConstraints,
      permanentQlCount: 0,
      provisionalAuthorityCount: 1,
    },
    null,
    2,
  ),
);
