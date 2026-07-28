import assert from "node:assert/strict";

import { BLR_CP002_BOTH_DERIVED_QUERY_SCENARIOS } from "./cp002-both-derived-query-scenarios";
import { generateBlrCp002ScenarioReviewQuestion } from "./cp002-review-registry";
import { solveBlrCp002Prompt } from "./cp002-role-solver";

const SEEDS_PER_SCENARIO = 64;
const answerPositions = [0, 0, 0, 0];
const answers = new Set<string>();
let selfRecords = 0;
let onlyRecords = 0;
let bothDerivedRecords = 0;

assert.equal(BLR_CP002_BOTH_DERIVED_QUERY_SCENARIOS.length, 3);

for (const scenario of BLR_CP002_BOTH_DERIVED_QUERY_SCENARIOS) {
  for (let seed = 0; seed < SEEDS_PER_SCENARIO; seed += 1) {
    const question = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    const reproduced = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    assert.deepEqual(reproduced, question, `${scenario.scenarioId}/${seed} is not deterministic.`);

    assert.equal(question.prototypeId, "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION");
    assert.equal(question.metadata.presentation, "CONVERSATION");
    assert.equal(question.metadata.questionForm, "HOW_RELATED");
    assert.equal(question.metadata.scenarioId, scenario.scenarioId);
    assert.equal(question.metadata.answerId, scenario.expectedAnswerId);
    assert.ok(question.structuredPrompt.listenerId);
    assert.equal(question.structuredPrompt.query.subject.kind, "ROLE_CHAIN");
    assert.equal(question.structuredPrompt.query.reference.kind, "ROLE_CHAIN");
    assert.ok(question.metadata.queryRoleDepth >= 2);
    assert.ok(question.stem.includes("said to"));
    assert.ok(question.stem.includes("How is"));
    assert.ok(question.stem.includes("related to"));
    assert.ok(question.stem.endsWith("?"));
    assert.ok(!question.stem.includes("undefined"));
    assert.ok(
      question.explanation.coreConcept?.some((line) => line.startsWith("my = ")),
    );
    assert.ok(
      question.explanation.coreConcept?.some((line) => line.startsWith("your = ")),
    );
    assert.ok(question.explanation.queryPath.length >= 5);
    assert.ok(question.explanation.familyTreeGrid?.includes("Connections:"));
    assert.ok(question.explanation.generationAnalysis?.some((line) => line.includes("ΔGen")));
    assert.equal(question.explanation.distractorAnalysis?.length, 3);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.answerId)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.answerId, scenario.expectedAnswerId);

    const solved = solveBlrCp002Prompt(question.structuredPrompt);
    assert.equal(solved.answerId, scenario.expectedAnswerId);
    assert.equal(solved.constraintsVerified, true);
    assert.equal(solved.assertionVerified, true);
    assert.equal(solved.subjectExpression.expression.kind, "ROLE_CHAIN");
    assert.equal(solved.referenceExpression.expression.kind, "ROLE_CHAIN");

    if (question.metadata.selfIdentity) {
      selfRecords += 1;
      assert.equal(question.metadata.answerId, "SELF");
      assert.equal(solved.querySubjectId, solved.queryReferenceId);
      assert.equal(solved.pathLength, 0);
      assert.ok(
        question.explanation.coreConcept?.some((line) => line.includes("correct answer is Self")),
      );
    }
    if (question.metadata.onlyConstraintCount > 0) onlyRecords += 1;

    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.questionBankEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);

    bothDerivedRecords += 1;
    answerPositions[question.correctIndex] += 1;
    answers.add(question.metadata.answerId);
  }
}

assert.deepEqual(answerPositions, [48, 48, 48, 48]);
assert.deepEqual([...answers].sort(), ["MOTHER", "SELF", "SISTER"]);
assert.equal(bothDerivedRecords, 192);
assert.equal(selfRecords, 64);
assert.equal(onlyRecords, 64);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      gate: "BOTH_DERIVED_QUERY_ENDPOINTS_V1",
      scenarios: BLR_CP002_BOTH_DERIVED_QUERY_SCENARIOS.length,
      questions: BLR_CP002_BOTH_DERIVED_QUERY_SCENARIOS.length * SEEDS_PER_SCENARIO,
      answerPositions,
      answers: [...answers].sort(),
      bothDerivedRecords,
      selfRecords,
      onlyRecords,
      permanentQlCount: 0,
      provisionalAuthorityCount: 1,
    },
    null,
    2,
  ),
);
