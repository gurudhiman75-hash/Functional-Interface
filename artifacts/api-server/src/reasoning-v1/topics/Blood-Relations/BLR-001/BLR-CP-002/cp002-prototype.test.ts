import assert from "node:assert/strict";

import { BLR_CP002_PROTOTYPE_CONTRACTS } from "./cp002-contracts";
import { generateBlrCp002PrototypeQuestion } from "./cp002-generator";
import { solveBlrCp002Prompt } from "./cp002-role-solver";

const QUESTIONS_PER_PROTOTYPE = 120;
const answerPositions = [0, 0, 0, 0];
const presentations = new Set<string>();
const scenarioIds = new Set<string>();
const answers = new Set<string>();
const errorLabels = new Set<string>();
const difficulties = new Set<string>();
let onlyQuestionCount = 0;
let conversationCount = 0;
let selfCount = 0;
let nestedQueryCount = 0;
let threeAnchorCount = 0;

for (const contract of BLR_CP002_PROTOTYPE_CONTRACTS) {
  const perPrototypePositions = [0, 0, 0, 0];
  for (let seed = 0; seed < QUESTIONS_PER_PROTOTYPE; seed += 1) {
    const question = generateBlrCp002PrototypeQuestion(contract.prototypeId, seed);
    const reproduced = generateBlrCp002PrototypeQuestion(contract.prototypeId, seed);
    assert.deepEqual(reproduced, question, `${contract.prototypeId}/${seed} is not deterministic.`);

    assert.equal(question.packageId, "BLR-001");
    assert.equal(question.checkpointId, "BLR-CP-002");
    assert.equal(question.prototypeId, contract.prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.questionBankEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.answerId)).size, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.options[question.correctIndex]?.answerId, question.metadata.answerId);
    assert.ok(question.stem.length > 80);
    assert.ok(!question.stem.includes("undefined"));
    assert.ok(question.stem.includes("How is"));
    assert.ok(question.stem.includes("related to"));
    assert.ok(question.explanation.coreConcept && question.explanation.coreConcept.length >= 3);
    assert.ok(question.explanation.familyTreeGrid?.includes("Generation"));
    assert.ok(question.explanation.generationAnalysis?.some((line) => line.includes("ΔGen")));
    assert.ok(question.explanation.examShortcut?.includes("speaker"));
    assert.equal(question.explanation.distractorAnalysis?.length, 3);
    assert.equal(question.metadata.assertionVerified, true);
    assert.equal(question.metadata.independentSolverAgreed, true);
    assert.equal(question.metadata.familyGraphValid, true);
    assert.equal(question.metadata.ambiguityAccepted, true);
    assert.ok(question.metadata.assertionRoleDepth + question.metadata.queryRoleDepth >= contract.minimumRoleDepth);

    if (contract.prototypeId === "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION") {
      threeAnchorCount += 1;
      assert.ok(question.structuredPrompt.listenerId);
      assert.ok(question.structuredPrompt.pointedPersonId);
      assert.notEqual(question.structuredPrompt.listenerId, question.structuredPrompt.speakerId);
      assert.notEqual(question.structuredPrompt.pointedPersonId, question.structuredPrompt.speakerId);
      assert.notEqual(question.structuredPrompt.pointedPersonId, question.structuredPrompt.listenerId);
    }

    const solvedAgain = solveBlrCp002Prompt(question.structuredPrompt);
    assert.equal(solvedAgain.answerId, question.metadata.answerId);
    assert.equal(solvedAgain.assertionVerified, true);

    for (const option of question.options) {
      if (!option.isCorrect) {
        assert.ok(option.errorLabel);
        errorLabels.add(option.errorLabel!);
      }
    }

    perPrototypePositions[question.correctIndex] += 1;
    answerPositions[question.correctIndex] += 1;
    presentations.add(question.metadata.presentation);
    scenarioIds.add(question.metadata.scenarioId);
    answers.add(question.metadata.answerId);
    difficulties.add(question.difficulty);
    if (question.metadata.onlyConstraintCount > 0) onlyQuestionCount += 1;
    if (question.metadata.presentation === "CONVERSATION") conversationCount += 1;
    if (question.metadata.selfIdentity) selfCount += 1;
    if (question.metadata.queryRoleDepth > 0) nestedQueryCount += 1;
  }
  assert.deepEqual(
    perPrototypePositions,
    [30, 30, 30, 30],
    `${contract.prototypeId} answer positions are not balanced.`,
  );
}

const expectedPerPosition = BLR_CP002_PROTOTYPE_CONTRACTS.length * 30;
assert.deepEqual(answerPositions, [expectedPerPosition, expectedPerPosition, expectedPerPosition, expectedPerPosition]);
assert.deepEqual(
  [...presentations].sort(),
  ["CONVERSATION", "INTRODUCTION", "PHOTOGRAPH", "POINTING", "STAGE"],
);
assert.ok(scenarioIds.size >= 30, `Expected broad source coverage, saw ${scenarioIds.size} scenarios.`);
assert.ok(answers.has("SELF"));
assert.ok(answers.has("SON"));
assert.ok(answers.has("MOTHER"));
assert.ok(answers.has("BROTHER"));
assert.ok(answers.has("SISTER"));
assert.ok(answers.has("GRANDSON"));
assert.ok(answers.has("GRANDMOTHER"));
assert.ok(answers.has("NEPHEW"));
assert.ok(answers.has("NIECE"));
assert.ok(answers.has("COUSIN"));
assert.ok(answers.has("BROTHER_IN_LAW"));
assert.ok(answers.has("SISTER_IN_LAW"));
assert.ok(errorLabels.has("REVERSED_QUERY_DIRECTION"));
assert.ok(errorLabels.has("WRONG_GENDER"));
assert.ok(errorLabels.has("IGNORED_SELF_IDENTITY_COLLAPSE"));
assert.ok(errorLabels.has("ROLE_CHAIN_NEAR_RELATION"));
assert.ok(difficulties.has("EASY"));
assert.ok(difficulties.has("MEDIUM"));
assert.ok(difficulties.has("HARD"));
assert.ok(onlyQuestionCount > 0);
assert.ok(conversationCount > 0);
assert.ok(selfCount > 0);
assert.ok(nestedQueryCount > 0);
assert.equal(threeAnchorCount, QUESTIONS_PER_PROTOTYPE);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      questions: BLR_CP002_PROTOTYPE_CONTRACTS.length * QUESTIONS_PER_PROTOTYPE,
      prototypes: BLR_CP002_PROTOTYPE_CONTRACTS.length,
      scenarios: scenarioIds.size,
      answerPositions,
      presentations: [...presentations].sort(),
      answers: [...answers].sort(),
      errorLabels: [...errorLabels].sort(),
      difficulties: [...difficulties].sort(),
      onlyQuestionCount,
      conversationCount,
      selfCount,
      nestedQueryCount,
      threeAnchorCount,
      permanentQlCount: 0,
    },
    null,
    2,
  ),
);
