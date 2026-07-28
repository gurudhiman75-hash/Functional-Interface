import assert from "node:assert/strict";

import { validateFamilyGraph } from "../foundation/family-validity";
import { graphFromClues } from "../foundation/graph-closure";
import { BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS } from "./advanced-prototype-contracts";
import { generateBlrCp001AdvancedPrototypeQuestion } from "./advanced-prototype-generator";
import { solveBlrCp001AdvancedPrompt } from "./advanced-prototype-solver";

assert.equal(BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS.length, 5);
assert.equal(
  new Set(
    BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS.map(
      (contract) => contract.prototypeId,
    ),
  ).size,
  5,
);
assert.ok(
  BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS.every(
    (contract) => contract.permanentQlId === null,
  ),
);
assert.ok(
  BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS.every(
    (contract) => contract.status === "PROTOTYPE",
  ),
);

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const answerTypes = new Set<string>();
const taskKinds = new Set<string>();
const targetTruthValues = new Set<string>();
const generationDeltas = new Set<number>();
const scenarioIds = new Set<string>();
const fingerprints = new Set<string>();
let generatedCount = 0;
let inferredSiblingQuestionCount = 0;

for (const contract of BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 100; seed += 1) {
    const question = generateBlrCp001AdvancedPrototypeQuestion(
      contract.prototypeId,
      seed,
    );
    const repeat = generateBlrCp001AdvancedPrototypeQuestion(
      contract.prototypeId,
      seed,
    );
    assert.deepEqual(
      repeat,
      question,
      `${contract.prototypeId}/${seed} must be deterministic.`,
    );

    assert.equal(question.packageId, "BLR-001");
    assert.equal(question.checkpointId, "BLR-CP-001");
    assert.equal(question.prototypeId, contract.prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.locale, "en-IN");
    assert.equal(question.answerType, contract.answerType);
    assert.equal(question.ruleId, contract.ruleId);
    assert.equal(question.metadata.taskKind, contract.taskKind);
    assert.equal(
      question.metadata.runtimeVersion,
      "blr-cp001-advanced-prototype-v1",
    );
    assert.equal(question.metadata.ambiguityAccepted, true);
    assert.equal(question.metadata.independentSolverAgreed, true);
    assert.equal(question.metadata.familyGraphValid, true);

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(
      new Set(question.options.map((option) => option.answerKey)).size,
      4,
    );
    assert.equal(
      question.options.filter((option) => option.isCorrect).length,
      1,
    );
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(
      question.options[question.correctIndex]?.answerKey,
      question.metadata.correctAnswerKey,
    );
    assert.ok(
      question.options
        .filter((option) => !option.isCorrect)
        .every((option) => Boolean(option.errorLabel)),
    );
    assert.equal(question.metadata.distractorErrorLabels.length, 3);

    const graph = graphFromClues(
      question.structuredPrompt.clues,
      question.structuredPrompt.personNames,
    );
    const validity = validateFamilyGraph(graph);
    assert.equal(validity.valid, true, validity.errors.join(" "));

    const solved = solveBlrCp001AdvancedPrompt(question.structuredPrompt);
    assert.equal(solved.answerKey, question.metadata.correctAnswerKey);
    assert.equal(solved.pathLength, question.metadata.pathLength);
    assert.equal(solved.generationDelta, question.metadata.generationDelta);
    assert.equal(solved.graphPersonCount, question.metadata.personCount);
    assert.equal(solved.graphEdgeCount, question.metadata.graphEdgeCount);

    assert.ok(question.stem.length > 100);
    assert.equal(
      question.explanation.normalizedClues.length,
      question.structuredPrompt.clues.length,
    );
    assert.ok(question.explanation.ruleStatement.length > 50);
    assert.ok(question.explanation.queryPath.length >= 2);
    assert.ok(question.explanation.conclusion.length > 20);
    assert.ok(
      question.explanation.closestTrapRejection &&
        question.explanation.closestTrapRejection.length > 50,
    );

    if (
      question.prototypeId === "BLR-CP001-PROT-BRANCHING-RELATION"
    ) {
      assert.equal(question.metadata.inferredSiblingRequired, true);
      assert.equal(question.metadata.pathLength, 3);
      assert.ok(question.metadata.clueCount >= 4);
      assert.equal(graph.siblingEdges.length, 0);
      inferredSiblingQuestionCount += 1;
    }

    answerPositions[question.correctIndex] += 1;
    difficulties.add(question.difficulty);
    answerTypes.add(question.answerType);
    taskKinds.add(question.metadata.taskKind);
    scenarioIds.add(question.metadata.scenarioId);
    fingerprints.add(question.metadata.hiddenFingerprint);
    if (question.metadata.targetTruth) {
      targetTruthValues.add(question.metadata.targetTruth);
    }
    if (question.metadata.generationDelta !== null) {
      generationDeltas.add(question.metadata.generationDelta);
    }
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 500);
assert.deepEqual(answerPositions, [125, 125, 125, 125]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...answerTypes].sort(), [
  "GENERATION_LABEL",
  "ORDERED_PAIR",
  "PERSON_NAME",
  "RELATION_CLAIM",
  "RELATION_LABEL",
]);
assert.equal(taskKinds.size, 5);
assert.deepEqual([...targetTruthValues].sort(), ["FALSE", "TRUE"]);
assert.ok(
  [-2, -1, 0, 1, 2].every((delta) => generationDeltas.has(delta)),
  `Expected all bounded generation deltas, observed ${[...generationDeltas].join(", ")}.`,
);
assert.equal(inferredSiblingQuestionCount, 100);
assert.ok(scenarioIds.size >= 5);
assert.ok(fingerprints.size >= 20);

console.log("BLR-CP-001 advanced English prototype audit passed.", {
  generatedCount,
  answerPositions,
  difficulties: [...difficulties].sort(),
  answerTypes: [...answerTypes].sort(),
  taskKinds: [...taskKinds].sort(),
  targetTruthValues: [...targetTruthValues].sort(),
  generationDeltas: [...generationDeltas].sort((left, right) => left - right),
  scenarioCount: scenarioIds.size,
  semanticFingerprints: fingerprints.size,
  inferredSiblingQuestionCount,
});
