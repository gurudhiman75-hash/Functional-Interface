import assert from "node:assert/strict";

import {
  COD_CP007_PERMANENT_CONTRACTS,
  type Cp007QlId,
} from "./cp007-permanent-contracts";
import { generateCp007Question } from "./cp007-runtime";

assert.deepEqual(
  COD_CP007_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  ["COD-QL-169", "COD-QL-170", "COD-QL-171", "COD-QL-172"],
);
assert.equal(COD_CP007_PERMANENT_CONTRACTS.length, 4);
assert.equal(new Set(COD_CP007_PERMANENT_CONTRACTS.map((contract) => contract.solveContractId)).size, 4);
assert.ok(COD_CP007_PERMANENT_CONTRACTS.every((contract) => !contract.publiclyPublishable));
assert.ok(COD_CP007_PERMANENT_CONTRACTS.every((contract) => !contract.questionStudioVisible));

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const renderers = new Set<string>();
const taskKindsByQl = new Map<Cp007QlId, Set<string>>();
const stems = new Set<string>();
let generatedCount = 0;
let leadingZeroSourceCount = 0;
let leadingZeroCodeCount = 0;
let wrappedTargetCount = 0;
let missingFirst = 0;
let missingMiddle = 0;
let missingFinal = 0;

for (const contract of COD_CP007_PERMANENT_CONTRACTS) {
  const taskKinds = new Set<string>();
  taskKindsByQl.set(contract.qlId, taskKinds);

  for (let seed = 0; seed < 100; seed += 1) {
    const first = generateCp007Question(contract.qlId, seed);
    const repeat = generateCp007Question(contract.qlId, seed);
    assert.deepEqual(repeat, first, `${contract.qlId}/${seed} must be deterministic.`);

    assert.equal(first.qlId, contract.qlId);
    assert.equal(first.permanentQlId, contract.qlId);
    assert.equal(first.checkpointId, "COD-CP-007");
    assert.equal(first.ruleId, "UNIFORM_MODULAR_DIGIT_TRANSLATION");
    assert.equal(first.prototypeOnly, false);
    assert.equal(first.reviewOnly, true);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioVisible, false);
    assert.equal(first.locale, "en-IN");
    assert.equal(first.metadata.runtimeVersion, "cod-cp007-runtime-v1");
    assert.equal(first.metadata.solveContractId, contract.solveContractId);
    assert.ok(contract.prototypeIds.includes(first.metadata.sourcePrototypeId));
    assert.equal(first.metadata.ambiguityAccepted, true);
    assert.equal(first.metadata.wholeNumberDeltaSurvives, false);
    assert.equal(first.metadata.inverseUnique, true);
    assert.equal(first.metadata.uniformShiftSurvivors.length, 1);

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.options[first.correctIndex]?.value, first.metadata.correctAnswer);
    assert.ok(first.explanation.referenceAid.length >= 2);
    assert.ok(first.explanation.ruleStatement.length > 20);
    assert.ok(first.explanation.targetApplication.length >= 1);
    assert.ok(first.explanation.conclusion.includes(first.metadata.correctAnswer));
    assert.ok(first.explanation.commonTrapAlert.length > 20);
    assert.ok(!JSON.stringify(first).includes("permanentQlId\":null"));

    if (contract.qlId === "COD-QL-169") {
      assert.equal(first.structuredPrompt.taskKind, "ENCODE_TARGET");
      assert.equal(first.structuredPrompt.ruleDisclosure, "EXPLICIT");
    } else if (contract.qlId === "COD-QL-170") {
      assert.equal(first.structuredPrompt.taskKind, "DECODE_TARGET");
      assert.equal(first.structuredPrompt.ruleDisclosure, "INFER_FROM_EVIDENCE");
    } else if (contract.qlId === "COD-QL-171") {
      assert.equal(first.structuredPrompt.taskKind, "RECOVER_MISSING_TOKEN");
      assert.equal(first.answerType, "SINGLE_CODE_TOKEN");
      const missingIndex = first.structuredPrompt.missingIndex;
      assert.notEqual(missingIndex, undefined);
      assert.ok(first.structuredPrompt.displayedTargetCode?.includes("?"));
      if (missingIndex === 0) missingFirst += 1;
      else if (missingIndex === first.structuredPrompt.targetCode.length - 1) missingFinal += 1;
      else missingMiddle += 1;
    } else {
      assert.ok(
        first.structuredPrompt.taskKind === "INFER_AND_ENCODE" ||
          first.structuredPrompt.taskKind === "CHOOSE_MATCHING_CODE",
      );
      assert.equal(first.structuredPrompt.ruleDisclosure, "INFER_FROM_EVIDENCE");
    }

    answerPositions[first.correctIndex] += 1;
    difficulties.add(first.difficulty);
    renderers.add(first.renderer);
    taskKinds.add(first.structuredPrompt.taskKind);
    stems.add(first.stem);
    if (first.metadata.leadingZeroInSource) leadingZeroSourceCount += 1;
    if (first.metadata.leadingZeroInCode) leadingZeroCodeCount += 1;
    if (first.metadata.wrapCount > 0) wrappedTargetCount += 1;
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 400);
assert.equal(stems.size, 400);
assert.ok(answerPositions.every((count) => count > 70), `Answer positions are imbalanced: ${answerPositions.join(", ")}`);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.ok(leadingZeroSourceCount > 20);
assert.ok(leadingZeroCodeCount > 20);
assert.ok(wrappedTargetCount > 200);
assert.ok(missingFirst > 0 && missingMiddle > 0 && missingFinal > 0);
assert.deepEqual([...taskKindsByQl.get("COD-QL-169")!], ["ENCODE_TARGET"]);
assert.deepEqual([...taskKindsByQl.get("COD-QL-170")!], ["DECODE_TARGET"]);
assert.deepEqual([...taskKindsByQl.get("COD-QL-171")!], ["RECOVER_MISSING_TOKEN"]);
assert.deepEqual(
  [...taskKindsByQl.get("COD-QL-172")!].sort(),
  ["CHOOSE_MATCHING_CODE", "INFER_AND_ENCODE"],
);

console.log("COD-CP-007 permanent English runtime audit passed.", {
  qlRange: "COD-QL-169..172",
  generatedCount,
  answerPositions,
  difficulties: [...difficulties],
  renderers: [...renderers],
  leadingZeroSourceCount,
  leadingZeroCodeCount,
  wrappedTargetCount,
  missingPositions: { first: missingFirst, middle: missingMiddle, final: missingFinal },
});
