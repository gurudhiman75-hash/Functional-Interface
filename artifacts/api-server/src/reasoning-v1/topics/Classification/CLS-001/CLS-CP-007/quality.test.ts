import assert from "node:assert/strict";
import { independentlyVerifyClsCp007Question } from "./audit";
import {
  CLS_CP007_PROTOTYPES,
  clsCp007LetterPosition,
  clsCp007RepeatPattern,
  clsCp007SignedGaps,
} from "./cluster-domain";
import { generateClsCp007QualityQuestion } from "./quality-runtime-final";

const QUESTIONS_PER_PROTOTYPE = 12;
const fingerprints = new Set<string>();
const prototypeCoverage = new Map<string, number>();
const ruleCoverage = new Set<string>();
const lengthCoverage = new Set<number>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const answerPositions = [0, 0, 0, 0, 0];
const stemForms = new Map<string, Set<string>>();
let maximumCommonGroupAttempt = 0;
let maximumOutlierAttempt = 0;
let ratioQuestions = 0;
let topologyQuestions = 0;
let closeDistractorQuestions = 0;

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

function gapScale(gaps: readonly number[]): number {
  return gaps.reduce((current, gap) => gcd(current, gap), 0);
}

for (const prototype of CLS_CP007_PROTOTYPES) {
  const stems = new Set<string>();
  stemForms.set(prototype.prototypeId, stems);
  for (let seed = 0; seed < QUESTIONS_PER_PROTOTYPE; seed += 1) {
    const optionCount = seed % 3 === 0 ? 5 : 4;
    const question = generateClsCp007QualityQuestion(prototype.prototypeId, seed, optionCount);
    const replay = generateClsCp007QualityQuestion(prototype.prototypeId, seed, optionCount);
    assert.deepEqual(question, replay, `${prototype.prototypeId}/${seed} quality replay changed`);

    assert.equal(question.options.length, optionCount);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.ambiguityAudit.result, "UNIQUE");
    assert.equal(question.ambiguityAudit.answerIndex, question.correctIndex);
    assert.equal(question.ambiguityAudit.intendedRuleSupported, true);
    const independent = independentlyVerifyClsCp007Question(question);
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.answerIndex, question.correctIndex);

    const intendedSupport = question.ambiguityAudit.candidateSupports.find(
      (support) => support.ruleId === question.intendedRuleId,
    );
    assert.ok(intendedSupport, `${prototype.prototypeId}/${seed} lacks intended support`);
    const commonItems = intendedSupport.matchingOptionIndexes.map((index) => question.items[index]!);
    const outlierItem = question.items[intendedSupport.answerIndex]!;

    if (question.intendedRuleId !== "CLUSTER_REPEAT_PATTERN") {
      for (const item of question.items) {
        assert.equal(
          new Set(item.letters).size,
          item.letters.length,
          `${prototype.prototypeId}/${seed} exposes a repeated-letter shortcut`,
        );
      }
    } else {
      const commonUniqueCounts = new Set(commonItems.map((item) => new Set(item.letters).size));
      assert.equal(commonUniqueCounts.size, 1);
      assert.equal(new Set(outlierItem.letters).size, [...commonUniqueCounts][0]);
      assert.ok(new Set(outlierItem.letters).size >= 2);
      assert.ok(new Set(outlierItem.letters).size < outlierItem.letters.length);
      assert.notEqual(
        clsCp007RepeatPattern(outlierItem),
        clsCp007RepeatPattern(commonItems[0]!),
      );
      topologyQuestions += 1;
    }

    const nuisanceKeys = question.items.map((item) => {
      const vowels = item.letters.filter((letter) => "AEIOU".includes(letter)).length;
      const repeat = clsCp007RepeatPattern(item);
      if (question.intendedRuleId === "CLUSTER_VOWEL_COUNT") return `repeat=${repeat}`;
      if (question.intendedRuleId === "CLUSTER_REPEAT_PATTERN") {
        return `vowels=${vowels};unique=${new Set(item.letters).size}`;
      }
      return `vowels=${vowels};repeat=${repeat}`;
    });
    assert.equal(
      new Set(nuisanceKeys).size,
      1,
      `${prototype.prototypeId}/${seed} has a nuisance-feature giveaway`,
    );
    assert.equal(nuisanceKeys[0], question.qualityDiagnostics.commonNuisanceKey);

    if (question.intendedRuleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO") {
      const rawVectors = new Set(commonItems.map((item) => clsCp007SignedGaps(item).join(",")));
      const scales = new Set(commonItems.map((item) => gapScale(clsCp007SignedGaps(item))));
      assert.ok(rawVectors.size >= 2, "Ratio question collapsed to one raw vector.");
      assert.ok(scales.size >= 2, "Ratio question did not exercise multiple scales.");
      assert.ok(Math.max(...scales) > 1, "Ratio question never required reduction.");
      ratioQuestions += 1;
    }

    if (question.intendedRuleId === "CLUSTER_GAP_EQUALITY_PATTERN") {
      assert.ok(
        new Set(commonItems.map((item) => clsCp007SignedGaps(item).join(","))).size >= 2,
        "Equality-topology question collapsed to one exact vector.",
      );
      assert.ok(
        question.items.every((item) =>
          clsCp007SignedGaps(item).every((gap) => Math.abs(gap) <= 12),
        ),
        "Equality-topology question contains an extreme raw movement.",
      );
      topologyQuestions += 1;
    }

    if (
      question.intendedRuleId === "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS" ||
      question.intendedRuleId === "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS"
    ) {
      const total = outlierItem.letters
        .map(clsCp007LetterPosition)
        .reduce((sum, position) => sum + position, 0);
      assert.equal(total, 54, "Opposite-pair outlier leaked through total-position sum.");
    }

    if (question.intendedRuleId === "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS") {
      const p = outlierItem.letters.map(clsCp007LetterPosition);
      const miss = Math.abs(p[0]! + p[1]! - p[2]!);
      assert.ok(miss >= 1 && miss <= 4, `Equation outlier miss is too large: ${miss}`);
    }

    if (
      question.intendedRuleId === "CLUSTER_SIGNED_GAP_VECTOR" ||
      question.intendedRuleId === "CLUSTER_ABSOLUTE_GAP_VECTOR"
    ) {
      const values = intendedSupport.commonValue.split(",").map(Number);
      assert.ok(values.every((value) => value !== 0 && Math.abs(value) <= 8));
    }

    assert.ok(question.qualityDiagnostics.outlierDistance >= 1);
    assert.ok(question.qualityDiagnostics.outlierDistance <= 6);
    closeDistractorQuestions += 1;

    for (const [index, evidence] of question.evidenceByOption.entries()) {
      assert.ok(evidence.includes(question.options[index]!));
      assert.match(evidence, /so it (?:follows|does not follow) the common rule\.$/);
    }
    assert.equal(question.explanation.stepByStep.length, optionCount + 1);
    assert.ok(
      question.explanation.stepByStep.slice(0, optionCount).every(
        (step, index) => step === question.evidenceByOption[index],
      ),
    );

    const learnerText = [
      question.stem,
      ...question.options,
      ...question.evidenceByOption,
      ...question.explanation.coreConcept,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedShortcut,
      ...question.explanation.commonTrapWarning,
    ].join("\n");
    assert.ok(!/CLS-|PROT-|CLUSTER_[A-Z_]+|qualityDiagnostics|candidate support/i.test(learnerText));
    assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));

    fingerprints.add(JSON.stringify({
      prototypeId: question.prototypeId,
      stem: question.stem,
      options: question.options,
      answer: question.answer,
    }));
    stems.add(question.stem);
    prototypeCoverage.set(
      prototype.prototypeId,
      (prototypeCoverage.get(prototype.prototypeId) ?? 0) + 1,
    );
    ruleCoverage.add(question.intendedRuleId);
    lengthCoverage.add(question.clusterLength);
    difficultyCoverage.add(question.difficulty);
    optionCountCoverage.add(optionCount);
    answerPositions[question.correctIndex] += 1;
    maximumCommonGroupAttempt = Math.max(
      maximumCommonGroupAttempt,
      question.qualityDiagnostics.commonGroupAttempt,
    );
    maximumOutlierAttempt = Math.max(
      maximumOutlierAttempt,
      question.qualityDiagnostics.outlierAttempt,
    );
  }
}

assert.equal(prototypeCoverage.size, CLS_CP007_PROTOTYPES.length);
assert.ok([...prototypeCoverage.values()].every((count) => count === QUESTIONS_PER_PROTOTYPE));
assert.equal(ruleCoverage.size, 13);
assert.deepEqual(lengthCoverage, new Set([3, 4, 5]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(fingerprints.size >= 145, `Quality diversity too low: ${fingerprints.size}/156`);
for (const [prototypeId, stems] of stemForms) {
  assert.ok(stems.size >= 3, `${prototypeId} has only ${stems.size} quality stem forms`);
}
assert.ok(maximumCommonGroupAttempt < 500);
assert.ok(maximumOutlierAttempt < 300);
assert.ok(ratioQuestions > 0);
assert.ok(topologyQuestions > 0);
assert.equal(closeDistractorQuestions, CLS_CP007_PROTOTYPES.length * QUESTIONS_PER_PROTOTYPE);
assert.throws(() => generateClsCp007QualityQuestion("CLS-CP007-PROT-999" as never, 0));
assert.throws(() => generateClsCp007QualityQuestion("CLS-CP007-PROT-001", -1));

console.log("CLS-CP-007 source-shaped quality audit passed.", {
  generated: CLS_CP007_PROTOTYPES.length * QUESTIONS_PER_PROTOTYPE,
  uniqueVisibleQuestions: fingerprints.size,
  prototypes: prototypeCoverage.size,
  rules: ruleCoverage.size,
  lengths: [...lengthCoverage].sort(),
  difficulties: [...difficultyCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
  answerPositions,
  ratioQuestions,
  topologyQuestions,
  closeDistractorQuestions,
  maximumCommonGroupAttempt,
  maximumOutlierAttempt,
});
