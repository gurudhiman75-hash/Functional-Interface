import assert from "node:assert/strict";

import { allBlrCp002CanonicalScenarios } from "./cp002-canonical-scenario-registry";
import { generateBlrCp002ScenarioReviewQuestion } from "./cp002-review-registry";
import { solveBlrCp002Prompt } from "./cp002-role-solver";

const scenarios = allBlrCp002CanonicalScenarios();
const answerPositions = [0, 0, 0, 0];
const answers = new Set<string>();
const presentations = new Set<string>();
const reviewedScenarioIds = new Set<string>();
let onlyChildRecords = 0;
let affinalRecords = 0;
let selfRecords = 0;
let longChainRecords = 0;

assert.equal(scenarios.length, 32);
assert.equal(new Set(scenarios.map((scenario) => scenario.scenarioId)).size, 32);

for (const scenario of scenarios) {
  for (let seed = 0; seed < 4; seed += 1) {
    const question = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    const reproduced = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    assert.deepEqual(reproduced, question, `${scenario.scenarioId}/${seed} is not deterministic.`);

    assert.equal(question.metadata.scenarioId, scenario.scenarioId);
    assert.equal(question.prototypeId, scenario.prototypeId);
    assert.equal(question.metadata.answerId, scenario.expectedAnswerId);
    assert.equal(question.correctIndex, seed);
    assert.equal(question.options[seed]?.isCorrect, true);
    assert.equal(question.options[seed]?.answerId, scenario.expectedAnswerId);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.answerId)).size, 4);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.questionBankEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.ok(question.stem.endsWith("?"));
    assert.ok(!question.stem.includes("undefined"));
    assert.ok(!question.stem.includes("herself or himself"));
    assert.ok(!question.stem.includes("photograph of a man"));
    assert.ok(!question.stem.includes("photograph of a woman"));
    assert.ok(question.explanation.coreConcept && question.explanation.coreConcept.length >= 3);
    assert.ok(question.explanation.familyTreeGrid?.includes("Connections:"));
    assert.ok(question.explanation.generationAnalysis?.some((line) => line.includes("ΔGen")));
    assert.equal(question.explanation.distractorAnalysis?.length, 3);

    const solved = solveBlrCp002Prompt(question.structuredPrompt);
    assert.equal(solved.answerId, scenario.expectedAnswerId);

    const structuredText = JSON.stringify(question.structuredPrompt);
    if (structuredText.includes('"relationId":"CHILD"')) {
      onlyChildRecords += 1;
      assert.ok(question.stem.toLocaleLowerCase("en-IN").includes("only child"));
      assert.ok(
        question.explanation.coreConcept.some((line) => line.includes("exactly one")),
      );
    }

    if (
      [
        "MOTHER_IN_LAW",
        "FATHER_IN_LAW",
        "DAUGHTER_IN_LAW",
        "BROTHER_IN_LAW",
        "SISTER_IN_LAW",
        "AUNT",
        "UNCLE",
        "NIECE",
        "NEPHEW",
      ].includes(question.metadata.answerId)
    ) {
      affinalRecords += 1;
    }
    if (question.metadata.selfIdentity) selfRecords += 1;
    if (scenario.scenarioId.startsWith("CP002-LONG-")) {
      longChainRecords += 1;
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
      );
    }

    answerPositions[question.correctIndex] += 1;
    answers.add(question.metadata.answerId);
    presentations.add(question.metadata.presentation);
    reviewedScenarioIds.add(question.metadata.scenarioId);
  }
}

assert.deepEqual(answerPositions, [32, 32, 32, 32]);
assert.equal(reviewedScenarioIds.size, 32);
assert.equal(onlyChildRecords, 12);
assert.ok(affinalRecords >= 52);
assert.ok(selfRecords >= 16);
assert.equal(longChainRecords, 24);
assert.deepEqual(
  [...presentations].sort(),
  ["CONVERSATION", "INTRODUCTION", "PHOTOGRAPH", "POINTING", "STAGE"],
);
for (const answerId of [
  "SELF",
  "FATHER",
  "DAUGHTER",
  "MOTHER",
  "GRANDSON",
  "GRANDMOTHER",
  "COUSIN",
  "MOTHER_IN_LAW",
  "FATHER_IN_LAW",
  "DAUGHTER_IN_LAW",
  "BROTHER_IN_LAW",
  "SISTER_IN_LAW",
  "AUNT",
  "UNCLE",
  "NIECE",
  "NEPHEW",
]) {
  assert.ok(answers.has(answerId), `Canonical review is missing ${answerId}.`);
}

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      gate: "CANONICAL_SCENARIO_INTEGRATION_V2",
      scenarios: scenarios.length,
      questions: scenarios.length * 4,
      answerPositions,
      answers: [...answers].sort(),
      presentations: [...presentations].sort(),
      onlyChildRecords,
      affinalRecords,
      selfRecords,
      longChainRecords,
      permanentQlCount: 0,
      provisionalAuthorityCount: 1,
    },
    null,
    2,
  ),
);
