import assert from "node:assert/strict";

import { allBlrCp002CanonicalScenarios } from "./cp002-canonical-scenario-registry";
import { generateBlrCp002ScenarioReviewQuestion } from "./cp002-review-registry";
import { solveBlrCp002Prompt } from "./cp002-role-solver";
import type { BlrEntityExpression } from "./cp002-types";

const scenarios = allBlrCp002CanonicalScenarios();
const answerPositions = [0, 0, 0, 0];
const answers = new Set<string>();
const presentations = new Set<string>();
const questionForms = new Set<string>();
const reviewedScenarioIds = new Set<string>();
let onlyChildRecords = 0;
let affinalRecords = 0;
let selfRecords = 0;
let longChainRecords = 0;
let threeAnchorRecords = 0;
let bothDerivedRecords = 0;
let noSiblingScenarioRecords = 0;
let negativeConstraintRecords = 0;
let ownershipRecords = 0;

function expressionHasOnlyChild(expression: BlrEntityExpression): boolean {
  return (
    expression.kind === "ROLE_CHAIN" &&
    expression.steps.some(
      (step) => step.relationId === "CHILD" && step.quantifier === "ONLY",
    )
  );
}

assert.equal(scenarios.length, 45);
assert.equal(new Set(scenarios.map((scenario) => scenario.scenarioId)).size, 45);

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
    if (question.metadata.questionForm === "HOW_RELATED") {
      assert.ok(!question.stem.includes("photograph of a man"));
      assert.ok(!question.stem.includes("photograph of a woman"));
      assert.ok(question.stem.includes("How is"));
    } else {
      ownershipRecords += 1;
      assert.ok(!question.stem.includes("How is"));
      assert.ok(
        question.stem.includes("Whose photograph was it?") ||
          question.stem.includes("At whose portrait was"),
      );
      assert.ok(
        question.options.every(
          (option) =>
            /^(His|Her|Their) /.test(option.value) &&
            (option.value.endsWith("'s") || option.value.endsWith(" own")),
        ),
      );
      assert.ok(
        question.explanation.coreConcept?.some((line) => line.includes("possessive option")),
      );
    }
    assert.ok(question.explanation.coreConcept && question.explanation.coreConcept.length >= 3);
    assert.ok(question.explanation.familyTreeGrid?.includes("Connections:"));
    assert.ok(question.explanation.generationAnalysis?.some((line) => line.includes("ΔGen")));
    assert.equal(question.explanation.distractorAnalysis?.length, 3);

    const solved = solveBlrCp002Prompt(question.structuredPrompt);
    assert.equal(solved.answerId, scenario.expectedAnswerId);
    assert.equal(solved.constraintsVerified, true);

    const expressions = [
      question.structuredPrompt.assertion.subject,
      question.structuredPrompt.assertion.reference,
      question.structuredPrompt.query.subject,
      question.structuredPrompt.query.reference,
    ];
    const assertionHasOnlyChild =
      question.structuredPrompt.assertion.relation.kind === "KINSHIP" &&
      question.structuredPrompt.assertion.relation.relationId === "CHILD" &&
      question.structuredPrompt.assertion.relation.quantifier === "ONLY";
    if (assertionHasOnlyChild || expressions.some(expressionHasOnlyChild)) {
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
      assert.ok(
        expressions.some(
          (expression) => expression.kind === "ROLE_CHAIN" && expression.steps.length >= 4,
        ),
      );
    }
    if (scenario.scenarioId.startsWith("CP002-THREE-ANCHOR-")) {
      threeAnchorRecords += 1;
      const listenerId = question.structuredPrompt.listenerId!;
      const pointedPersonId = question.structuredPrompt.pointedPersonId!;
      const listenerName = question.structuredPrompt.personNames[listenerId] ?? listenerId;
      assert.ok(pointedPersonId);
      assert.ok(question.stem.includes(listenerName));
      assert.ok(
        question.stem.includes(`to ${listenerName}`) ||
          question.stem.includes(`said to ${listenerName}`),
      );
      assert.ok(
        question.explanation.coreConcept.some((line) => line === `your = ${listenerName}`),
      );
    }
    if (scenario.scenarioId.startsWith("CP002-BOTH-DERIVED-")) {
      bothDerivedRecords += 1;
      assert.equal(question.structuredPrompt.query.subject.kind, "ROLE_CHAIN");
      assert.equal(question.structuredPrompt.query.reference.kind, "ROLE_CHAIN");
      assert.ok(question.metadata.queryRoleDepth >= 2);
    }
    if (scenario.scenarioId.startsWith("CP002-NO-SIBLING-")) {
      noSiblingScenarioRecords += 1;
    }
    if (question.metadata.negativeConstraintCount > 0) {
      negativeConstraintRecords += 1;
      assert.equal(question.metadata.negativeConstraintCount, 1);
      assert.equal(question.metadata.constraintsVerified, true);
      assert.ok(question.stem.includes("I have no brother or sister."));
      assert.ok(
        question.explanation.normalizedClues.some((line) =>
          line.includes("has no brother or sister"),
        ),
      );
    } else {
      assert.equal(question.metadata.negativeConstraintCount, 0);
    }

    answerPositions[question.correctIndex] += 1;
    answers.add(question.metadata.answerId);
    presentations.add(question.metadata.presentation);
    questionForms.add(question.metadata.questionForm);
    reviewedScenarioIds.add(question.metadata.scenarioId);
  }
}

assert.deepEqual(answerPositions, [45, 45, 45, 45]);
assert.equal(reviewedScenarioIds.size, 45);
assert.equal(onlyChildRecords, 12);
assert.ok(affinalRecords >= 64);
assert.ok(selfRecords >= 28);
assert.equal(longChainRecords, 24);
assert.equal(threeAnchorRecords, 16);
assert.equal(bothDerivedRecords, 12);
assert.equal(noSiblingScenarioRecords, 12);
assert.equal(negativeConstraintRecords, 20);
assert.equal(ownershipRecords, 12);
assert.deepEqual(
  [...presentations].sort(),
  ["CONVERSATION", "INTRODUCTION", "PHOTOGRAPH", "POINTING", "STAGE"],
);
assert.deepEqual(
  [...questionForms].sort(),
  ["HOW_RELATED", "WHOSE_PHOTOGRAPH", "WHOSE_PORTRAIT"],
);
for (const answerId of [
  "SELF",
  "FATHER",
  "SON",
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
      gate: "CANONICAL_SCENARIO_INTEGRATION_V6",
      scenarios: scenarios.length,
      questions: scenarios.length * 4,
      answerPositions,
      answers: [...answers].sort(),
      presentations: [...presentations].sort(),
      questionForms: [...questionForms].sort(),
      onlyChildRecords,
      affinalRecords,
      selfRecords,
      longChainRecords,
      threeAnchorRecords,
      bothDerivedRecords,
      noSiblingScenarioRecords,
      negativeConstraintRecords,
      ownershipRecords,
      permanentQlCount: 0,
      provisionalAuthorityCount: 1,
    },
    null,
    2,
  ),
);
