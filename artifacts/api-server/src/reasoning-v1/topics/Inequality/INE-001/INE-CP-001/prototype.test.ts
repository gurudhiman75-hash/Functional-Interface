import assert from "node:assert/strict";

import { generateIneCp001PrototypeQuestion } from "./prototype-generator";
import { INE_CP001_PROTOTYPE_CONTRACTS } from "./prototype-contracts";
import { validateIneCp001Question } from "./validator";

assert.equal(INE_CP001_PROTOTYPE_CONTRACTS.length, 5);
assert.equal(
  new Set(INE_CP001_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)).size,
  5,
);
assert.equal(
  new Set(INE_CP001_PROTOTYPE_CONTRACTS.map((entry) => entry.authorityId)).size,
  5,
);
assert.ok(
  INE_CP001_PROTOTYPE_CONTRACTS.every((entry) => entry.permanentQlId === null),
);
assert.ok(
  INE_CP001_PROTOTYPE_CONTRACTS.every((entry) => entry.status === "PROTOTYPE"),
);

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const answers = new Set<string>();
const topologies = new Set<string>();
const fingerprints = new Set<string>();
let generatedCount = 0;
let indeterminateCount = 0;

for (const contract of INE_CP001_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 100; seed += 1) {
    const question = generateIneCp001PrototypeQuestion(
      contract.prototypeId,
      seed,
    );
    assert.deepEqual(
      generateIneCp001PrototypeQuestion(contract.prototypeId, seed),
      question,
      `${contract.prototypeId}/${seed} must be deterministic.`,
    );
    assert.equal(question.packageId, "INE-001");
    assert.equal(question.checkpointId, "INE-CP-001");
    assert.equal(question.prototypeId, contract.prototypeId);
    assert.equal(question.authorityId, contract.authorityId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.locale, "en-IN");
    assert.equal(question.metadata.runtimeVersion, "ine-cp001-prototype-v2");
    assert.equal(question.metadata.independentSolverAgreed, true);
    assert.equal(question.metadata.graphConsistent, true);
    assert.ok(question.metadata.hiddenFingerprint.length >= 8);
    assert.ok(
      question.metadata.statementCount >= contract.minimumStatementCount &&
        question.metadata.statementCount <= contract.maximumStatementCount,
    );

    assert.equal(question.options.length, 4);
    assert.equal(
      new Set(question.options.map((option) => option.semanticValue)).size,
      4,
    );
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
    assert.ok(
      question.options
        .filter((option) => !option.isCorrect)
        .every((option) => Boolean(option.errorLabel)),
    );

    const validation = validateIneCp001Question(question);
    assert.equal(validation.valid, true, validation.errors.join(" "));
    assert.equal(validation.agreementEvidence?.agreed, true);
    assert.ok(validation.agreementEvidence!.modelEvidence.validModelCount > 0);

    assert.match(question.stem, /[.?]$/);
    assert.equal(
      question.displayedStatements.length,
      question.structuredPrompt.statements.length,
    );
    assert.ok(
      question.displayedStatements.every((statement) =>
        /[><=≥≤]/.test(statement),
      ),
    );
    assert.ok(question.explanation.ruleStatement.length > 12);
    assert.equal(question.explanation.normalizedStatements.length, 0);
    assert.ok(question.explanation.proofSteps.length >= 1);
    assert.ok(question.explanation.conclusion.length > 10);
    assert.equal(question.explanation.distractorAnalysis.length, 3);
    assert.ok(
      question.explanation.distractorAnalysis.every(
        (entry) => entry.studentWarning.length > 30,
      ),
    );

    const isIndeterminate =
      question.options[question.correctIndex]?.semanticValue ===
      "INDETERMINATE";
    assert.equal(isIndeterminate, contract.expectedIndeterminate);
    if (isIndeterminate) {
      assert.deepEqual(question.metadata.possibleAtomicRelations, [
        "LT",
        "EQ",
        "GT",
      ]);
      assert.equal(question.explanation.modelWitnesses.length, 1);
      indeterminateCount += 1;
    } else {
      assert.ok(question.metadata.strongestDefiniteRelation);
      assert.equal(question.explanation.modelWitnesses.length, 0);
    }

    const learnerText = JSON.stringify({
      stem: question.stem,
      statements: question.displayedStatements,
      options: question.options.map((option) => option.value),
      explanation: question.explanation,
    });
    assert.ok(!learnerText.includes("E1"));
    assert.ok(!learnerText.includes("hiddenFingerprint"));
    assert.ok(!learnerText.includes("A valid model has"));
    assert.ok(!learnerText.includes("There is no directed comparison path"));
    assert.ok(!learnerText.includes("This option is not supported"));
    assert.ok(!/\b(?:undefined|null|NaN)\b/.test(learnerText));

    answerPositions[question.correctIndex] += 1;
    difficulties.add(question.difficulty);
    answers.add(question.options[question.correctIndex]!.semanticValue);
    topologies.add(question.metadata.topologyId);
    fingerprints.add(question.metadata.hiddenFingerprint);
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 500);
assert.deepEqual(answerPositions, [125, 125, 125, 125]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
for (const expected of [
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
  "INDETERMINATE",
])
  assert.ok(answers.has(expected));
assert.ok(
  topologies.size >= 10,
  `Expected topology variation, received ${topologies.size}.`,
);
assert.ok(
  fingerprints.size >= 10,
  `Expected hidden-state variation, received ${fingerprints.size}.`,
);
assert.equal(indeterminateCount, 100);

console.log("INE-CP-001 prototype runtime audit passed.", {
  generatedCount,
  answerPositions,
  difficulties: [...difficulties].sort(),
  answerCoverage: [...answers].sort(),
  topologyCount: topologies.size,
  hiddenFingerprintCount: fingerprints.size,
  indeterminateCount,
  permanentQlCount: 0,
});
