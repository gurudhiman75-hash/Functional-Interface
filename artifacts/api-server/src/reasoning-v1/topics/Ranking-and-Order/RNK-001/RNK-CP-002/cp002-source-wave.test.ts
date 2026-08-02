import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp002SourceQuestion,
  RNK_CP002_SOURCE_CONSTANTS,
  RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS,
  type RnkCp002SourceEvidence,
  type RnkCp002SourceQuestion,
} from './cp002-source-wave';
import {
  generateReviewedRnkCp002SourceQuestion,
  reviewProjectionWithoutLearnerText,
} from './cp002-source-wave-reviewed';

const SEEDS_PER_PROTOTYPE = 240;

function solveIndependently(question: RnkCp002SourceQuestion): string {
  const evidence: RnkCp002SourceEvidence = question.displayedEvidence;
  switch (evidence.kind) {
    case 'POSITION_GAP_MIXED_END': {
      const secondStart = evidence.total - evidence.secondRankFromEnd + 1;
      return String(Math.abs(evidence.firstRankFromStart - secondStart));
    }
    case 'OFFSET_FROM_SAME_END':
      return String(Math.abs(evidence.firstRank - evidence.secondRank));
    case 'TARGET_RANK_FROM_BETWEEN': {
      const offset = evidence.betweenCount + 1;
      const rankNumbersIncrease =
        (evidence.side === 'START' && evidence.direction === 'TOWARD_END') ||
        (evidence.side === 'END' && evidence.direction === 'TOWARD_START');
      return String(evidence.referenceRank + (rankNumbersIncrease ? offset : -offset));
    }
    case 'COMPARE_SAME_END': {
      let firstWins: boolean;
      if (evidence.requested === 'NEARER_SUPPLIED_END') {
        firstWins = evidence.firstRank < evidence.secondRank;
      } else {
        const firstStart = evidence.side === 'START' ? evidence.firstRank : -evidence.firstRank;
        const secondStart = evidence.side === 'START' ? evidence.secondRank : -evidence.secondRank;
        firstWins = evidence.requested === 'TOWARD_START'
          ? firstStart < secondStart
          : firstStart > secondStart;
      }
      return firstWins ? question.firstName : question.secondName;
    }
    case 'COMPARE_MIXED_END': {
      const secondStart = evidence.total - evidence.secondRankFromEnd + 1;
      const firstWins = evidence.requested === 'TOWARD_START'
        ? evidence.firstRankFromStart < secondStart
        : evidence.firstRankFromStart > secondStart;
      return firstWins ? question.firstName : question.secondName;
    }
    case 'EXACT_TOTAL_OR_INDETERMINATE':
      return evidence.lowTotalValid
        ? RNK_CP002_SOURCE_CONSTANTS.CANNOT_BE_DETERMINED
        : String(evidence.highTotal);
    case 'PROPOSED_TOTAL_ORDER_STATUS':
      if (evidence.proposedTotal === evidence.highTotal) {
        return RNK_CP002_SOURCE_CONSTANTS.FIRST_BEFORE_SECOND;
      }
      if (evidence.lowTotalValid && evidence.proposedTotal === evidence.lowTotal) {
        return RNK_CP002_SOURCE_CONSTANTS.SECOND_BEFORE_FIRST;
      }
      return RNK_CP002_SOURCE_CONSTANTS.PROPOSED_TOTAL_IMPOSSIBLE;
  }
}

const audits: unknown[] = [];
const reviewQuestions: RnkCp002SourceQuestion[] = [];
let deterministicChecks = 0;
let independentSolverChecks = 0;
let reviewPreservationChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let lowBranchValidCases = 0;
let lowBranchInvalidCases = 0;
let cannotDetermineCases = 0;
let uniqueTotalCases = 0;
const orderStatuses = new Set<string>();

for (const prototypeId of RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS) {
  const contexts = new Set<string>();
  const difficulties = new Set<string>();
  const answerSemantics = new Set<string>();
  const correctPositions = [0, 0, 0, 0];
  const fingerprints = new Set<string>();
  const stems = new Set<string>();
  const sides = new Set<string>();
  const directions = new Set<string>();
  const requestedRelations = new Set<string>();

  for (let seed = 0; seed < SEEDS_PER_PROTOTYPE; seed += 1) {
    const raw = generateRnkCp002SourceQuestion(prototypeId, seed);
    const question = generateReviewedRnkCp002SourceQuestion(prototypeId, seed);
    assert.deepEqual(generateReviewedRnkCp002SourceQuestion(prototypeId, seed), question);
    deterministicChecks += 1;

    assert.deepEqual(
      reviewProjectionWithoutLearnerText(question),
      reviewProjectionWithoutLearnerText(raw),
      `${prototypeId}:${seed} reviewed text changed mathematical structure`,
    );
    reviewPreservationChecks += 1;

    assert.equal(question.answer, solveIndependently(question), `${prototypeId}:${seed}`);
    independentSolverChecks += 1;

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((item) => item.value)).size, 4);
    assert.equal(question.options[question.correctIndex].value, question.answer);
    assert.equal(question.options.filter((item) => item.value === question.answer).length, 1);
    assert.equal(question.options.filter((item) => item.misconceptionId === 'CORRECT').length, 1);
    assert.equal(question.explanation.stepByStepSolution.length, 3);
    assert.equal(question.explanation.optionAnalysis.length, 4);
    optionChecks += 1;

    const learnerText = [
      question.stem,
      question.explanation.keyRule,
      ...question.explanation.stepByStepSolution,
      question.explanation.examSpeedShortcut,
      ...question.explanation.optionAnalysis,
      question.explanation.conclusion,
    ].join(' ');
    assert.ok(!/\bThere are one\b/i.test(learnerText), `${prototypeId}:${seed}`);
    assert.ok(!/\b1 (?:people|candidates|positions)\b/i.test(learnerText), `${prototypeId}:${seed}`);
    assert.ok(!/\b0 (?:people|candidates)\b/i.test(learnerText), `${prototypeId}:${seed}`);
    assert.ok(!/undefined|null|NaN/.test(learnerText), `${prototypeId}:${seed}`);

    assert.equal(question.permanentQlId, null);
    assert.equal(question.lifecycle.reviewStatus, 'UNREVIEWED');
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(question.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 1;

    contexts.add(question.contextId);
    difficulties.add(question.difficulty);
    answerSemantics.add(question.answerSemantic);
    correctPositions[question.correctIndex] += 1;
    fingerprints.add(question.mathematicalFingerprint);
    stems.add(question.stem);

    const evidence = question.displayedEvidence;
    if ('side' in evidence) sides.add(evidence.side);
    if ('direction' in evidence) directions.add(evidence.direction);
    if ('requested' in evidence) requestedRelations.add(evidence.requested);

    if (evidence.kind === 'EXACT_TOTAL_OR_INDETERMINATE') {
      assert.equal(evidence.highTotal, evidence.firstRankFromStart + evidence.secondRankFromEnd + evidence.betweenCount);
      assert.equal(evidence.lowTotal, evidence.firstRankFromStart + evidence.secondRankFromEnd - evidence.betweenCount - 2);
      assert.equal(evidence.lowTotalValid, evidence.firstRankFromStart >= evidence.betweenCount + 2 && evidence.secondRankFromEnd >= evidence.betweenCount + 2);
      if (evidence.lowTotalValid) {
        lowBranchValidCases += 1;
        cannotDetermineCases += 1;
        assert.equal(question.answer, RNK_CP002_SOURCE_CONSTANTS.CANNOT_BE_DETERMINED);
      } else {
        lowBranchInvalidCases += 1;
        uniqueTotalCases += 1;
        assert.equal(question.answer, String(evidence.highTotal));
      }
    }

    if (evidence.kind === 'PROPOSED_TOTAL_ORDER_STATUS') {
      orderStatuses.add(question.answer);
      if (question.answer === RNK_CP002_SOURCE_CONSTANTS.SECOND_BEFORE_FIRST) {
        assert.equal(evidence.lowTotalValid, true);
        assert.equal(evidence.proposedTotal, evidence.lowTotal);
      }
    }

    if (seed < 6) reviewQuestions.push(question);
  }

  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
  assert.ok(correctPositions.every((count) => count > 0));
  assert.ok(stems.size >= 180);
  assert.ok(fingerprints.size >= 100);
  assert.ok(answerSemantics.size === 1);

  if (
    prototypeId === 'RNK-CP002-PROT-OFFSET-FROM-SAME-END-RANKS' ||
    prototypeId === 'RNK-CP002-PROT-TARGET-RANK-FROM-BETWEEN-AND-ORDER' ||
    prototypeId === 'RNK-CP002-PROT-COMPARE-SAME-END-RANKS'
  ) {
    assert.deepEqual([...sides].sort(), ['END', 'START']);
  }

  if (prototypeId === 'RNK-CP002-PROT-TARGET-RANK-FROM-BETWEEN-AND-ORDER') {
    assert.deepEqual([...directions].sort(), ['TOWARD_END', 'TOWARD_START']);
  }

  if (prototypeId === 'RNK-CP002-PROT-COMPARE-SAME-END-RANKS') {
    assert.deepEqual([...requestedRelations].sort(), ['NEARER_SUPPLIED_END', 'TOWARD_END', 'TOWARD_START']);
  }

  if (prototypeId === 'RNK-CP002-PROT-COMPARE-MIXED-END-RANKS-WITH-TOTAL') {
    assert.deepEqual([...requestedRelations].sort(), ['TOWARD_END', 'TOWARD_START']);
  }

  audits.push({
    prototypeId,
    generated: SEEDS_PER_PROTOTYPE,
    contexts: [...contexts].sort(),
    difficulties: [...difficulties].sort(),
    answerSemantics: [...answerSemantics],
    correctPositions,
    uniqueStems: stems.size,
    uniqueFingerprints: fingerprints.size,
    sides: [...sides].sort(),
    directions: [...directions].sort(),
    requestedRelations: [...requestedRelations].sort(),
  });
}

assert.ok(lowBranchValidCases > 0);
assert.ok(lowBranchInvalidCases > 0);
assert.ok(cannotDetermineCases > 0);
assert.ok(uniqueTotalCases > 0);
assert.deepEqual([...orderStatuses].sort(), [
  RNK_CP002_SOURCE_CONSTANTS.FIRST_BEFORE_SECOND,
  RNK_CP002_SOURCE_CONSTANTS.PROPOSED_TOTAL_IMPOSSIBLE,
  RNK_CP002_SOURCE_CONSTANTS.SECOND_BEFORE_FIRST,
].sort());

const summary = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-002',
  wave: 'SOURCE_AND_INVERSE_SATURATION',
  prototypeCount: RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS.length,
  seedsPerPrototype: SEEDS_PER_PROTOTYPE,
  totalQuestions: RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS.length * SEEDS_PER_PROTOTYPE,
  deterministicChecks,
  independentSolverChecks,
  reviewPreservationChecks,
  optionChecks,
  lifecycleChecks,
  lowBranchValidCases,
  lowBranchInvalidCases,
  cannotDetermineCases,
  uniqueTotalCases,
  orderStatuses: [...orderStatuses].sort(),
  audits,
  permanentQlCount: 0,
  conclusion: 'PASS_CP002_SOURCE_AND_INVERSE_SATURATION_WAVE',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, 'cp002-source-wave-audit.json'), `${JSON.stringify(summary, null, 2)}\n`);
  writeFileSync(join(outputDirectory, 'cp002-source-wave-review.json'), `${JSON.stringify(reviewQuestions, null, 2)}\n`);
}

console.log(JSON.stringify(summary, null, 2));
