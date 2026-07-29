import assert from "node:assert/strict";

import { SeededRandom } from "../foundation/prng";
import {
  BLR_CP002_NEGATIVE_SIBLING_SCENARIOS,
  type BlrCp002ConstrainedScenarioTemplate,
} from "./cp002-negative-sibling-scenarios";
import { generateBlrCp002ScenarioReviewQuestion } from "./cp002-review-registry";
import {
  buildCp002StructuredPrompt,
  cp002Anchor,
  cp002Chain,
  cp002Step,
} from "./cp002-scenario-library";
import { solveBlrCp002Prompt } from "./cp002-role-solver";

const SEEDS_PER_SCENARIO = 64;
const answerPositions = [0, 0, 0, 0];
const answers = new Set<string>();
const presentations = new Set<string>();
let positiveRecords = 0;
let negativeRejections = 0;
let selfRecords = 0;

assert.equal(BLR_CP002_NEGATIVE_SIBLING_SCENARIOS.length, 3);

for (const scenario of BLR_CP002_NEGATIVE_SIBLING_SCENARIOS) {
  for (let seed = 0; seed < SEEDS_PER_SCENARIO; seed += 1) {
    const question = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    const reproduced = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    assert.deepEqual(reproduced, question, `${scenario.scenarioId}/${seed} is not deterministic.`);

    assert.equal(question.metadata.scenarioId, scenario.scenarioId);
    assert.equal(question.metadata.answerId, scenario.expectedAnswerId);
    assert.equal(question.metadata.negativeConstraintCount, 1);
    assert.equal(question.metadata.constraintsVerified, true);
    assert.equal(question.structuredPrompt.constraints?.length, 1);
    assert.equal(question.structuredPrompt.constraints?.[0]?.relationId, "SIBLING");
    assert.equal(question.structuredPrompt.constraints?.[0]?.cardinality, "NONE");
    assert.ok(question.stem.includes("I have no brother or sister."));
    assert.ok(question.stem.endsWith("?"));
    assert.ok(!question.stem.includes("undefined"));
    assert.ok(
      question.explanation.coreConcept?.some((line) =>
        line.includes("sibling set must contain zero people"),
      ),
    );
    assert.ok(
      !question.explanation.coreConcept?.some((line) =>
        line.startsWith("An 'only' role"),
      ),
    );
    assert.ok(
      question.explanation.normalizedClues.some((line) =>
        line.includes("has no brother or sister"),
      ),
    );
    assert.ok(question.explanation.examShortcut?.includes("Mark no-sibling facts"));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.answerId)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.answerId, scenario.expectedAnswerId);
    assert.equal(question.explanation.distractorAnalysis?.length, 3);

    const solved = solveBlrCp002Prompt(question.structuredPrompt);
    assert.equal(solved.answerId, scenario.expectedAnswerId);
    assert.equal(solved.constraintsVerified, true);
    assert.equal(solved.constraintTrace.length, 1);
    assert.ok(solved.constraintTrace[0]?.includes("has no brother or sister"));

    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.questionBankEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);

    if (question.metadata.selfIdentity) selfRecords += 1;
    positiveRecords += 1;
    answerPositions[question.correctIndex] += 1;
    answers.add(question.metadata.answerId);
    presentations.add(question.metadata.presentation);
  }
}

const invalidScenario: BlrCp002ConstrainedScenarioTemplate = {
  scenarioId: "CP002-NO-SIBLING-REJECT-HIDDEN-BROTHER",
  prototypeId: "BLR-CP002-PROT-SELF-IDENTITY",
  presentation: "PHOTOGRAPH",
  sourcePattern: "PHOTO",
  clues: [
    { subjectId: "S", relationId: "SON", referenceId: "F" },
    { subjectId: "F", relationId: "FATHER", referenceId: "S" },
    { subjectId: "B", relationId: "SON", referenceId: "F" },
    { subjectId: "F", relationId: "FATHER", referenceId: "B" },
  ],
  speakerId: "S",
  pointedPersonId: "S",
  constraints: [
    {
      reference: cp002Anchor("SPEAKER"),
      relationId: "SIBLING",
      cardinality: "NONE",
    },
  ],
  assertion: {
    subject: cp002Anchor("POINTED_PERSON"),
    relation: { kind: "KINSHIP", relationId: "SON", quantifier: "ANY" },
    reference: cp002Chain("SPEAKER", cp002Step("FATHER")),
  },
  query: {
    subject: cp002Anchor("POINTED_PERSON"),
    reference: cp002Anchor("SPEAKER"),
  },
  expectedAnswerId: "SELF",
};

for (let seed = 0; seed < SEEDS_PER_SCENARIO; seed += 1) {
  const basePrompt = buildCp002StructuredPrompt(
    invalidScenario,
    new SeededRandom(seed ^ 0x51b11),
  );
  const prompt = {
    ...basePrompt,
    constraints: invalidScenario.constraints,
  };
  assert.throws(
    () => solveBlrCp002Prompt(prompt),
    /required to have no brother or sister/i,
    `Hidden-brother model ${seed} did not invalidate the no-sibling fact.`,
  );
  negativeRejections += 1;
}

assert.deepEqual(answerPositions, [48, 48, 48, 48]);
assert.deepEqual([...answers].sort(), ["MOTHER", "SELF", "SON"]);
assert.deepEqual([...presentations].sort(), ["PHOTOGRAPH", "POINTING"]);
assert.equal(positiveRecords, 192);
assert.equal(negativeRejections, 64);
assert.equal(selfRecords, 64);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      gate: "NEGATIVE_SIBLING_CONSTRAINT_V1",
      positiveScenarios: BLR_CP002_NEGATIVE_SIBLING_SCENARIOS.length,
      positiveQuestions: positiveRecords,
      negativeSiblingModels: 1,
      negativeRejections,
      totalQuestions: positiveRecords + negativeRejections,
      answerPositions,
      answers: [...answers].sort(),
      presentations: [...presentations].sort(),
      selfRecords,
      permanentQlCount: 0,
      provisionalAuthorityCount: 1,
    },
    null,
    2,
  ),
);
