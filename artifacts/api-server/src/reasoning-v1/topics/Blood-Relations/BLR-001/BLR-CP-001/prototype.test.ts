import assert from "node:assert/strict";

import { validateFamilyGraph } from "../foundation/family-validity";
import { graphFromStructuredPrompt } from "../foundation/graph-closure";
import { BLR_CP001_PROTOTYPE_CONTRACTS } from "./prototype-contracts";
import { generateBlrCp001PrototypeQuestion } from "./prototype-generator";
import { solveBlrCp001Prompt } from "./prototype-solver";

assert.equal(BLR_CP001_PROTOTYPE_CONTRACTS.length, 4);
assert.equal(new Set(BLR_CP001_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)).size, 4);
assert.ok(BLR_CP001_PROTOTYPE_CONTRACTS.every((entry) => entry.permanentQlId === null));
assert.ok(BLR_CP001_PROTOTYPE_CONTRACTS.every((entry) => entry.status === "PROTOTYPE"));

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const renderers = new Set<string>();
const relationIds = new Set<string>();
const fingerprints = new Set<string>();
const taskPathLengths = new Map<string, Set<number>>();
let generatedCount = 0;

for (const contract of BLR_CP001_PROTOTYPE_CONTRACTS) {
  const observedPathLengths = new Set<number>();
  taskPathLengths.set(contract.prototypeId, observedPathLengths);

  for (let seed = 0; seed < 100; seed += 1) {
    const question = generateBlrCp001PrototypeQuestion(contract.prototypeId, seed);
    const repeat = generateBlrCp001PrototypeQuestion(contract.prototypeId, seed);
    assert.deepEqual(repeat, question, `${contract.prototypeId}/${seed} must be deterministic.`);

    assert.equal(question.packageId, "BLR-001");
    assert.equal(question.checkpointId, "BLR-CP-001");
    assert.equal(question.prototypeId, contract.prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.ruleId, "BLOOD_GRAPH_RELATION");
    assert.equal(question.locale, "en-IN");
    assert.equal(question.answerType, "RELATION_LABEL");
    assert.equal(question.metadata.runtimeVersion, "blr-cp001-prototype-v1");
    assert.equal(question.metadata.ambiguityAccepted, true);
    assert.equal(question.metadata.independentSolverAgreed, true);
    assert.equal(question.metadata.familyGraphValid, true);

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(new Set(question.options.map((option) => option.relationId)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.options[question.correctIndex]?.relationId, question.metadata.relationId);
    assert.equal(
      question.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.errorLabel)),
      true,
    );

    const graph = graphFromStructuredPrompt(question.structuredPrompt);
    const validity = validateFamilyGraph(graph);
    assert.equal(validity.valid, true, validity.errors.join(" "));

    const solved = solveBlrCp001Prompt(question.structuredPrompt);
    assert.equal(solved.relationId, question.metadata.relationId);
    assert.equal(solved.path.steps.length, question.metadata.pathLength);
    assert.ok(solved.graphPersonCount >= 2);
    assert.ok(solved.graphEdgeCount >= 1);
    assert.ok(question.metadata.pathLength >= contract.minimumPathLength);
    assert.ok(question.metadata.pathLength <= contract.maximumPathLength);

    assert.ok(question.stem.length > 80);
    assert.ok(question.stem.includes("related to") || question.stem.includes("relation to"));
    assert.ok(question.explanation.ruleStatement.length > 40);
    assert.equal(question.explanation.normalizedClues.length, question.structuredPrompt.clues.length);
    assert.ok(question.explanation.queryPath.length >= 2);
    assert.ok(
      question.explanation.conclusion.includes(
        question.options[question.correctIndex]!.value.toLocaleLowerCase("en-IN"),
      ),
    );
    assert.ok(
      question.explanation.closestTrapRejection &&
        question.explanation.closestTrapRejection.length > 40,
    );

    answerPositions[question.correctIndex] += 1;
    difficulties.add(question.difficulty);
    renderers.add(question.renderer);
    relationIds.add(question.metadata.relationId);
    fingerprints.add(question.metadata.hiddenFingerprint);
    observedPathLengths.add(question.metadata.pathLength);
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 400);
assert.deepEqual(answerPositions, [100, 100, 100, 100]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...renderers].sort(), ["FAMILY_TREE_EXPLANATION", "STRUCTURED_TEXT"]);
assert.ok(relationIds.size >= 18, `Expected broad relation coverage, observed ${relationIds.size}.`);
assert.ok(fingerprints.size >= 20, `Expected scenario diversity, observed ${fingerprints.size}.`);
assert.deepEqual([...taskPathLengths.get("BLR-CP001-PROT-DIRECT-FORWARD")!], [1]);
assert.deepEqual([...taskPathLengths.get("BLR-CP001-PROT-DIRECT-REVERSE")!], [1]);
assert.deepEqual([...taskPathLengths.get("BLR-CP001-PROT-COMPOSED-TWO-EDGE")!], [2]);
assert.deepEqual([...taskPathLengths.get("BLR-CP001-PROT-COMPOSED-THREE-EDGE")!], [3]);

console.log("BLR-CP-001 English prototype audit passed.", {
  generatedCount,
  answerPositions,
  difficulties: [...difficulties].sort(),
  renderers: [...renderers].sort(),
  relationCoverage: [...relationIds].sort(),
  semanticFingerprints: fingerprints.size,
});
