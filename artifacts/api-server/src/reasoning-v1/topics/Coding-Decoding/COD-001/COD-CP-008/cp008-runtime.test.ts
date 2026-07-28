import assert from "node:assert/strict";

import { CP008_SEMANTIC_FACTS } from "./cp008-curated-facts";
import {
  COD_CP008_PERMANENT_CONTRACTS,
  type Cp008QlId,
} from "./cp008-permanent-contracts";
import { generateCp008Question } from "./cp008-runtime";
import { auditCp008Mapping, solveCp008Prompt } from "./cp008-prototype-solver";

assert.deepEqual(
  COD_CP008_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  ["COD-QL-173", "COD-QL-174"],
);
assert.equal(COD_CP008_PERMANENT_CONTRACTS.length, 2);
assert.equal(new Set(COD_CP008_PERMANENT_CONTRACTS.map((contract) => contract.solveContractId)).size, 2);
assert.ok(COD_CP008_PERMANENT_CONTRACTS.every((contract) => !contract.publiclyPublishable));
assert.ok(COD_CP008_PERMANENT_CONTRACTS.every((contract) => !contract.questionStudioVisible));

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const renderers = new Set<string>();
const topologies = new Set<string>();
const factCategories = new Set<string>();
const semanticFactIds = new Set<string>();
const stems = new Set<string>();
const taskKindsByQl = new Map<Cp008QlId, Set<string>>();
const errorLabels = new Set<string>();
let generatedCount = 0;

for (const contract of COD_CP008_PERMANENT_CONTRACTS) {
  const taskKinds = new Set<string>();
  taskKindsByQl.set(contract.qlId, taskKinds);

  for (let seed = 1; seed <= 200; seed += 1) {
    const first = generateCp008Question(contract.qlId, seed);
    const repeat = generateCp008Question(contract.qlId, seed);
    assert.deepEqual(repeat, first, `${contract.qlId}/${seed} must be deterministic`);

    assert.equal(first.qlId, contract.qlId);
    assert.equal(first.permanentQlId, contract.qlId);
    assert.equal(first.checkpointId, "COD-CP-008");
    assert.equal(first.ruleId, contract.ruleId);
    assert.equal(first.prototypeOnly, false);
    assert.equal(first.reviewOnly, true);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioVisible, false);
    assert.equal(first.locale, "en-IN");
    assert.equal(first.answerType, "WORD_OR_LABEL");
    assert.equal(first.metadata.runtimeVersion, "cod-cp008-runtime-v1");
    assert.equal(first.metadata.solveContractId, contract.solveContractId);
    assert.equal(first.metadata.sourcePrototypeId, contract.prototypeId);
    assert.equal(first.metadata.oneStepOnly, true);
    assert.equal(first.metadata.solverAgreement, true);
    assert.equal(first.metadata.ordinaryAnswerUnique, true);
    assert.equal(first.metadata.mappingInjective, true);
    assert.equal(first.metadata.identityEdges, 0);

    const mappingAudit = auditCp008Mapping(first.structuredPrompt.mapping);
    assert.equal(mappingAudit.accepted, true);
    assert.equal(solveCp008Prompt(first.structuredPrompt), first.metadata.correctAnswer);

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.options[first.correctIndex]?.value, first.metadata.correctAnswer);
    assert.notEqual(first.metadata.correctAnswer, first.structuredPrompt.ordinaryAnswer);

    assert.ok(first.explanation.referenceAid && first.explanation.referenceAid.length >= 2);
    assert.ok(first.explanation.quickMethod && first.explanation.quickMethod.length > 30);
    assert.ok(first.explanation.ruleStatement.length > 30);
    assert.ok(first.explanation.targetApplication.length >= 1);
    assert.ok(first.explanation.conclusion.includes(first.metadata.correctAnswer));
    assert.ok(first.explanation.commonTrapAlert && first.explanation.commonTrapAlert.length > 25);
    assert.doesNotMatch(JSON.stringify(first), /permanentQlId":null/);
    assert.doesNotMatch(`${first.stem}${JSON.stringify(first.explanation)}`, /prototype|fingerprint|registry|parameter domain/i);

    if (contract.qlId === "COD-QL-173") {
      assert.equal(first.structuredPrompt.taskKind, "DIRECT_LABEL_QUERY");
      assert.ok(first.structuredPrompt.directTarget);
      assert.equal(first.structuredPrompt.semanticFactId, undefined);
      assert.equal(first.metadata.factCategory, undefined);
    } else {
      assert.equal(first.structuredPrompt.taskKind, "SEMANTIC_REFERENT_QUERY");
      assert.ok(first.structuredPrompt.semanticFactId);
      assert.ok(first.structuredPrompt.semanticQuestion);
      assert.ok(first.metadata.factCategory);
      semanticFactIds.add(first.structuredPrompt.semanticFactId!);
      factCategories.add(first.metadata.factCategory!);
    }

    answerPositions[first.correctIndex] += 1;
    difficulties.add(first.difficulty);
    renderers.add(first.renderer);
    topologies.add(first.metadata.topology);
    taskKinds.add(first.structuredPrompt.taskKind);
    stems.add(first.stem);
    first.options.filter((option) => !option.isCorrect).forEach((option) => errorLabels.add(option.errorLabel ?? ""));
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 400);
assert.ok(stems.size >= 380, `Expected at least 380 distinct stems, received ${stems.size}`);
assert.ok(answerPositions.every((count) => count > 60), `Answer positions are imbalanced: ${answerPositions.join(", ")}`);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.deepEqual([...topologies].sort(), ["CYCLE", "OPEN_CHAIN"]);
assert.deepEqual([...factCategories].sort(), ["ATTRIBUTE", "CATEGORY", "FUNCTION", "ROLE"]);
assert.equal(semanticFactIds.size, CP008_SEMANTIC_FACTS.length);
assert.deepEqual([...taskKindsByQl.get("COD-QL-173")!], ["DIRECT_LABEL_QUERY"]);
assert.deepEqual([...taskKindsByQl.get("COD-QL-174")!], ["SEMANTIC_REFERENT_QUERY"]);
assert.ok(errorLabels.has("NO_RENAMING_APPLIED"));
assert.ok(errorLabels.has("FOLLOWED_RENAMING_TWICE"));
assert.ok(errorLabels.has("INVERSE_RENAMING_DIRECTION") || errorLabels.has("WRONG_ORDINARY_REFERENT"));

console.log("COD-CP-008 permanent English runtime audit passed.", {
  qlRange: "COD-QL-173..174",
  generatedCount,
  distinctStems: stems.size,
  answerPositions,
  difficulties: [...difficulties],
  renderers: [...renderers],
  topologies: [...topologies],
  semanticFacts: semanticFactIds.size,
  factCategories: [...factCategories],
});
