import assert from "node:assert/strict";

import { BLR_CP002_OWNERSHIP_QUESTION_SCENARIOS } from "./cp002-ownership-question-scenarios";
import { generateBlrCp002ScenarioReviewQuestion } from "./cp002-review-registry";
import { solveBlrCp002Prompt } from "./cp002-role-solver";

const SEEDS_PER_SCENARIO = 64;
const answerPositions = [0, 0, 0, 0];
const questionFormCounts = new Map<string, number>();
const semanticAnswers = new Set<string>();
const displayedCorrectAnswers = new Set<string>();
let selfRecords = 0;
let negativeConstraintRecords = 0;

const expectedDisplayByScenario: Readonly<Record<string, string>> = {
  "CP002-WHOSE-PHOTO-SPEAKERS-SON": "His son's",
  "CP002-WHOSE-PHOTO-SPEAKERS-OWN": "His own",
  "CP002-WHOSE-PORTRAIT-MOTHER-IN-LAW": "Her mother-in-law's",
};

assert.equal(BLR_CP002_OWNERSHIP_QUESTION_SCENARIOS.length, 3);

for (const scenario of BLR_CP002_OWNERSHIP_QUESTION_SCENARIOS) {
  for (let seed = 0; seed < SEEDS_PER_SCENARIO; seed += 1) {
    const question = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    const reproduced = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    assert.deepEqual(reproduced, question, `${scenario.scenarioId}/${seed} is not deterministic.`);

    assert.equal(question.metadata.scenarioId, scenario.scenarioId);
    assert.equal(question.metadata.questionForm, scenario.questionForm);
    assert.equal(question.structuredPrompt.questionForm, scenario.questionForm);
    assert.equal(question.metadata.answerId, scenario.expectedAnswerId);
    assert.equal(question.answerType, "RELATION_LABEL_OR_SELF");
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.answerId)).size, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);

    const correctOption = question.options[question.correctIndex]!;
    assert.equal(correctOption.isCorrect, true);
    assert.equal(correctOption.answerId, scenario.expectedAnswerId);
    assert.equal(correctOption.value, expectedDisplayByScenario[scenario.scenarioId]);
    assert.ok(
      question.options.every(
        (option) =>
          /^(His|Her|Their) /.test(option.value) &&
          (option.value.endsWith("'s") || option.value.endsWith(" own")),
      ),
    );

    assert.equal(question.structuredPrompt.query.subject.kind, "ANCHOR");
    assert.equal(question.structuredPrompt.query.subject.anchor, "POINTED_PERSON");
    assert.equal(question.structuredPrompt.query.reference.kind, "ANCHOR");
    assert.equal(question.structuredPrompt.query.reference.anchor, "SPEAKER");
    assert.ok(!question.stem.includes("How is "));
    assert.ok(!question.stem.includes("related to"));
    assert.ok(question.stem.endsWith("?"));
    assert.ok(!question.stem.includes("undefined"));

    if (scenario.questionForm === "WHOSE_PHOTOGRAPH") {
      assert.ok(question.stem.includes("Whose photograph was it?"));
      assert.ok(question.stem.startsWith("Pointing to a photograph of"));
      assert.ok(question.explanation.conclusion.includes("photograph"));
    } else {
      assert.ok(question.stem.includes("At whose portrait was"));
      assert.ok(question.stem.startsWith("Looking at a portrait of"));
      assert.ok(question.explanation.conclusion.includes("portrait"));
    }

    assert.ok(
      question.explanation.coreConcept?.some((line) =>
        line.includes("possessive option"),
      ),
    );
    assert.ok(
      question.explanation.examShortcut?.includes("convert the result into the possessive option form"),
    );
    assert.equal(question.explanation.distractorAnalysis?.length, 3);
    assert.ok(
      question.explanation.distractorAnalysis?.every((entry) =>
        question.options.some(
          (option) => !option.isCorrect && option.value === entry.optionValue,
        ),
      ),
    );

    const solved = solveBlrCp002Prompt(question.structuredPrompt);
    assert.equal(solved.answerId, scenario.expectedAnswerId);
    assert.equal(solved.constraintsVerified, true);
    assert.equal(solved.assertionVerified, true);

    if (question.metadata.selfIdentity) {
      selfRecords += 1;
      assert.equal(correctOption.value, "His own");
      assert.ok(
        question.explanation.coreConcept?.some((line) =>
          line.includes("choose the possessive option 'His own'"),
        ),
      );
      assert.ok(question.explanation.conclusion.includes("speaker's own"));
    }
    if (question.metadata.negativeConstraintCount > 0) {
      negativeConstraintRecords += 1;
      assert.ok(question.stem.includes("I have no brother or sister."));
    }

    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.questionBankEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);

    answerPositions[question.correctIndex] += 1;
    questionFormCounts.set(
      question.metadata.questionForm,
      (questionFormCounts.get(question.metadata.questionForm) ?? 0) + 1,
    );
    semanticAnswers.add(question.metadata.answerId);
    displayedCorrectAnswers.add(correctOption.value);
  }
}

assert.deepEqual(answerPositions, [48, 48, 48, 48]);
assert.deepEqual(
  Object.fromEntries([...questionFormCounts.entries()].sort()),
  {
    WHOSE_PHOTOGRAPH: 128,
    WHOSE_PORTRAIT: 64,
  },
);
assert.deepEqual([...semanticAnswers].sort(), ["MOTHER_IN_LAW", "SELF", "SON"]);
assert.deepEqual(
  [...displayedCorrectAnswers].sort(),
  ["Her mother-in-law's", "His own", "His son's"],
);
assert.equal(selfRecords, 64);
assert.equal(negativeConstraintRecords, 128);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      gate: "OWNERSHIP_QUESTION_RENDERER_V1",
      scenarios: BLR_CP002_OWNERSHIP_QUESTION_SCENARIOS.length,
      questions: BLR_CP002_OWNERSHIP_QUESTION_SCENARIOS.length * SEEDS_PER_SCENARIO,
      answerPositions,
      questionFormCounts: Object.fromEntries([...questionFormCounts.entries()].sort()),
      semanticAnswers: [...semanticAnswers].sort(),
      displayedCorrectAnswers: [...displayedCorrectAnswers].sort(),
      selfRecords,
      negativeConstraintRecords,
      permanentQlCount: 0,
      provisionalAuthorityCount: 1,
    },
    null,
    2,
  ),
);
