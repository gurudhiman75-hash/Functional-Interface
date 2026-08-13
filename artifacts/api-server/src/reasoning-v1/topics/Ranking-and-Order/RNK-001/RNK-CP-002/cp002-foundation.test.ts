import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP002_PROTOTYPE_IDS,
  generateRnkCp002Question,
  solveCp002Independently,
} from './cp002-foundation';

const seedsPerPrototype = 240;
const audits: unknown[] = [];
const reviewQuestions: unknown[] = [];
let deterministicReplayChecks = 0;
let independentSolverChecks = 0;
let lifecycleChecks = 0;
let invariantChecks = 0;
let optionRealismChecks = 0;

for (const prototypeId of RNK_CP002_PROTOTYPE_IDS) {
  const contexts = new Set<string>();
  const difficulties = new Set<string>();
  const fingerprints = new Set<string>();
  const stems = new Set<string>();
  const correctPositions = [0, 0, 0, 0];
  const sides = new Set<string>();
  const directions = new Set<string>();
  const extremes = new Set<string>();
  let adjacentCases = 0;
  let endpointCases = 0;

  for (let seed = 0; seed < seedsPerPrototype; seed += 1) {
    const question = generateRnkCp002Question(prototypeId, seed);
    const replay = generateRnkCp002Question(prototypeId, seed);
    assert.deepEqual(replay, question);
    deterministicReplayChecks += 1;

    assert.equal(question.answer, solveCp002Independently(question.displayedEvidence));
    independentSolverChecks += 1;

    const state = question.normalizedState;
    assert.ok(state.total >= 2);
    assert.ok(state.firstRankFromStart >= 1 && state.firstRankFromStart <= state.total);
    assert.ok(state.secondRankFromStart >= 1 && state.secondRankFromStart <= state.total);
    assert.notEqual(state.firstRankFromStart, state.secondRankFromStart);
    assert.equal(state.firstRankFromEnd, state.total - state.firstRankFromStart + 1);
    assert.equal(state.secondRankFromEnd, state.total - state.secondRankFromStart + 1);
    assert.equal(state.positionGap, Math.abs(state.firstRankFromStart - state.secondRankFromStart));
    assert.equal(state.betweenCount, state.positionGap - 1);
    invariantChecks += 1;

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options.filter((option) => option.value === question.answer).length, 1);
    assert.equal(question.options[question.correctIndex].value, question.answer);
    assert.equal(question.options.filter((option) => option.misconceptionId === 'CORRECT').length, 1);
    assert.ok(question.explanation.keyRule.length > 30);
    const learnerText = [
      question.stem,
      question.explanation.keyRule,
      ...question.explanation.stepByStepSolution,
      question.explanation.examSpeedShortcut,
      ...question.explanation.optionAnalysis,
      question.explanation.conclusion,
    ].join(' ');
    assert.ok(!/\bThere are one\b/i.test(learnerText));
    assert.ok(!/\b1 (?:candidates|people|positions)\b/i.test(learnerText));
    assert.equal(question.explanation.stepByStepSolution.length, 3);
    assert.equal(question.explanation.optionAnalysis.length, 4);

    assert.equal(question.permanentQlId, null);
    assert.equal(question.lifecycle.reviewStatus, 'UNREVIEWED');
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(question.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 1;

    assert.notEqual(question.firstName, question.secondName);
    contexts.add(question.contextId);
    difficulties.add(question.difficulty);
    fingerprints.add(question.mathematicalFingerprint);
    stems.add(question.stem);
    correctPositions[question.correctIndex] += 1;
    if (state.positionGap === 1) adjacentCases += 1;
    if (
      state.firstRankFromStart === 1 || state.firstRankFromStart === state.total ||
      state.secondRankFromStart === 1 || state.secondRankFromStart === state.total
    ) endpointCases += 1;

    const evidence = question.displayedEvidence;
    if (
      (evidence.kind === 'SAME_END_TWO_RANKS' && evidence.requested === 'POSITION_GAP') ||
      evidence.kind === 'SECOND_RANK_FROM_RELATIVE_OFFSET' ||
      evidence.kind === 'BETWEEN_FROM_MIXED_END_RANKS' ||
      evidence.kind === 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER'
    ) {
      const maximumPlausibleDistance = question.answer === 0 ? 3 : 2;
      assert.ok(
        question.options.every(
          (option) => Math.abs(option.value - question.answer) <= maximumPlausibleDistance,
        ),
        `${prototypeId}:${seed} contains an exam-unrealistic distant distractor`,
      );
      if (question.answer === 0) {
        assert.deepEqual(
          [...question.options.map((option) => option.value)].sort((left, right) => left - right),
          [0, 1, 2, 3],
        );
      }
      optionRealismChecks += 1;
    }

    if ('side' in evidence) sides.add(evidence.side);
    if ('direction' in evidence) directions.add(evidence.direction);
    if ('requestedExtreme' in evidence) extremes.add(evidence.requestedExtreme);

    if (seed < 4) reviewQuestions.push(question);
  }

  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
  if (!prototypeId.includes('EXTREME')) assert.ok(difficulties.has('EASY'));
  assert.ok(difficulties.has('MEDIUM'));
  if (prototypeId.includes('MIXED') || prototypeId.includes('EXTREME')) assert.ok(difficulties.has('HARD'));
  assert.ok(correctPositions.every((count) => count > 0));
  assert.ok(stems.size >= 180);
  assert.ok(fingerprints.size >= 90);
  assert.ok(adjacentCases > 0);
  assert.ok(endpointCases > 0 || prototypeId.includes('EXTREME'));

  if (
    prototypeId === 'RNK-CP002-PROT-PEOPLE-BETWEEN-SAME-END-RANKS' ||
    prototypeId === 'RNK-CP002-PROT-POSITION-GAP-SAME-END-RANKS' ||
    prototypeId === 'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET'
  ) assert.deepEqual([...sides].sort(), ['END', 'START']);

  if (
    prototypeId === 'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET' ||
    prototypeId === 'RNK-CP002-PROT-TOTAL-FROM-MIXED-END-RANKS-KNOWN-ORDER'
  ) assert.deepEqual([...directions].sort(), ['TOWARD_END', 'TOWARD_START']);

  if (prototypeId === 'RNK-CP002-PROT-EXTREME-TOTAL-FROM-MIXED-END-RANKS-UNKNOWN-ORDER') {
    assert.deepEqual([...extremes].sort(), ['MAXIMUM', 'MINIMUM']);
  }

  audits.push({
    prototypeId,
    generated: seedsPerPrototype,
    contexts: [...contexts].sort(),
    difficulties: [...difficulties].sort(),
    correctPositions,
    uniqueStems: stems.size,
    uniqueFingerprints: fingerprints.size,
    adjacentCases,
    endpointCases,
    sides: [...sides].sort(),
    directions: [...directions].sort(),
    extremes: [...extremes].sort(),
  });
}

assert.equal(optionRealismChecks, 960);

const summary = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-002',
  provisionalPrototypeCount: RNK_CP002_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  seedsPerPrototype,
  totalQuestions: RNK_CP002_PROTOTYPE_IDS.length * seedsPerPrototype,
  deterministicReplayChecks,
  independentSolverChecks,
  lifecycleChecks,
  invariantChecks,
  optionRealismChecks,
  audits,
  conclusion: 'PASS_EXECUTABLE_TWO_PERSON_DISCOVERY_FOUNDATION',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, 'cp002-foundation-audit.json'), `${JSON.stringify(summary, null, 2)}\n`);
  writeFileSync(join(outputDirectory, 'cp002-review-questions.json'), `${JSON.stringify(reviewQuestions, null, 2)}\n`);
}

console.log(JSON.stringify(summary, null, 2));
