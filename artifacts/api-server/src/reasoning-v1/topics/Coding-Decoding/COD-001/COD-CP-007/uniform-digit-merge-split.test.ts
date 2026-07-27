import assert from "node:assert/strict";

import { UNIFORM_DIGIT_PROTOTYPE_CONTRACTS } from "./uniform-digit-contracts";
import {
  provisionalSolveContractFor,
  UNIFORM_DIGIT_PROVISIONAL_SOLVE_CONTRACTS,
  UNIFORM_DIGIT_TASK_DISPOSITIONS,
} from "./uniform-digit-merge-split";
import { translateDigitSequence } from "./uniform-digit-rule";
import { generateUniformDigitPrototypeQuestion } from "./uniform-digit-runtime";

assert.equal(UNIFORM_DIGIT_PROTOTYPE_CONTRACTS.length, 5);
assert.equal(UNIFORM_DIGIT_TASK_DISPOSITIONS.length, 5);
assert.equal(UNIFORM_DIGIT_PROVISIONAL_SOLVE_CONTRACTS.length, 3);
assert.equal(new Set(UNIFORM_DIGIT_PROVISIONAL_SOLVE_CONTRACTS).size, 3);
assert.deepEqual(
  [...UNIFORM_DIGIT_TASK_DISPOSITIONS.map((entry) => entry.prototypeId)].sort(),
  [...UNIFORM_DIGIT_PROTOTYPE_CONTRACTS.map((entry) => entry.prototypeId)].sort(),
  "Every prototype must have exactly one merge/split disposition",
);

const forwardPrototypeIds = new Set([
  "COD-CP007-PROT-UNIFORM-DIGIT-ENCODE",
  "COD-CP007-PROT-UNIFORM-DIGIT-INFER-ENCODE",
  "COD-CP007-PROT-UNIFORM-DIGIT-CHOOSE-MATCHING",
]);

const semanticFingerprints = new Set<string>();
const solveContractsReached = new Set<string>();
const prototypeCounts: Record<string, number> = {};
let generated = 0;
let forwardQuestions = 0;
let inverseQuestions = 0;
let missingQuestions = 0;

for (const contract of UNIFORM_DIGIT_PROTOTYPE_CONTRACTS) {
  prototypeCounts[contract.prototypeId] = 0;
  const disposition = UNIFORM_DIGIT_TASK_DISPOSITIONS.find((entry) => entry.prototypeId === contract.prototypeId)!;
  assert.equal(disposition.taskKind, contract.taskKind);
  assert.equal(provisionalSolveContractFor(contract.prototypeId), disposition.provisionalSolveContract);

  for (let seed = 1; seed <= 100; seed += 1) {
    const question = generateUniformDigitPrototypeQuestion(contract.prototypeId, seed);
    const solveContract = provisionalSolveContractFor(question.prototypeId);
    solveContractsReached.add(solveContract);

    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.ruleId, "UNIFORM_MODULAR_DIGIT_TRANSLATION");
    assert.equal(question.options[question.correctIndex]!.value, question.metadata.correctAnswer);

    if (forwardPrototypeIds.has(question.prototypeId)) {
      assert.equal(solveContract, "FORWARD_UNIFORM_DIGIT_TRANSLATION");
      assert.equal(question.answerType, "DIGIT_SEQUENCE");
      assert.equal(question.metadata.correctAnswer, question.structuredPrompt.targetCode);
      assert.equal(
        question.metadata.correctAnswer,
        translateDigitSequence(question.structuredPrompt.targetSource, question.metadata.shift),
      );
      semanticFingerprints.add("FORWARD:DIGIT_SEQUENCE:TRANSLATE_COMPLETE_TARGET");
      forwardQuestions += 1;
    } else if (question.prototypeId === "COD-CP007-PROT-UNIFORM-DIGIT-DECODE") {
      assert.equal(solveContract, "INVERSE_UNIFORM_DIGIT_TRANSLATION");
      assert.equal(question.answerType, "DIGIT_SEQUENCE");
      assert.equal(question.metadata.correctAnswer, question.structuredPrompt.targetSource);
      assert.equal(
        translateDigitSequence(question.metadata.correctAnswer, question.metadata.shift),
        question.structuredPrompt.targetCode,
      );
      semanticFingerprints.add("INVERSE:DIGIT_SEQUENCE:RECOVER_COMPLETE_SOURCE");
      inverseQuestions += 1;
    } else {
      assert.equal(question.prototypeId, "COD-CP007-PROT-UNIFORM-DIGIT-MISSING");
      assert.equal(solveContract, "MISSING_MEMBER_UNIFORM_DIGIT_TRANSLATION");
      assert.equal(question.answerType, "SINGLE_CODE_TOKEN");
      assert.ok(question.structuredPrompt.missingIndex !== undefined);
      assert.equal(
        question.metadata.correctAnswer,
        question.structuredPrompt.targetCode[question.structuredPrompt.missingIndex!],
      );
      semanticFingerprints.add("FORWARD:SINGLE_CODE_TOKEN:RECOVER_ONE_TARGET_MEMBER");
      missingQuestions += 1;
    }

    prototypeCounts[contract.prototypeId] += 1;
    generated += 1;
  }
}

assert.deepEqual(
  [...solveContractsReached].sort(),
  [...UNIFORM_DIGIT_PROVISIONAL_SOLVE_CONTRACTS].sort(),
);
assert.deepEqual([...semanticFingerprints].sort(), [
  "FORWARD:DIGIT_SEQUENCE:TRANSLATE_COMPLETE_TARGET",
  "FORWARD:SINGLE_CODE_TOKEN:RECOVER_ONE_TARGET_MEMBER",
  "INVERSE:DIGIT_SEQUENCE:RECOVER_COMPLETE_SOURCE",
]);
assert.equal(generated, 500);
assert.equal(forwardQuestions, 300);
assert.equal(inverseQuestions, 100);
assert.equal(missingQuestions, 100);
assert.deepEqual(Object.values(prototypeCounts), [100, 100, 100, 100, 100]);

const forwardDispositions = UNIFORM_DIGIT_TASK_DISPOSITIONS.filter(
  (entry) => entry.provisionalSolveContract === "FORWARD_UNIFORM_DIGIT_TRANSLATION",
);
assert.equal(forwardDispositions.length, 3);
assert.equal(forwardDispositions.filter((entry) => entry.disposition === "RETAIN").length, 1);
assert.equal(forwardDispositions.filter((entry) => entry.disposition === "MERGE_AS_PRESENTATION").length, 2);

console.log(JSON.stringify({
  checkpointId: "COD-CP-007",
  family: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
  prototypeTaskContracts: UNIFORM_DIGIT_PROTOTYPE_CONTRACTS.length,
  provisionalSolveContracts: UNIFORM_DIGIT_PROVISIONAL_SOLVE_CONTRACTS.length,
  generated,
  questionDistribution: {
    forwardCompleteSequence: forwardQuestions,
    inverseCompleteSequence: inverseQuestions,
    missingSingleToken: missingQuestions,
  },
  mergeDecision: {
    explicitEncode: "MERGE_AS_PRESENTATION",
    inferAndEncode: "RETAIN_FORWARD_AUTHORITY",
    chooseMatching: "MERGE_AS_PRESENTATION",
    inverseDecode: "RETAIN_SEPARATELY",
    missingToken: "RETAIN_SEPARATELY",
  },
  permanentQlIdsAllocated: 0,
  verdict: "FIVE PROTOTYPE TASKS RESOLVE TO THREE PROVISIONAL SOLVE CONTRACTS",
}, null, 2));
