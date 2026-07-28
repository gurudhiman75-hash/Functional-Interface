import assert from "node:assert/strict";

import { graphFromClues } from "../foundation/graph-closure";
import { BLR_CP001_LINEAGE_PROTOTYPE_CONTRACTS } from "./lineage-prototype-contracts";
import { generateBlrCp001LineagePrototypeQuestion } from "./lineage-prototype-generator";
import {
  solveBlrCp001LineagePrompt,
  solveExactLineageRelationFromGraph,
} from "./lineage-prototype-solver";

assert.equal(BLR_CP001_LINEAGE_PROTOTYPE_CONTRACTS.length, 2);
assert.equal(
  new Set(BLR_CP001_LINEAGE_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId)).size,
  2,
);
assert.ok(BLR_CP001_LINEAGE_PROTOTYPE_CONTRACTS.every((contract) => contract.permanentQlId === null));

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const renderers = new Set<string>();
const answerTypes = new Set<string>();
const targetGenders = new Set<string>();
const lineageSides = new Set<string>();
const exactRelations = new Set<string>();
const broadRelations = new Set<string>();
const scenarioIds = new Set<string>();
let generatedCount = 0;
let genderReferenceInferenceCount = 0;

for (const contract of BLR_CP001_LINEAGE_PROTOTYPE_CONTRACTS) {
  for (let seed = 0; seed < 120; seed += 1) {
    const question = generateBlrCp001LineagePrototypeQuestion(contract.prototypeId, seed);
    const repeat = generateBlrCp001LineagePrototypeQuestion(contract.prototypeId, seed);
    assert.deepEqual(repeat, question, `${contract.prototypeId}/${seed} must be deterministic.`);

    assert.equal(question.packageId, "BLR-001");
    assert.equal(question.checkpointId, "BLR-CP-001");
    assert.equal(question.prototypeId, contract.prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.ruleId, contract.ruleId);
    assert.equal(question.answerType, contract.answerType);
    assert.equal(question.locale, "en-IN");
    assert.equal(question.metadata.runtimeVersion, "blr-cp001-lineage-prototype-v1");
    assert.equal(question.metadata.taskKind, contract.taskKind);
    assert.equal(question.metadata.ambiguityAccepted, true);
    assert.equal(question.metadata.independentSolverAgreed, true);
    assert.equal(question.metadata.familyGraphValid, true);

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(new Set(question.options.map((option) => option.answerKey)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.options[question.correctIndex]?.answerKey, question.metadata.correctAnswerKey);
    assert.ok(question.options.filter((option) => !option.isCorrect).every((option) => option.errorLabel));

    const solved = solveBlrCp001LineagePrompt(question.structuredPrompt);
    assert.equal(solved.answerKey, question.metadata.correctAnswerKey);
    assert.equal(solved.pathLength, question.metadata.pathLength);
    assert.equal(solved.targetGender, question.metadata.targetGender);
    assert.equal(solved.lineageSide, question.metadata.lineageSide);
    assert.equal(solved.broadRelationId, question.metadata.broadRelationId);
    assert.equal(solved.exactLineageRelationId, question.metadata.exactLineageRelationId);

    assert.ok(question.stem.length > 100);
    assert.equal(question.explanation.normalizedClues.length, question.structuredPrompt.clues.length);
    assert.ok(question.explanation.queryPath.length >= 2);
    assert.ok(question.explanation.ruleStatement.length > 50);
    assert.ok(question.explanation.closestTrapRejection && question.explanation.closestTrapRejection.length > 50);

    if (question.structuredPrompt.query.kind === "IDENTIFY_PERSON_BY_GENDER") {
      assert.equal(question.answerType, "PERSON_NAME");
      assert.equal(question.metadata.pathLength, null);
      assert.equal(question.metadata.lineageSide, null);
      assert.equal(question.metadata.broadRelationId, null);
      assert.equal(question.metadata.exactLineageRelationId, null);
      assert.ok(question.metadata.targetGender === "MALE" || question.metadata.targetGender === "FEMALE");
      targetGenders.add(question.metadata.targetGender);
      if (question.metadata.scenarioId === "gender-reference-inference") {
        genderReferenceInferenceCount += 1;
      }
    } else {
      assert.equal(question.answerType, "EXACT_LINEAGE_RELATION");
      assert.equal(question.metadata.pathLength, 2);
      assert.ok(question.metadata.lineageSide);
      assert.ok(question.metadata.broadRelationId);
      assert.ok(question.metadata.exactLineageRelationId);
      const graph = graphFromClues(
        question.structuredPrompt.clues,
        question.structuredPrompt.personNames,
      );
      const exact = solveExactLineageRelationFromGraph(
        graph,
        question.structuredPrompt.query.subjectId,
        question.structuredPrompt.query.referenceId,
      );
      assert.equal(exact.relationId, question.metadata.exactLineageRelationId);
      lineageSides.add(question.metadata.lineageSide);
      exactRelations.add(question.metadata.exactLineageRelationId);
      broadRelations.add(question.metadata.broadRelationId);
    }

    answerPositions[question.correctIndex] += 1;
    difficulties.add(question.difficulty);
    renderers.add(question.renderer);
    answerTypes.add(question.answerType);
    scenarioIds.add(question.metadata.scenarioId);
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 240);
assert.deepEqual(answerPositions, [60, 60, 60, 60]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...renderers].sort(), ["FAMILY_TREE_EXPLANATION", "STRUCTURED_TEXT"]);
assert.deepEqual([...answerTypes].sort(), ["EXACT_LINEAGE_RELATION", "PERSON_NAME"]);
assert.deepEqual([...targetGenders].sort(), ["FEMALE", "MALE"]);
assert.deepEqual([...lineageSides].sort(), ["MATERNAL", "PATERNAL"]);
assert.equal(exactRelations.size, 8);
assert.deepEqual([...broadRelations].sort(), ["AUNT", "GRANDFATHER", "GRANDMOTHER", "UNCLE"]);
assert.equal(scenarioIds.size, 10);
assert.equal(genderReferenceInferenceCount, 60);

console.log("BLR-CP-001 gender and exact-lineage prototype audit passed.", {
  generatedCount,
  answerPositions,
  targetGenders: [...targetGenders].sort(),
  lineageSides: [...lineageSides].sort(),
  exactRelations: [...exactRelations].sort(),
  broadRelations: [...broadRelations].sort(),
  scenarios: scenarioIds.size,
  genderReferenceInferenceCount,
});
