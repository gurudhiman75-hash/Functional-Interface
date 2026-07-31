import assert from "node:assert/strict";
import {
  CLS_CP004_DIVISIBILITY_RULE_IDS,
  CLS_CP004_NUMBER_DOMAIN,
  CLS_CP004_PROTOTYPES,
  CLS_CP004_RULE_IDS,
  clsCp004DivisorForRule,
  clsCp004RuleValue,
} from "./number-domain";
import { generateClsCp004DiscoveryQuestion } from "./discovery-runtime";
import {
  analyzeClsCp004Number,
  auditClsCp004DisplayedNumbers,
  getClsCp004DomainSummary,
  getClsCp004PrototypeDefinitions,
  independentlyVerifyClsCp004Question,
} from "./runtime";

assert.equal(CLS_CP004_PROTOTYPES.length, 13);
assert.equal(getClsCp004PrototypeDefinitions().length, 13);
assert.equal(CLS_CP004_RULE_IDS.length, 22);
assert.equal(CLS_CP004_DIVISIBILITY_RULE_IDS.length, 10);
assert.equal(CLS_CP004_NUMBER_DOMAIN.length, 998);
assert.deepEqual(getClsCp004DomainSummary(), {
  datasetVersion: "CLS-CP004-NUMBER-DOMAIN-v1",
  minimum: 2,
  maximum: 999,
  numberCount: 998,
  ruleCount: 22,
  prototypeCount: 13,
  permanentQlCount: 0,
  locale: "en-IN",
});

const features36 = analyzeClsCp004Number(36);
assert.equal(features36.digitCount, 2);
assert.equal(features36.parity, "EVEN");
assert.equal(features36.primalityClass, "COMPOSITE");
assert.equal(features36.perfectSquare, true);
assert.equal(features36.perfectCube, false);
assert.equal(features36.divisorCount, 9);
assert.equal(features36.digitParityComposition, "MIXED");
assert.equal(features36.digitSum, 9);
assert.equal(features36.digitProduct, 18);
assert.equal(features36.palindrome, false);
assert.equal(features36.triangular, true);

const features64 = analyzeClsCp004Number(64);
assert.equal(features64.perfectSquare, true);
assert.equal(features64.perfectCube, true);
assert.equal(features64.divisorCount, 7);
assert.equal(features64.digitParityComposition, "ALL_EVEN");

const features121 = analyzeClsCp004Number(121);
assert.equal(features121.palindrome, true);
assert.equal(features121.digitSum, 4);
assert.equal(features121.digitProduct, 2);
assert.equal(features121.digitParityComposition, "MIXED");

assert.equal(analyzeClsCp004Number(24).nearPowerClass, "ONE_BELOW_SQUARE");
assert.equal(analyzeClsCp004Number(26).nearPowerClass, "MULTIPLE_NEAR_POWER_RELATIONS");
assert.equal(analyzeClsCp004Number(28).triangular, true);
assert.equal(analyzeClsCp004Number(29).primalityClass, "PRIME");
assert.throws(() => analyzeClsCp004Number(1));
assert.throws(() => analyzeClsCp004Number(1000));
assert.throws(() => analyzeClsCp004Number(4.5));

for (const ruleId of CLS_CP004_DIVISIBILITY_RULE_IDS) {
  const divisor = clsCp004DivisorForRule(ruleId)!;
  assert.equal(clsCp004RuleValue(analyzeClsCp004Number(divisor * 2), ruleId), "DIVISIBLE");
  assert.equal(clsCp004RuleValue(analyzeClsCp004Number(divisor * 2 + 1), ruleId), "NOT_DIVISIBLE");
}

const squareFixture = auditClsCp004DisplayedNumbers([4, 9, 25, 360], "PERFECT_SQUARE_STATUS");
assert.equal(squareFixture.result, "UNIQUE");
assert.equal(squareFixture.outlierIndex, 3);
assert.equal(squareFixture.intendedRuleSupported, true);
assert.ok(squareFixture.candidateSupports.some((support) => support.ruleId === "DIVISOR_COUNT"));
assert.ok(squareFixture.candidateSupports.every((support) => support.outlierIndex === 3));

const ambiguousFixture = auditClsCp004DisplayedNumbers([2, 3, 5, 9]);
assert.equal(ambiguousFixture.result, "AMBIGUOUS");
assert.ok(ambiguousFixture.candidateSupports.some((support) => support.ruleId === "PARITY"));
assert.ok(ambiguousFixture.candidateSupports.some((support) => support.ruleId === "PRIMALITY_CLASS"));

const duplicateFixture = auditClsCp004DisplayedNumbers([9, 9, 16, 25]);
assert.equal(duplicateFixture.result, "NO_VALID_RULE");

const fingerprints = new Set<string>();
const prototypeCoverage = new Map<string, number>();
const ruleCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const intendedValueCoverage = new Map<string, Set<string>>();
const answerPositionsByOptionCount = new Map<4 | 5, number[]>([
  [4, [0, 0, 0, 0, 0]],
  [5, [0, 0, 0, 0, 0]],
]);
let generatedCount = 0;

for (const prototype of CLS_CP004_PROTOTYPES) {
  for (const optionCount of [4, 5] as const) {
    for (let seed = 0; seed < 70; seed += 1) {
      const question = generateClsCp004DiscoveryQuestion(prototype.prototypeId, seed, optionCount);
      const replay = generateClsCp004DiscoveryQuestion(prototype.prototypeId, seed, optionCount);
      assert.deepEqual(question, replay, `${prototype.prototypeId}/${optionCount}/${seed} is not deterministic`);

      assert.equal(question.checkpointId, "CLS-CP-004");
      assert.equal(question.prototypeId, prototype.prototypeId);
      assert.equal(question.seed, seed);
      assert.equal(question.task, "FIND_NUMBER_PROPERTY_OUTLIER");
      assert.equal(question.generationProfile, prototype.generationProfile);
      assert.ok(prototype.allowedRuleIds.includes(question.intendedRuleId));
      assert.equal(question.numbers.length, optionCount);
      assert.equal(question.options.length, optionCount);
      assert.equal(new Set(question.numbers).size, optionCount);
      assert.deepEqual(question.options, question.numbers.map(String));
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(question.evidenceByOption.length, optionCount);
      assert.equal(question.ambiguityAudit.result, "UNIQUE");
      assert.equal(question.ambiguityAudit.outlierIndex, question.correctIndex);
      assert.equal(question.ambiguityAudit.intendedRuleSupported, true);
      assert.ok(question.ambiguityAudit.candidateSupports.some((support) =>
        support.ruleId === question.intendedRuleId
        && support.commonValue === question.intendedRuleValue
        && support.outlierIndex === question.correctIndex,
      ));
      assert.equal(question.metadata.datasetVersion, "CLS-CP004-NUMBER-DOMAIN-v1");
      assert.equal(question.metadata.runtimeVersion, "cls-cp004-discovery-v1");
      assert.equal(question.metadata.locale, "en-IN");
      assert.equal(question.metadata.optionCount, optionCount);
      assert.equal(question.metadata.domainMinimum, 2);
      assert.equal(question.metadata.domainMaximum, 999);
      assert.equal(question.metadata.sourceSaturationStatus, "OPEN_FILE_LIBRARY_RETRY_REQUIRED");
      assert.equal(question.lifecycle.permanentQlId, null);
      assert.equal(question.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY");
      assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(question.lifecycle.publiclyPublishable, false);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.explanation.coreConcept.length, 1);
      assert.equal(question.explanation.stepByStep.length, 3);
      assert.equal(question.explanation.examSpeedShortcut.length, 1);
      assert.equal(question.explanation.commonTrapWarning.length, 1);
      assert.ok(question.explanation.stepByStep.join(" ").includes(question.answer));

      if (question.generationProfile === "DIGIT_PRODUCT_OUTLIER") {
        assert.ok(question.numbers.every((number) => !String(number).includes("0")));
        assert.ok(question.numbers.every((number) => analyzeClsCp004Number(number).digitProduct > 0));
      }
      if (question.generationProfile === "NEAR_POWER_OUTLIER") {
        assert.ok(question.numbers.every((number) =>
          analyzeClsCp004Number(number).nearPowerClass !== "MULTIPLE_NEAR_POWER_RELATIONS",
        ));
      }

      const independent = independentlyVerifyClsCp004Question(question);
      assert.equal(independent.result, "UNIQUE");
      assert.equal(independent.outlierIndex, question.correctIndex);
      assert.equal(independent.intendedRuleSupported, true);

      const learnerText = [
        question.stem,
        ...question.options,
        question.answer,
        ...question.explanation.coreConcept,
        ...question.explanation.stepByStep,
        ...question.explanation.examSpeedShortcut,
        ...question.explanation.commonTrapWarning,
      ].join("\n");
      assert.ok(!/CLS-|PROT-|DIVISIBLE_BY_|PERFECT_SQUARE_STATUS|NEAR_POWER_CLASS|candidate property|dataset version|polynomial/i.test(learnerText));
      const placeholderMatch = learnerText.match(/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/);
      assert.equal(
        placeholderMatch,
        null,
        `${prototype.prototypeId}/${optionCount}/${seed} leaked ${placeholderMatch?.[1]}:\n${learnerText}`,
      );

      const fingerprint = JSON.stringify({
        prototypeId: question.prototypeId,
        optionCount,
        stem: question.stem,
        numbers: question.numbers,
        answer: question.answer,
      });
      fingerprints.add(fingerprint);
      prototypeCoverage.set(prototype.prototypeId, (prototypeCoverage.get(prototype.prototypeId) ?? 0) + 1);
      ruleCoverage.add(question.intendedRuleId);
      const values = intendedValueCoverage.get(question.intendedRuleId) ?? new Set<string>();
      values.add(question.intendedRuleValue);
      intendedValueCoverage.set(question.intendedRuleId, values);
      difficultyCoverage.add(question.difficulty);
      optionCountCoverage.add(optionCount);
      answerPositionsByOptionCount.get(optionCount)![question.correctIndex] += 1;
      generatedCount += 1;
    }
  }
}

assert.equal(generatedCount, 1820);
assert.equal(fingerprints.size, 1820);
assert.deepEqual([...prototypeCoverage.values()], Array(13).fill(140));
assert.equal(ruleCoverage.size, CLS_CP004_RULE_IDS.length);
assert.deepEqual(
  [...CLS_CP004_RULE_IDS].filter((ruleId) => !ruleCoverage.has(ruleId)),
  [],
);
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.ok(intendedValueCoverage.get("PARITY")!.size === 2);
assert.ok(intendedValueCoverage.get("PRIMALITY_CLASS")!.size === 2);
assert.ok(intendedValueCoverage.get("PERFECT_SQUARE_STATUS")!.size === 2);
assert.ok(intendedValueCoverage.get("PERFECT_CUBE_STATUS")!.size === 2);
assert.ok(intendedValueCoverage.get("PALINDROME_STATUS")!.size === 2);
assert.ok(intendedValueCoverage.get("TRIANGULAR_STATUS")!.size === 2);
for (const [optionCount, positions] of answerPositionsByOptionCount) {
  const relevant = positions.slice(0, optionCount);
  assert.ok(relevant.every((count) => count > 0), `${optionCount}-option answer position missing: ${positions}`);
  assert.ok(Math.max(...relevant) / Math.min(...relevant) < 1.8, `${optionCount}-option answer positions are imbalanced: ${positions}`);
}

assert.throws(() => generateClsCp004DiscoveryQuestion("CLS-CP004-PROT-001", -1));
assert.throws(() => generateClsCp004DiscoveryQuestion("CLS-CP004-PROT-001", 0, 3 as never));
assert.throws(() => generateClsCp004DiscoveryQuestion("CLS-CP004-PROT-999" as never, 0));
assert.throws(() => auditClsCp004DisplayedNumbers([2, 3, 5]));

console.log("CLS-CP-004 number-property discovery audit passed.", {
  generatedCount,
  uniqueVisibleQuestions: fingerprints.size,
  domainSize: CLS_CP004_NUMBER_DOMAIN.length,
  prototypes: prototypeCoverage.size,
  admittedRules: CLS_CP004_RULE_IDS.length,
  exercisedRules: ruleCoverage.size,
  difficulties: [...difficultyCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
  answerPositionsByOptionCount: Object.fromEntries(answerPositionsByOptionCount),
  permanentQlCount: 0,
  runtimeMode: "CURATED_CANONICAL_STATE_PLUS_DETERMINISTIC_PERMUTATION",
  sourceSaturationStatus: "OPEN_FILE_LIBRARY_RETRY_REQUIRED",
});