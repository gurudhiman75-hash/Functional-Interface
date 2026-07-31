import assert from "node:assert/strict";
import { independentlyVerifyClsCp007Question } from "./audit";
import { independentlyVerifyClsCp007PairQuestion } from "./cluster-pair-audit";
import {
  CLS_CP007_PROTOTYPES,
  CLS_CP007_RULE_IDS,
  clsCp007SignedGaps,
} from "./cluster-domain";
import {
  CLS_CP007_PERMANENT_QLS,
  CLS_CP007_SOLVE_CONTRACTS,
  generateClsCp007PermanentClusterPairQuestion,
  generateClsCp007PermanentClusterQuestion,
} from "./cp007-english-contracts";

const SINGLE_SEEDS_PER_PROTOTYPE = 40;
const PAIR_SEEDS = 240;
const singleFingerprints = new Set<string>();
const pairFingerprints = new Set<string>();
const explanationFingerprints = new Set<string>();
const qlCoverage = new Map<string, number>();
const prototypeCoverage = new Set<string>();
const singleRuleCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const singleLengthCoverage = new Set<number>();
const difficultyCoverageByQl = new Map<string, Set<string>>();
const answerPositionsByQl = new Map<string, number[]>([
  ["CLS-QL-012", [0, 0, 0, 0, 0]],
  ["CLS-QL-013", [0, 0, 0, 0, 0]],
]);
let sameAnswerSingleSupports = 0;
let sameAnswerPairSupports = 0;

function recordDifficulty(qlId: string, difficulty: string): void {
  const values = difficultyCoverageByQl.get(qlId) ?? new Set<string>();
  values.add(difficulty);
  difficultyCoverageByQl.set(qlId, values);
}

function assertPermanentLifecycle(question: {
  permanentQlId: string;
  reviewOnly: boolean;
  questionStudioVisible: boolean;
  metadata: {
    runtimeVersion: string;
    locale: string;
    sourceSaturationStatus: string;
  };
  lifecycle: {
    permanentQlId: string | null;
    reviewStatus: string;
    questionBankStatus: string;
    testEligibility: string;
    publiclyPublishable: boolean;
    questionStudioDiscoverable: boolean;
  };
}): void {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.metadata.runtimeVersion, "cls-cp007-permanent-english-v1");
  assert.equal(question.metadata.locale, "en-IN");
  assert.equal(
    question.metadata.sourceSaturationStatus,
    "SOURCE_GAP_CLOSED__TWO_CONTRACTS_FROZEN",
  );
  assert.equal(question.lifecycle.permanentQlId, question.permanentQlId);
  assert.equal(question.lifecycle.reviewStatus, "FROZEN_ENGLISH_RUNTIME_PROOF");
  assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
}

function assertLearnerTextSafe(question: {
  stem: string;
  options: readonly string[];
  answer: string;
  evidenceByOption: readonly string[];
  explanation: {
    coreConcept: readonly string[];
    stepByStep: readonly string[];
    examSpeedShortcut: readonly string[];
    commonTrapWarning: readonly string[];
  };
}): void {
  const learnerText = [
    question.stem,
    ...question.options,
    question.answer,
    ...question.evidenceByOption,
    ...question.explanation.coreConcept,
    ...question.explanation.stepByStep,
    ...question.explanation.examSpeedShortcut,
    ...question.explanation.commonTrapWarning,
  ].join("\n");
  assert.ok(
    !/CLS-|PROT-|CLUSTER_[A-Z_]+|CLUSTER_PAIR_|qualityDiagnostics|candidate support|dataset version/i.test(
      learnerText,
    ),
  );
  assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));
}

for (const prototype of CLS_CP007_PROTOTYPES) {
  for (let seed = 0; seed < SINGLE_SEEDS_PER_PROTOTYPE; seed += 1) {
    for (const optionCount of [4, 5] as const) {
      const question = generateClsCp007PermanentClusterQuestion(
        prototype.prototypeId,
        seed,
        optionCount,
      );
      const replay = generateClsCp007PermanentClusterQuestion(
        prototype.prototypeId,
        seed,
        optionCount,
      );
      assert.deepEqual(question, replay);
      assert.equal(question.permanentQlId, "CLS-QL-012");
      assert.equal(question.solveContract, CLS_CP007_SOLVE_CONTRACTS["CLS-QL-012"]);
      assert.equal(question.task, "FIND_ODD_LETTER_CLUSTER");
      assert.equal(question.options.length, optionCount);
      assert.equal(question.answer, question.options[question.correctIndex]);
      assert.equal(question.ambiguityAudit.result, "UNIQUE");
      assert.equal(question.ambiguityAudit.answerIndex, question.correctIndex);
      assert.equal(question.ambiguityAudit.intendedRuleSupported, true);
      const independent = independentlyVerifyClsCp007Question(question);
      assert.equal(independent.result, "UNIQUE");
      assert.equal(independent.answerIndex, question.correctIndex);
      assert.equal(independent.intendedRuleSupported, true);
      assertPermanentLifecycle(question);
      assertLearnerTextSafe(question);

      if (question.intendedRuleId !== "CLUSTER_REPEAT_PATTERN") {
        assert.ok(
          question.items.every((item) => new Set(item.letters).size === item.letters.length),
        );
      }
      if (question.intendedRuleId === "CLUSTER_GAP_EQUALITY_PATTERN") {
        assert.ok(
          question.items.every((item) =>
            clsCp007SignedGaps(item).every((gap) => Math.abs(gap) <= 12),
          ),
        );
      }
      assert.equal(question.evidenceByOption.length, optionCount);
      assert.ok(
        question.evidenceByOption.every((value) =>
          /so it (?:follows|does not follow) the common rule\.$/.test(value)
        ),
      );
      assert.equal(question.explanation.stepByStep.length, optionCount + 1);
      if (question.ambiguityAudit.candidateSupports.length > 1) {
        sameAnswerSingleSupports += 1;
      }

      singleFingerprints.add(JSON.stringify({
        prototypeId: question.prototypeId,
        options: question.options,
        answer: question.answer,
      }));
      explanationFingerprints.add(JSON.stringify(question.explanation));
      qlCoverage.set("CLS-QL-012", (qlCoverage.get("CLS-QL-012") ?? 0) + 1);
      prototypeCoverage.add(question.prototypeId);
      singleRuleCoverage.add(question.intendedRuleId);
      optionCountCoverage.add(optionCount);
      singleLengthCoverage.add(question.clusterLength);
      recordDifficulty("CLS-QL-012", question.difficulty);
      answerPositionsByQl.get("CLS-QL-012")![question.correctIndex] += 1;
    }
  }
}

for (let seed = 0; seed < PAIR_SEEDS; seed += 1) {
  for (const optionCount of [4, 5] as const) {
    const question = generateClsCp007PermanentClusterPairQuestion(seed, optionCount);
    const replay = generateClsCp007PermanentClusterPairQuestion(seed, optionCount);
    assert.deepEqual(question, replay);
    assert.equal(question.permanentQlId, "CLS-QL-013");
    assert.equal(question.solveContract, CLS_CP007_SOLVE_CONTRACTS["CLS-QL-013"]);
    assert.equal(question.task, "FIND_ODD_LETTER_CLUSTER_PAIR");
    assert.equal(question.options.length, optionCount);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.ambiguityAudit.result, "UNIQUE");
    assert.equal(question.ambiguityAudit.answerIndex, question.correctIndex);
    assert.equal(question.ambiguityAudit.intendedRuleSupported, true);
    const independent = independentlyVerifyClsCp007PairQuestion(question);
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.answerIndex, question.correctIndex);
    assert.equal(independent.intendedRuleSupported, true);
    assertPermanentLifecycle(question);
    assertLearnerTextSafe(question);

    const totals = [...question.qualityDiagnostics.correspondingTotals].sort(
      (left, right) => left - right,
    );
    assert.deepEqual(totals, [26, 27, 28]);
    assert.ok(
      question.ambiguityAudit.candidateSupports.some(
        (support) => support.ruleId === "CLUSTER_PAIR_POSITION_SUM_VECTOR",
      ),
    );
    assert.equal(question.evidenceByOption.length, optionCount);
    assert.ok(
      question.evidenceByOption.every((value) =>
        /so it (?:follows|does not follow) the common opposite-letter rule\.$/.test(value)
      ),
    );
    assert.equal(question.explanation.stepByStep.length, optionCount + 1);
    if (question.ambiguityAudit.candidateSupports.length > 1) {
      sameAnswerPairSupports += 1;
    }

    pairFingerprints.add(JSON.stringify({
      options: question.options,
      answer: question.answer,
    }));
    explanationFingerprints.add(JSON.stringify(question.explanation));
    qlCoverage.set("CLS-QL-013", (qlCoverage.get("CLS-QL-013") ?? 0) + 1);
    optionCountCoverage.add(optionCount);
    recordDifficulty("CLS-QL-013", question.difficulty);
    answerPositionsByQl.get("CLS-QL-013")![question.correctIndex] += 1;
  }
}

const singleGenerated = CLS_CP007_PROTOTYPES.length * SINGLE_SEEDS_PER_PROTOTYPE * 2;
const pairGenerated = PAIR_SEEDS * 2;
assert.deepEqual(CLS_CP007_PERMANENT_QLS, ["CLS-QL-012", "CLS-QL-013"]);
assert.equal(qlCoverage.get("CLS-QL-012"), singleGenerated);
assert.equal(qlCoverage.get("CLS-QL-013"), pairGenerated);
assert.equal(prototypeCoverage.size, CLS_CP007_PROTOTYPES.length);
assert.equal(singleRuleCoverage.size, CLS_CP007_RULE_IDS.length);
assert.deepEqual(singleLengthCoverage, new Set([3, 4, 5]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
assert.deepEqual(
  difficultyCoverageByQl.get("CLS-QL-012"),
  new Set(["EASY", "MEDIUM", "HARD"]),
);
assert.deepEqual(
  difficultyCoverageByQl.get("CLS-QL-013"),
  new Set(["MEDIUM", "HARD"]),
);
assert.ok(answerPositionsByQl.get("CLS-QL-012")!.every((count) => count > 0));
assert.ok(answerPositionsByQl.get("CLS-QL-013")!.every((count) => count > 0));
assert.ok(
  singleFingerprints.size >= singleGenerated - 5,
  `Permanent CLS-QL-012 diversity is too low: ${singleFingerprints.size}/${singleGenerated}`,
);
assert.equal(pairFingerprints.size, pairGenerated);
assert.ok(explanationFingerprints.size >= 1_300);
assert.ok(sameAnswerSingleSupports > 0);
assert.equal(sameAnswerPairSupports, pairGenerated);

console.log("CLS-CP-007 permanent English runtime audit passed.", {
  generated: singleGenerated + pairGenerated,
  qls: [...qlCoverage.entries()],
  uniqueSingleQuestions: singleFingerprints.size,
  uniquePairQuestions: pairFingerprints.size,
  uniqueExplanationFingerprints: explanationFingerprints.size,
  singlePrototypes: prototypeCoverage.size,
  singleRules: singleRuleCoverage.size,
  singleLengths: [...singleLengthCoverage].sort(),
  optionCounts: [...optionCountCoverage].sort(),
  difficulties: Object.fromEntries(
    [...difficultyCoverageByQl.entries()].map(([qlId, values]) => [qlId, [...values].sort()]),
  ),
  answerPositions: Object.fromEntries(answerPositionsByQl),
  sameAnswerSingleSupports,
  sameAnswerPairSupports,
});
