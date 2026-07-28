import assert from "node:assert/strict";

import { BLR_CP002_PROTOTYPE_CONTRACTS } from "./cp002-contracts";
import { generateBlrCp002ReviewQuestion } from "./cp002-review-registry";

const QUESTIONS_PER_PROTOTYPE = 80;
const answerPositions = [0, 0, 0, 0];
let selfQuestions = 0;
let onlyQuestions = 0;
let photographQuestions = 0;

for (const contract of BLR_CP002_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < QUESTIONS_PER_PROTOTYPE; seed += 1) {
    const question = generateBlrCp002ReviewQuestion(contract.prototypeId, seed);
    const reproduced = generateBlrCp002ReviewQuestion(contract.prototypeId, seed);
    assert.deepEqual(reproduced, question, `${contract.prototypeId}/${seed} editorial output is not deterministic.`);

    assert.ok(!question.stem.includes("photograph of a man"));
    assert.ok(!question.stem.includes("photograph of a woman"));
    assert.ok(!question.stem.includes("herself or himself"));
    assert.ok(!question.stem.includes("undefined"));
    assert.ok(!question.explanation.conclusion.includes("herself or himself"));
    assert.ok(!question.explanation.closestTrapRejection?.includes("herself or himself"));
    assert.ok(question.stem.endsWith("?"));
    assert.equal((question.stem.match(/How is /g) ?? []).length, 1);

    const speakerName =
      question.structuredPrompt.personNames[question.structuredPrompt.speakerId] ??
      question.structuredPrompt.speakerId;
    if (question.metadata.selfIdentity) {
      selfQuestions += 1;
      assert.equal(question.metadata.presentation, "PHOTOGRAPH");
      assert.equal(question.structuredPrompt.presentation, "PHOTOGRAPH");
      assert.ok(question.stem.includes("the person in the photograph"));
      assert.ok(!question.stem.includes(`How is ${speakerName} related to ${speakerName}?`));
      assert.ok(question.explanation.conclusion.includes("the speaker her") || question.explanation.conclusion.includes("the speaker him"));
      assert.ok(
        question.explanation.coreConcept?.some((line) => line.includes("correct answer is Self")),
      );
      assert.ok(
        question.explanation.queryPath.some((line) => line.includes("same identity")),
      );
    }

    if (question.metadata.onlyConstraintCount > 0) {
      onlyQuestions += 1;
      assert.ok(
        question.explanation.coreConcept?.some((line) => line.includes("exactly one")),
      );
    } else {
      assert.ok(
        !question.explanation.coreConcept?.some((line) => line.startsWith("An 'only' role")),
      );
    }

    if (question.metadata.presentation === "PHOTOGRAPH") {
      photographQuestions += 1;
      assert.ok(question.stem.includes("in a photograph"));
    }

    assert.ok(question.explanation.coreConcept && question.explanation.coreConcept.length >= 3);
    assert.ok(question.explanation.normalizedClues.length >= 3);
    assert.ok(question.explanation.familyTreeGrid?.includes("Connections:"));
    assert.ok(question.explanation.generationAnalysis?.some((line) => line.includes("ΔGen")));
    assert.ok(question.explanation.examShortcut?.includes("S for speaker"));
    assert.equal(question.explanation.distractorAnalysis?.length, 3);
    assert.equal(
      new Set(question.explanation.distractorAnalysis?.map((entry) => entry.optionValue)).size,
      3,
    );
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    answerPositions[question.correctIndex] += 1;
  }
}

assert.deepEqual(answerPositions, [100, 100, 100, 100]);
assert.ok(selfQuestions > 0);
assert.ok(onlyQuestions > 0);
assert.ok(photographQuestions > 0);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      gate: "ENGLISH_EDITORIAL_V1",
      questions: BLR_CP002_PROTOTYPE_CONTRACTS.length * QUESTIONS_PER_PROTOTYPE,
      answerPositions,
      selfQuestions,
      onlyQuestions,
      photographQuestions,
      permanentQlCount: 0,
    },
    null,
    2,
  ),
);
