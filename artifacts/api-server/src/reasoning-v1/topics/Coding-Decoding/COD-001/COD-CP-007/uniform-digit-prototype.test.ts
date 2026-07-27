import assert from "node:assert/strict";

import { validateOptions } from "../foundation/option-validator";
import { UNIFORM_DIGIT_PROTOTYPE_CONTRACTS } from "./uniform-digit-contracts";
import {
  digitSequenceRoundTrip,
  digitSequenceTokens,
  generateUniformDigitPrototypeQuestion,
} from "./uniform-digit-generator";
import {
  inferUniformShiftSurvivors,
  inverseTranslateDigitSequence,
  translateDigitSequence,
} from "./uniform-digit-rule";
import {
  solveUniformDigitPrompt,
  verifyUniformDigitAnswer,
} from "./uniform-digit-solver";

assert.equal(UNIFORM_DIGIT_PROTOTYPE_CONTRACTS.length, 5);
assert.equal(new Set(UNIFORM_DIGIT_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId)).size, 5);
assert.equal(translateDigitSequence("35674", 2), "57896");
assert.equal(translateDigitSequence("890", 2), "012");
assert.equal(inverseTranslateDigitSequence("012", 2), "890");
assert.equal(digitSequenceRoundTrip("0472", 7), "0472");
assert.deepEqual(digitSequenceTokens("0472"), ["0", "4", "7", "2"]);

const answerPositionsByPrototype = new Map<string, Set<number>>();
const shiftsByPrototype = new Map<string, Set<number>>();
const renderers = new Set<string>();
const difficulties = new Set<string>();
const tasks = new Set<string>();
const stems = new Set<string>();
const completeQuestions = new Set<string>();
let generated = 0;
let leadingSource = 0;
let leadingCode = 0;
let repeatedTargets = 0;
let wrappedTargets = 0;
let missingFirst = 0;
let missingMiddle = 0;
let missingLast = 0;
let inverseQuestions = 0;
let explicitRuleQuestions = 0;

for (const contract of UNIFORM_DIGIT_PROTOTYPE_CONTRACTS) {
  const positions = new Set<number>();
  const shifts = new Set<number>();
  const prototypeStems = new Set<string>();

  for (let seed = 1; seed <= 100; seed += 1) {
    const first = generateUniformDigitPrototypeQuestion(contract.prototypeId, seed);
    const second = generateUniformDigitPrototypeQuestion(contract.prototypeId, seed);
    assert.deepEqual(first, second, `${contract.prototypeId}/${seed} must be deterministic`);

    assert.equal(first.packageId, "COD-001");
    assert.equal(first.checkpointId, "COD-CP-007");
    assert.equal(first.prototypeId, contract.prototypeId);
    assert.equal(first.permanentQlId, null);
    assert.equal(first.prototypeOnly, true);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.ruleId, "UNIFORM_MODULAR_DIGIT_TRANSLATION");
    assert.equal(first.locale, "en-IN");
    assert.equal(first.answerType, contract.answerType);
    assert.equal(first.structuredPrompt.taskKind, contract.taskKind);
    assert.equal(first.metadata.runtimeVersion, "cod-cp007-uniform-digit-prototype-v1");
    assert.equal(first.metadata.ambiguityAccepted, true);
    assert.deepEqual(first.metadata.uniformShiftSurvivors, [first.metadata.shift]);
    assert.equal(first.metadata.wholeNumberDeltaSurvives, false);
    assert.deepEqual(first.metadata.reversedUniformShiftSurvivors, []);
    assert.equal(first.metadata.arbitraryDigitMapConsistent, true);
    assert.equal(first.metadata.inverseUnique, true);
    assert.equal(first.metadata.evidenceCount, 2);
    assert.deepEqual(first.metadata.sourceLengths, [5, 4]);
    assert.ok(first.metadata.shift >= 1 && first.metadata.shift <= 9);

    validateOptions(first.options);
    assert.equal(first.options[first.correctIndex]!.isCorrect, true);
    assert.equal(first.options[first.correctIndex]!.value, first.metadata.correctAnswer);
    assert.equal(solveUniformDigitPrompt(first.structuredPrompt), first.metadata.correctAnswer);
    assert.equal(
      verifyUniformDigitAnswer(first.structuredPrompt, first.metadata.correctAnswer, first.metadata.shift),
      true,
    );
    assert.deepEqual(
      inferUniformShiftSurvivors(first.structuredPrompt.evidence),
      [first.metadata.shift],
    );

    for (const evidence of first.structuredPrompt.evidence) {
      assert.match(evidence.source, /^\d+$/u);
      assert.match(evidence.code, /^\d+$/u);
      assert.equal(evidence.source.length, evidence.code.length);
      assert.equal(translateDigitSequence(evidence.source, first.metadata.shift), evidence.code);
    }

    assert.equal(first.structuredPrompt.targetSource.length, first.metadata.targetLength);
    assert.equal(first.structuredPrompt.targetCode.length, first.metadata.targetLength);
    assert.equal(
      translateDigitSequence(first.structuredPrompt.targetSource, first.metadata.shift),
      first.structuredPrompt.targetCode,
    );
    assert.equal(
      inverseTranslateDigitSequence(first.structuredPrompt.targetCode, first.metadata.shift),
      first.structuredPrompt.targetSource,
    );

    if (contract.taskKind === "RECOVER_MISSING_TOKEN") {
      const missingIndex = first.structuredPrompt.missingIndex!;
      assert.ok(missingIndex >= 0 && missingIndex < first.metadata.targetLength);
      assert.equal(first.structuredPrompt.displayedTargetCode!.length, first.metadata.targetLength);
      assert.equal(first.structuredPrompt.displayedTargetCode![missingIndex], "?");
      assert.equal(first.metadata.correctAnswer.length, 1);
      if (missingIndex === 0) missingFirst += 1;
      else if (missingIndex === first.metadata.targetLength - 1) missingLast += 1;
      else missingMiddle += 1;
    } else {
      assert.equal(first.structuredPrompt.displayedTargetCode, undefined);
      assert.equal(first.structuredPrompt.missingIndex, undefined);
      assert.equal(first.metadata.correctAnswer.length, first.metadata.targetLength);
    }

    if (contract.taskKind === "DECODE_TARGET") {
      inverseQuestions += 1;
      assert.equal(first.metadata.correctAnswer, first.structuredPrompt.targetSource);
    }
    if (contract.taskKind === "ENCODE_TARGET") {
      explicitRuleQuestions += 1;
      assert.equal(first.structuredPrompt.ruleDisclosure, "EXPLICIT");
    } else {
      assert.equal(first.structuredPrompt.ruleDisclosure, "INFER_FROM_EVIDENCE");
    }

    const explanationText = JSON.stringify(first.explanation);
    assert.ok(first.stem.length >= 90 && first.stem.length <= 700);
    assert.ok(explanationText.length >= 300 && explanationText.length <= 2200);
    assert.equal(first.stem.includes("COD-CP"), false);
    assert.equal(first.stem.includes("UNIFORM_MODULAR"), false);
    assert.equal(explanationText.includes("COD-CP"), false);
    assert.equal(explanationText.includes("fingerprint"), false);
    assert.equal(explanationText.includes(first.metadata.correctAnswer), true);
    assert.ok(first.explanation.commonTrapAlert);
    assert.equal(first.explanation.commonTrapAlert!.includes(first.options.find((option) => !option.isCorrect)!.value), true);

    positions.add(first.correctIndex);
    shifts.add(first.metadata.shift);
    renderers.add(first.renderer);
    difficulties.add(first.difficulty);
    tasks.add(first.structuredPrompt.taskKind);
    prototypeStems.add(first.stem);
    stems.add(first.stem);
    completeQuestions.add(JSON.stringify({
      prototypeId: first.prototypeId,
      stem: first.stem,
      prompt: first.structuredPrompt,
      options: first.options.map((option) => option.value),
    }));
    if (first.metadata.leadingZeroInSource) leadingSource += 1;
    if (first.metadata.leadingZeroInCode) leadingCode += 1;
    if (first.metadata.repeatedDigitInTarget) repeatedTargets += 1;
    if (first.metadata.wrapCount > 0) wrappedTargets += 1;
    generated += 1;
  }

  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${contract.prototypeId} must reach all answer positions`);
  assert.deepEqual([...shifts].sort((left, right) => left - right), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.ok(prototypeStems.size >= 98, `${contract.prototypeId} has only ${prototypeStems.size}/100 unique stems`);
  answerPositionsByPrototype.set(contract.prototypeId, positions);
  shiftsByPrototype.set(contract.prototypeId, shifts);
}

assert.equal(generated, 500);
assert.equal(completeQuestions.size, generated);
assert.equal(stems.size, generated);
assert.deepEqual([...tasks].sort(), [
  "CHOOSE_MATCHING_CODE",
  "DECODE_TARGET",
  "ENCODE_TARGET",
  "INFER_AND_ENCODE",
  "RECOVER_MISSING_TOKEN",
]);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.ok(leadingSource > 0);
assert.ok(leadingCode > 0);
assert.ok(repeatedTargets > 0);
assert.ok(wrappedTargets > 0);
assert.ok(missingFirst > 0);
assert.ok(missingMiddle > 0);
assert.ok(missingLast > 0);
assert.equal(inverseQuestions, 100);
assert.equal(explicitRuleQuestions, 100);

console.log(JSON.stringify({
  checkpointId: "COD-CP-007",
  family: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
  prototypeContracts: UNIFORM_DIGIT_PROTOTYPE_CONTRACTS.length,
  generated,
  distinctQuestions: completeQuestions.size,
  distinctStems: stems.size,
  renderers: [...renderers].sort(),
  difficulties: [...difficulties].sort(),
  leadingSource,
  leadingCode,
  repeatedTargets,
  wrappedTargets,
  missingPositions: { first: missingFirst, middle: missingMiddle, last: missingLast },
  verdict: "PROTOTYPE SATURATION PASS; NO PERMANENT QLS ALLOCATED",
}, null, 2));
