import assert from "node:assert/strict";

import { INE_CP003_PROTOTYPE_CONTRACTS } from "./contracts";
import { generateIneCp003Question } from "./generator";
import { validateIneCp003Question } from "./validator";

assert.equal(INE_CP003_PROTOTYPE_CONTRACTS.length, 7);
assert.equal(
  new Set(INE_CP003_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)).size,
  7,
);
assert.equal(
  new Set(INE_CP003_PROTOTYPE_CONTRACTS.map((entry) => entry.authorityId)).size,
  7,
);
assert.ok(
  INE_CP003_PROTOTYPE_CONTRACTS.every(
    (entry) =>
      entry.status === "PROTOTYPE" &&
      entry.permanentQlId === null &&
      entry.sourceLedgerIds.length > 0,
  ),
);

const threeChoicePositions = [0, 0, 0];
const fourChoicePositions = [0, 0, 0, 0];
const sourceOperators = new Set<string>();
const truthClasses = new Set<string>();
const taskKinds = new Set<string>();
const topologies = new Set<string>();
const difficulties = new Set<string>();
const releaseTiers = new Set<string>();
const conclusionMasks = new Set<string>();
const structuralFingerprints = new Set<string>();
let generatedCount = 0;

for (const contract of INE_CP003_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 12; seed += 1) {
    const question = generateIneCp003Question(contract.prototypeId, seed);
    if (seed < 2) {
      assert.deepEqual(
        generateIneCp003Question(contract.prototypeId, seed),
        question,
        `${contract.prototypeId}/${seed} must be deterministic.`,
      );
    }
    const validation = validateIneCp003Question(question);
    assert.equal(validation.valid, true, validation.errors.join(" "));
    assert.equal(question.packageId, "INE-001");
    assert.equal(question.checkpointId, "INE-CP-003");
    assert.equal(question.authorityId, contract.authorityId);
    assert.equal(question.metadata.taskKind, contract.taskKind);
    assert.equal(question.metadata.runtimeVersion, "ine-cp003-prototype-v2");
    assert.equal(question.metadata.reviewStatus, "CHECKPOINT_ACCEPTED");
    assert.deepEqual(
      question.metadata.sourceLedgerIds,
      contract.sourceLedgerIds,
    );
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    const expectedOptionCount =
      contract.taskKind === "CLASSIFY_CONCLUSION" ? 3 : 4;
    assert.equal(question.options.length, expectedOptionCount);
    assert.equal(
      new Set(question.options.map((option) => option.value)).size,
      expectedOptionCount,
    );
    assert.equal(
      question.options.filter((option) => option.isCorrect).length,
      1,
    );
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(
      question.metadata.distractorErrorLabels.length,
      expectedOptionCount - 1,
    );
    assert.equal(
      question.explanation.distractorAnalysis.length,
      expectedOptionCount - 1,
    );
    assert.ok(question.solutions.mock.length > 60);
    assert.deepEqual(question.solutions.learning, question.explanation);
    assert.match(question.recordId, /^INE-CP003-[0-9A-F]{8}$/);
    assert.match(question.metadata.contentHash, /^[0-9a-f]{8}$/);
    assert.match(question.metadata.structuralFingerprint, /^[0-9a-f]{8}$/);
    assert.ok(
      question.options.every((option) => !/contradict/i.test(option.value)),
    );
    assert.ok(!/The statements allow/i.test(question.solutions.mock));

    if (contract.taskKind === "CLASSIFY_CONCLUSION") {
      assert.equal(question.structuredScenario.conclusions.length, 1);
      truthClasses.add(question.options[question.correctIndex]!.truth!);
      if (question.options[question.correctIndex]!.truth === "POSSIBLY_TRUE") {
        assert.ok(question.explanation.modelWitnesses.length >= 2);
      }
      threeChoicePositions[question.correctIndex] += 1;
    } else {
      fourChoicePositions[question.correctIndex] += 1;
    }

    if (contract.taskKind === "SELECT_CONCLUSION") {
      assert.equal(question.structuredScenario.conclusions.length, 4);
      assert.equal(
        question.options.filter(
          (option) => option.truth === contract.targetTruth,
        ).length,
        1,
      );
    } else if (contract.taskKind === "SELECT_RELATION_SET") {
      assert.ok(question.structuredScenario.query);
      assert.ok((question.metadata.possibleAtomicRelations?.length ?? 0) >= 1);
      assert.equal(
        question.explanation.modelWitnesses.length,
        question.metadata.possibleAtomicRelations!.length,
      );
    } else if (contract.taskKind === "EVALUATE_CONCLUSION_SET") {
      assert.equal(question.structuredScenario.conclusions.length, 2);
      assert.equal(question.displayedConclusions?.length, 2);
      assert.equal(
        new Set(question.options.map((option) => option.conclusionMask)).size,
        4,
      );
      conclusionMasks.add(
        question.options[question.correctIndex]!.conclusionMask!,
      );
      const pairKeys = question.structuredScenario.conclusions.map((entry) =>
        [entry.leftId, entry.rightId].sort().join(":"),
      );
      assert.notEqual(pairKeys[0], pairKeys[1]);
    }

    const learnerText = JSON.stringify({
      stem: question.stem,
      statements: question.displayedStatements,
      conclusion: question.displayedConclusion,
      conclusions: question.displayedConclusions,
      options: question.options.map((option) => option.value),
      explanation: question.explanation,
    });
    assert.ok(!/\bE\d+\b/.test(learnerText));
    assert.ok(!/\b(?:undefined|null|NaN)\b/.test(learnerText));

    question.structuredScenario.statements.forEach((statement) =>
      sourceOperators.add(statement.relation),
    );
    taskKinds.add(question.metadata.taskKind);
    topologies.add(question.metadata.topologyId);
    structuralFingerprints.add(question.metadata.structuralFingerprint);
    difficulties.add(question.difficulty);
    releaseTiers.add(question.metadata.releaseTier);
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 84);
assert.deepEqual(threeChoicePositions, [8, 8, 8]);
assert.deepEqual(fourChoicePositions, [15, 15, 15, 15]);
assert.deepEqual([...sourceOperators].sort(), [
  "EQUAL_TO",
  "GREATER_THAN",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN",
  "LESS_THAN_OR_EQUAL",
]);
assert.deepEqual([...truthClasses].sort(), [
  "DEFINITELY_TRUE",
  "IMPOSSIBLE",
  "POSSIBLY_TRUE",
]);
assert.deepEqual([...taskKinds].sort(), [
  "CLASSIFY_CONCLUSION",
  "EVALUATE_CONCLUSION_SET",
  "SELECT_CONCLUSION",
  "SELECT_RELATION_SET",
]);
assert.deepEqual([...conclusionMasks].sort(), [
  "BOTH",
  "NEITHER",
  "ONLY_I",
  "ONLY_II",
]);
assert.equal(topologies.size, 12);
assert.ok(structuralFingerprints.size >= 12);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...releaseTiers].sort(), [
  "DIAGNOSTIC_PRACTICE",
  "GUIDED_CONCEPT",
  "MOCK_FORMAT_PROTOTYPE",
]);

console.log("INE-CP-003 conclusion-certainty audit passed.", {
  generatedCount,
  threeChoicePositions,
  fourChoicePositions,
  authorityCount: INE_CP003_PROTOTYPE_CONTRACTS.length,
  topologies: topologies.size,
  truthClasses: [...truthClasses].sort(),
  conclusionMasks: [...conclusionMasks].sort(),
  permanentQlCount: 0,
});
