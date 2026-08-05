import assert from "node:assert/strict";

import { INE_CP002_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp002Question } from "./generator";
import { validateIneCp002Question } from "./validator";

assert.equal(INE_CP002_PROTOTYPE_CONTRACTS.length, 9);
assert.equal(
  new Set(INE_CP002_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)).size,
  9,
);
assert.equal(
  new Set(INE_CP002_PROTOTYPE_CONTRACTS.map((entry) => entry.authorityId)).size,
  9,
);
assert.ok(
  INE_CP002_PROTOTYPE_CONTRACTS.every(
    (entry) => entry.status === "PROTOTYPE" && entry.permanentQlId === null,
  ),
);

const answerPositions = [0, 0, 0, 0];
const relationAnswers = new Set<string>();
const topologies = new Set<string>();
const authorities = new Set<string>();
const taskKinds = new Set<string>();
let generatedCount = 0;
let pairSelectionCount = 0;
let indeterminateCount = 0;

for (const contract of INE_CP002_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 20; seed += 1) {
    const question = generateIneCp002Question(contract.prototypeId, seed);
    if (seed < 2) {
      assert.deepEqual(
        generateIneCp002Question(contract.prototypeId, seed),
        question,
        `${contract.prototypeId}/${seed} must be deterministic.`,
      );
    }
    assert.equal(question.packageId, "INE-001");
    assert.equal(question.checkpointId, "INE-CP-002");
    assert.equal(question.authorityId, contract.authorityId);
    assert.equal(question.metadata.taskKind, contract.taskKind);
    assert.equal(question.metadata.runtimeVersion, "ine-cp002-prototype-v1");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.metadata.independentSolverAgreed, true);
    assert.equal(question.metadata.graphConsistent, true);
    assert.equal(
      question.metadata.statementCount >= contract.minimumStatementCount &&
        question.metadata.statementCount <= contract.maximumStatementCount,
      true,
    );
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
    assert.ok(question.explanation.ruleStatement.length > 20);
    assert.ok(question.explanation.proofSteps.length >= 1);
    assert.ok(question.explanation.conclusion.length > 35);

    if (seed === 0) {
      const validation = validateIneCp002Question(question);
      assert.equal(validation.valid, true, validation.errors.join(" "));
    }

    if (question.metadata.taskKind === "RELATION") {
      const answer = question.options[question.correctIndex]!.semanticRelation!;
      relationAnswers.add(answer);
      if (answer === "INDETERMINATE") indeterminateCount += 1;
      assert.ok(question.structuredPrompt.query);
      assert.equal(question.answerType, "STRONGEST_DEFINITE_RELATION");
    } else {
      pairSelectionCount += 1;
      assert.equal(question.answerType, "PAIR_SELECTION");
      assert.equal(question.structuredPrompt.candidatePairs?.length, 4);
      assert.equal(
        Object.keys(question.metadata.candidatePairDefiniteness ?? {}).length,
        4,
      );
    }

    const learnerText = JSON.stringify({
      stem: question.stem,
      statements: question.displayedStatements,
      options: question.options.map((option) => option.value),
      explanation: question.explanation,
    });
    assert.ok(!/\bE\d+\b/.test(learnerText));
    assert.ok(!learnerText.includes("A valid model has"));
    assert.ok(!learnerText.includes("independently verified"));
    assert.ok(!/\b(?:undefined|null|NaN)\b/.test(learnerText));

    answerPositions[question.correctIndex] += 1;
    topologies.add(question.metadata.topologyId);
    authorities.add(question.authorityId);
    taskKinds.add(question.metadata.taskKind);
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 180);
assert.deepEqual(answerPositions, [45, 45, 45, 45]);
assert.deepEqual([...relationAnswers].sort(), [
  "EQUAL_TO",
  "GREATER_THAN",
  "GREATER_THAN_OR_EQUAL",
  "INDETERMINATE",
  "LESS_THAN",
  "LESS_THAN_OR_EQUAL",
]);
assert.equal(topologies.size, 9);
assert.equal(authorities.size, 9);
assert.deepEqual([...taskKinds].sort(), [
  "RELATION",
  "SELECT_DEFINITE_PAIR",
  "SELECT_INDETERMINATE_PAIR",
]);
assert.equal(pairSelectionCount, 40);
assert.equal(indeterminateCount, 40);

console.log("INE-CP-002 multi-link discovery audit passed.", {
  generatedCount,
  answerPositions,
  relationAnswers: [...relationAnswers].sort(),
  authorityCount: authorities.size,
  topologyCount: topologies.size,
  pairSelectionCount,
  indeterminateCount,
  permanentQlCount: 0,
});
