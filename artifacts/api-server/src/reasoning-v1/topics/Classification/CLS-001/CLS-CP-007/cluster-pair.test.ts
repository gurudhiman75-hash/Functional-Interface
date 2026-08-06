import assert from "node:assert/strict";
import { independentlyVerifyClsCp007PairQuestion } from "./cluster-pair-audit";
import {
  CLS_CP007_CLUSTER_PAIR_NEAR_MISSES,
  CLS_CP007_COMMON_CLUSTER_PAIRS,
  clsCp007FormatPairItem,
  clsCp007LetterPosition,
  clsCp007PairNuisanceKey,
  clsCp007PairRuleValue,
} from "./cluster-pair-domain";
import { generateClsCp007PairQuestion } from "./cluster-pair-runtime";

const SEEDS = 120;
const fingerprints = new Set<string>();
const optionCountCoverage = new Set<number>();
const difficultyCoverage = new Set<string>();
const answerPositions = [0, 0, 0, 0, 0];
const stemForms = new Set<string>();
let sameAnswerMultiRuleQuestions = 0;
let maximumCommonPoolAttempt = 0;
let maximumOutlierAttempt = 0;

assert.ok(
  CLS_CP007_COMMON_CLUSTER_PAIRS.length >= 10_000,
  `Cluster-pair common domain is too small: ${CLS_CP007_COMMON_CLUSTER_PAIRS.length}`,
);
assert.ok(
  CLS_CP007_CLUSTER_PAIR_NEAR_MISSES.length >= 1_000,
  `Cluster-pair near-miss domain is too small: ${CLS_CP007_CLUSTER_PAIR_NEAR_MISSES.length}`,
);

for (let seed = 0; seed < SEEDS; seed += 1) {
  for (const optionCount of [4, 5] as const) {
    const question = generateClsCp007PairQuestion(seed, optionCount);
    const replay = generateClsCp007PairQuestion(seed, optionCount);
    assert.deepEqual(question, replay, `Cluster-pair replay changed for ${seed}/${optionCount}`);

    assert.equal(question.checkpointId, "CLS-CP-007");
    assert.equal(question.prototypeId, "CLS-CP007-PAIR-PROT-001");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.task, "FIND_ODD_LETTER_CLUSTER_PAIR");
    assert.equal(question.clusterLength, 3);
    assert.equal(question.options.length, optionCount);
    assert.equal(question.items.length, optionCount);
    assert.equal(new Set(question.options).size, optionCount);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.intendedRuleId, "CLUSTER_PAIR_OPPOSITE_TRANSFORM_STATUS");
    assert.equal(question.intendedRuleValue, "MATCH");
    assert.equal(question.ambiguityAudit.result, "UNIQUE");
    assert.equal(question.ambiguityAudit.answerIndex, question.correctIndex);
    assert.equal(question.ambiguityAudit.intendedRuleSupported, true);
    assert.ok(
      question.ambiguityAudit.candidateSupports.some(
        (support) =>
          support.ruleId === "CLUSTER_PAIR_POSITION_SUM_VECTOR" &&
          support.answerIndex === question.correctIndex,
      ),
      "Exact corresponding-sum vector did not support the same answer.",
    );
    if (question.ambiguityAudit.candidateSupports.length > 1) {
      sameAnswerMultiRuleQuestions += 1;
    }

    const independent = independentlyVerifyClsCp007PairQuestion(question);
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.answerIndex, question.correctIndex);
    assert.equal(independent.intendedRuleSupported, true);

    const nuisanceKeys = question.items.map(clsCp007PairNuisanceKey);
    assert.equal(new Set(nuisanceKeys).size, 1);
    assert.equal(nuisanceKeys[0], question.qualityDiagnostics.nuisanceKey);
    assert.equal(new Set(question.items.map((item) => item.left.join(""))).size, optionCount);

    for (const [index, item] of question.items.entries()) {
      assert.equal(item.kind, "LETTER_CLUSTER_PAIR");
      assert.equal(item.left.length, 3);
      assert.equal(item.right.length, 3);
      assert.equal(new Set(item.left).size, 3);
      assert.equal(new Set(item.right).size, 3);
      assert.match(question.options[index]!, /^[A-Z]{3}–[A-Z]{3}$/);
      assert.equal(question.options[index], clsCp007FormatPairItem(item));
      assert.equal(
        item.left.map(clsCp007LetterPosition).reduce((total, value) => total + value, 0) +
          item.right.map(clsCp007LetterPosition).reduce((total, value) => total + value, 0),
        81,
        "A cluster-pair option exposes the answer through the whole six-letter total.",
      );
      assert.ok(question.evidenceByOption[index]!.includes(question.options[index]!));
      assert.match(
        question.evidenceByOption[index]!,
        /so it (?:follows|does not follow) the common opposite-letter rule\.$/,
      );
    }

    const intendedSupport = question.ambiguityAudit.candidateSupports.find(
      (support) => support.ruleId === "CLUSTER_PAIR_OPPOSITE_TRANSFORM_STATUS",
    );
    assert.ok(intendedSupport);
    for (const commonIndex of intendedSupport.matchingOptionIndexes) {
      assert.equal(
        clsCp007PairRuleValue(
          question.items[commonIndex]!,
          "CLUSTER_PAIR_POSITION_SUM_VECTOR",
        ),
        "27,27,27",
      );
    }
    const outlier = question.items[intendedSupport.answerIndex]!;
    const outlierTotals = clsCp007PairRuleValue(
      outlier,
      "CLUSTER_PAIR_POSITION_SUM_VECTOR",
    ).split(",").map(Number);
    assert.deepEqual([...outlierTotals].sort((left, right) => left - right), [26, 27, 28]);
    assert.equal(outlierTotals.reduce((total, value) => total + value, 0), 81);
    assert.deepEqual(
      [...question.qualityDiagnostics.correspondingTotals].sort((left, right) => left - right),
      [26, 27, 28],
    );
    assert.equal(new Set(question.qualityDiagnostics.changedIndexes).size, 2);

    assert.equal(question.evidenceByOption.length, optionCount);
    assert.equal(question.explanation.coreConcept.length, 1);
    assert.equal(question.explanation.stepByStep.length, optionCount + 1);
    assert.equal(question.explanation.examSpeedShortcut.length, 1);
    assert.equal(question.explanation.commonTrapWarning.length, 1);
    assert.match(question.explanation.examSpeedShortcut[0]!, /^Check/);
    assert.match(question.explanation.commonTrapWarning[0]!, /overall total/);

    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.metadata.datasetVersion, "CLS-CP007-CLUSTER-PAIR-DOMAIN-v1");
    assert.equal(question.metadata.runtimeVersion, "cls-cp007-cluster-pair-discovery-v1");
    assert.equal(question.metadata.locale, "en-IN");
    assert.equal(question.metadata.optionCount, optionCount);
    assert.equal(
      question.metadata.sourceSaturationStatus,
      "CLUSTER_PAIR_WAVE_1_EXECUTABLE__GAP_AUDIT_OPEN",
    );
    assert.equal(question.lifecycle.permanentQlId, null);
    assert.equal(question.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY");
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);

    const learnerText = [
      question.stem,
      ...question.options,
      ...question.evidenceByOption,
      ...question.explanation.coreConcept,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedShortcut,
      ...question.explanation.commonTrapWarning,
    ].join("\n");
    assert.ok(
      !/CLS-|PROT-|CLUSTER_PAIR_|candidate support|dataset version|qualityDiagnostics/i.test(
        learnerText,
      ),
    );
    assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));
    assert.ok(!/is related to|complete the analogy|what comes next|certain code/i.test(question.stem));

    fingerprints.add(JSON.stringify({
      stem: question.stem,
      options: question.options,
      answer: question.answer,
    }));
    optionCountCoverage.add(optionCount);
    difficultyCoverage.add(question.difficulty);
    answerPositions[question.correctIndex] += 1;
    stemForms.add(question.stem);
    maximumCommonPoolAttempt = Math.max(
      maximumCommonPoolAttempt,
      question.qualityDiagnostics.commonPoolAttempt,
    );
    maximumOutlierAttempt = Math.max(
      maximumOutlierAttempt,
      question.qualityDiagnostics.outlierAttempt,
    );
  }
}

assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.deepEqual(difficultyCoverage, new Set(["MEDIUM", "HARD"]));
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(fingerprints.size >= 220, `Cluster-pair diversity is too low: ${fingerprints.size}/240`);
assert.ok(stemForms.size >= 5);
assert.equal(sameAnswerMultiRuleQuestions, SEEDS * 2);
assert.ok(maximumCommonPoolAttempt < 20);
assert.ok(maximumOutlierAttempt < 1_000);
assert.throws(() => generateClsCp007PairQuestion(-1));
assert.throws(() => generateClsCp007PairQuestion(0, 6 as never));

console.log("CLS-CP-007 cluster-pair discovery audit passed.", {
  commonDomain: CLS_CP007_COMMON_CLUSTER_PAIRS.length,
  nearMissDomain: CLS_CP007_CLUSTER_PAIR_NEAR_MISSES.length,
  generated: SEEDS * 2,
  uniqueVisibleQuestions: fingerprints.size,
  tasks: ["FIND_ODD_LETTER_CLUSTER_PAIR"],
  ruleUniverse: 8,
  optionCounts: [...optionCountCoverage].sort(),
  difficulties: [...difficultyCoverage].sort(),
  answerPositions,
  sameAnswerMultiRuleQuestions,
  maximumCommonPoolAttempt,
  maximumOutlierAttempt,
});
