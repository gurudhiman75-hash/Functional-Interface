import assert from "node:assert/strict";

import { reverseRelation } from "../foundation/relations";
import { INE_CP001_CONCLUSION_CONTRACTS } from "./conclusion-contracts";
import { generateIneCp001ConclusionQuestion } from "./conclusion-generator";
import { validateIneCp001ConclusionQuestion } from "./conclusion-validator";

assert.equal(INE_CP001_CONCLUSION_CONTRACTS.length, 3);
assert.equal(
  new Set(INE_CP001_CONCLUSION_CONTRACTS.map((entry) => entry.authorityId))
    .size,
  3,
);
assert.ok(
  INE_CP001_CONCLUSION_CONTRACTS.every((entry) => entry.permanentQlId === null),
);

const answerPositions = [0, 0, 0, 0];
const observedTruths = new Set<string>();
const observedAuthorities = new Set<string>();
let generatedCount = 0;
let possibleWitnessQuestions = 0;

for (const contract of INE_CP001_CONCLUSION_CONTRACTS) {
  for (let seed = 0; seed < 100; seed += 1) {
    const question = generateIneCp001ConclusionQuestion(
      contract.prototypeId,
      seed,
    );
    assert.deepEqual(
      generateIneCp001ConclusionQuestion(contract.prototypeId, seed),
      question,
      `${contract.prototypeId}/${seed} must be deterministic.`,
    );
    assert.equal(question.packageId, "INE-001");
    assert.equal(question.checkpointId, "INE-CP-001");
    assert.equal(question.authorityId, contract.authorityId);
    assert.equal(question.answerType, contract.answerType);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(
      question.metadata.runtimeVersion,
      "ine-cp001-conclusion-prototype-v2",
    );
    assert.equal(question.metadata.independentSolverAgreed, true);
    assert.equal(question.metadata.graphConsistent, true);

    assert.equal(question.options.length, 4);
    assert.equal(
      new Set(question.options.map((option) => option.value)).size,
      4,
    );
    assert.equal(
      question.options.filter((option) => option.isCorrect).length,
      1,
    );
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.metadata.distractorErrorLabels.length, 3);
    assert.equal(question.explanation.distractorAnalysis.length, 3);
    assert.equal(question.explanation.normalizedStatements.length, 0);
    assert.ok(question.explanation.ruleStatement.length > 35);
    assert.ok(question.explanation.proofSteps.length >= 1);
    assert.ok(question.explanation.conclusion.length > 40);

    const validation = validateIneCp001ConclusionQuestion(question);
    assert.equal(validation.valid, true, validation.errors.join(" "));

    if (contract.authorityId === "EVALUATE_SINGLE_CONCLUSION") {
      assert.ok(question.displayedConclusion);
      assert.equal(question.metadata.conclusionTruths.length, 1);
      observedTruths.add(question.metadata.conclusionTruths[0]!);
      if (question.metadata.conclusionTruths[0] === "POSSIBLY_TRUE") {
        assert.equal(question.explanation.modelWitnesses.length, 1);
        possibleWitnessQuestions += 1;
      }
    } else {
      assert.equal(question.displayedConclusion, undefined);
      assert.equal(question.metadata.conclusionTruths.length, 4);
      assert.ok(question.options.every((option) => option.conclusion));
    }

    const learnerText = JSON.stringify({
      stem: question.stem,
      statements: question.displayedStatements,
      conclusion: question.displayedConclusion,
      options: question.options.map((option) => option.value),
      explanation: question.explanation,
    });
    assert.ok(!learnerText.includes("E1"));
    assert.ok(
      !learnerText.includes("independently verified conclusion status"),
    );
    assert.ok(!learnerText.includes("is classified as"));
    assert.ok(!learnerText.includes("A valid model has"));
    assert.ok(!/\bS\d+:/.test(learnerText));
    assert.ok(!/\b(?:undefined|null|NaN)\b/.test(learnerText));

    answerPositions[question.correctIndex] += 1;
    observedAuthorities.add(question.authorityId);
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 300);
assert.deepEqual(answerPositions, [75, 75, 75, 75]);
assert.deepEqual([...observedTruths].sort(), [
  "DEFINITELY_TRUE",
  "IMPOSSIBLE",
  "POSSIBLY_TRUE",
]);
assert.equal(observedAuthorities.size, 3);
assert.ok(possibleWitnessQuestions >= 33);

const duplicateFixture = generateIneCp001ConclusionQuestion(
  "INE-CP001-PROT-SELECT-INVALID-CONCLUSION",
  0,
);
const sourceOption = duplicateFixture.options[1]!;
const duplicateOptions = duplicateFixture.options.map((option, index) =>
  index === 2
    ? {
        ...option,
        value: `Reversed duplicate of ${sourceOption.value}`,
        conclusion: {
          ...sourceOption.conclusion!,
          leftId: sourceOption.conclusion!.rightId,
          relation: reverseRelation(sourceOption.conclusion!.relation),
          rightId: sourceOption.conclusion!.leftId,
        },
        truth: sourceOption.truth,
      }
    : option,
);
const duplicateValidation = validateIneCp001ConclusionQuestion({
  ...duplicateFixture,
  options: duplicateOptions,
});
assert.equal(duplicateValidation.valid, false);
assert.ok(
  duplicateValidation.errors.some((error) =>
    error.includes("equivalent relation in reversed form"),
  ),
);

console.log("INE-CP-001 conclusion prototype audit passed.", {
  generatedCount,
  answerPositions,
  observedTruths: [...observedTruths].sort(),
  authorityCount: observedAuthorities.size,
  possibleWitnessQuestions,
  permanentQlCount: 0,
});
