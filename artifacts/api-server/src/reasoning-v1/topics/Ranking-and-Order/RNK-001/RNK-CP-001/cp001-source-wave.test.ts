import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp001SourceWaveQuestion,
  RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS,
  solveRnkCp001SourceWaveCanonical,
  solveRnkCp001SourceWaveIndependently,
  type RnkCp001SourceWaveContextId,
  type RnkCp001SourceWaveDifficulty,
  type RnkCp001SourceWavePrototypeId,
} from './cp001-source-wave';

const SEEDS_PER_PROTOTYPE = 240;

interface PrototypeAudit {
  readonly prototypeId: RnkCp001SourceWavePrototypeId;
  readonly generated: number;
  readonly contexts: readonly RnkCp001SourceWaveContextId[];
  readonly difficulties: readonly RnkCp001SourceWaveDifficulty[];
  readonly correctPositions: readonly number[];
  readonly uniqueStems: number;
  readonly uniqueFingerprints: number;
  readonly boundaryStart: number;
  readonly boundaryEnd: number;
  readonly exactMiddleCases: number;
}

function fingerprintMinimum(prototypeId: RnkCp001SourceWavePrototypeId): number {
  if (
    prototypeId === 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL' ||
    prototypeId === 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK'
  ) {
    return 30;
  }
  if (
    prototypeId === 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK' ||
    prototypeId === 'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER'
  ) {
    return 45;
  }
  return 110;
}

function requiresBoundaryProof(prototypeId: RnkCp001SourceWavePrototypeId): boolean {
  return (
    prototypeId !== 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL' &&
    prototypeId !== 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK'
  );
}

function requiresMiddleProof(prototypeId: RnkCp001SourceWavePrototypeId): boolean {
  return (
    prototypeId === 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL' ||
    prototypeId === 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK'
  );
}

function auditPrototype(prototypeId: RnkCp001SourceWavePrototypeId): PrototypeAudit {
  const contexts = new Set<RnkCp001SourceWaveContextId>();
  const difficulties = new Set<RnkCp001SourceWaveDifficulty>();
  const correctPositions = [0, 0, 0, 0];
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  let boundaryStart = 0;
  let boundaryEnd = 0;
  let exactMiddleCases = 0;

  for (let seed = 0; seed < SEEDS_PER_PROTOTYPE; seed += 1) {
    const question = generateRnkCp001SourceWaveQuestion(prototypeId, seed);
    const replay = generateRnkCp001SourceWaveQuestion(prototypeId, seed);

    assert.deepEqual(replay, question, `${prototypeId} seed ${seed} must replay byte-stably`);
    assert.equal(question.packageId, 'RNK-001');
    assert.equal(question.checkpointId, 'RNK-CP-001');
    assert.equal(question.waveId, 'SOURCE_AND_INVERSE_GAP_WAVE');
    assert.equal(question.prototypeId, prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.locale, 'en-IN');

    const independentAnswer = solveRnkCp001SourceWaveIndependently(question.displayedEvidence);
    const canonicalAnswer = solveRnkCp001SourceWaveCanonical(prototypeId, question.normalizedState);
    assert.equal(question.answer, independentAnswer);
    assert.equal(question.answer, canonicalAnswer);

    const state = question.normalizedState;
    assert.ok(Number.isInteger(state.total) && state.total >= 8);
    assert.ok(state.rankFromStart >= 1 && state.rankFromStart <= state.total);
    assert.ok(state.rankFromEnd >= 1 && state.rankFromEnd <= state.total);
    assert.equal(state.rankFromStart + state.rankFromEnd, state.total + 1);
    assert.equal(state.beforeCount, state.rankFromStart - 1);
    assert.equal(state.afterCount, state.rankFromEnd - 1);
    assert.equal(state.beforeCount + state.afterCount + 1, state.total);

    if (state.rankFromStart === 1) boundaryStart += 1;
    if (state.rankFromStart === state.total) boundaryEnd += 1;
    if (state.isExactMiddle) exactMiddleCases += 1;

    if (requiresMiddleProof(prototypeId)) {
      assert.equal(state.total % 2, 1, `${prototypeId} must generate odd totals`);
      assert.equal(state.rankFromStart, state.rankFromEnd);
      assert.equal(state.rankFromStart, (state.total + 1) / 2);
      assert.equal(state.isExactMiddle, true);
    }

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options[question.correctIndex]?.value, question.answer);
    assert.equal(
      question.options.filter((option) => option.value === question.answer).length,
      1,
      'Exactly one option must equal the answer',
    );
    assert.equal(
      question.options.filter((option) => option.misconceptionId === 'CORRECT').length,
      1,
      'Exactly one option must be marked correct',
    );

    assert.ok(question.stem.includes(question.targetName));
    assert.ok(question.stem.endsWith('?'));
    assert.ok(!/\b0 people are\b/i.test(question.stem));
    assert.ok(!/\b1 people are\b/i.test(question.stem));
    assert.ok(!/\b1 people is\b/i.test(question.stem));
    assert.ok(question.explanation.keyRule.length >= 45);
    assert.equal(question.explanation.stepByStepSolution.length, 3);
    assert.ok(question.explanation.stepByStepSolution.every((step) => /\d/.test(step)));
    assert.ok(question.explanation.examSpeedShortcut.length >= 35);
    assert.equal(question.explanation.optionAnalysis.length, 4);
    assert.ok(
      question.explanation.optionAnalysis.every((line, index) => line.includes(`Option ${index + 1}`)),
    );
    assert.equal(question.explanation.conclusion, `The correct answer is ${question.answer}.`);

    assert.equal(question.lifecycle.reviewStatus, 'UNREVIEWED');
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(question.lifecycle.publiclyPublishable, false);

    contexts.add(question.contextId);
    difficulties.add(question.difficulty);
    correctPositions[question.correctIndex] += 1;
    stems.add(question.stem);
    fingerprints.add(question.mathematicalFingerprint);
  }

  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
  assert.ok(difficulties.has('EASY'), `${prototypeId} must reach Easy`);
  assert.ok(difficulties.has('MEDIUM'), `${prototypeId} must reach Medium`);
  assert.ok(correctPositions.every((count) => count > 0), `${prototypeId} must use every answer position`);
  assert.ok(stems.size >= 150, `${prototypeId} stem diversity too low: ${stems.size}`);
  assert.ok(
    fingerprints.size >= fingerprintMinimum(prototypeId),
    `${prototypeId} state diversity too low: ${fingerprints.size}`,
  );

  if (requiresBoundaryProof(prototypeId)) {
    assert.ok(boundaryStart > 0, `${prototypeId} must cover first position`);
    assert.ok(boundaryEnd > 0, `${prototypeId} must cover last position`);
  } else {
    assert.equal(exactMiddleCases, SEEDS_PER_PROTOTYPE);
  }

  return {
    prototypeId,
    generated: SEEDS_PER_PROTOTYPE,
    contexts: [...contexts].sort(),
    difficulties: [...difficulties].sort(),
    correctPositions,
    uniqueStems: stems.size,
    uniqueFingerprints: fingerprints.size,
    boundaryStart,
    boundaryEnd,
    exactMiddleCases,
  };
}

function markdownReview(): string {
  const lines: string[] = [
    '# RNK-CP-001 — Source and Inverse Gap Wave Review',
    '',
    'Status: executable discovery only; no permanent QLs.',
    '',
  ];

  for (const prototypeId of RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS) {
    lines.push(`## ${prototypeId}`, '');
    for (const seed of [9, 67, 181]) {
      const question = generateRnkCp001SourceWaveQuestion(prototypeId, seed);
      lines.push(
        `### Seed ${seed}`,
        '',
        question.stem,
        '',
        ...question.options.map((option, index) => `${index + 1}. ${option.label}`),
        '',
        `**Answer:** Option ${question.correctIndex + 1} — ${question.answer}`,
        '',
        `**Main rule:** ${question.explanation.keyRule}`,
        '',
        '**Steps:**',
        ...question.explanation.stepByStepSolution.map((step, index) => `${index + 1}. ${step}`),
        '',
        `**Exam speed trick:** ${question.explanation.examSpeedShortcut}`,
        '',
        '**Option analysis:**',
        ...question.explanation.optionAnalysis.map((line) => `- ${line}`),
        '',
      );
    }
  }

  return `${lines.join('\n')}\n`;
}

const audits = RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS.map(auditPrototype);
const totalQuestions = audits.reduce((sum, audit) => sum + audit.generated, 0);
const chapterDifficulties = new Set(audits.flatMap((audit) => audit.difficulties));
assert.deepEqual([...chapterDifficulties].sort(), ['EASY', 'HARD', 'MEDIUM']);

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  waveId: 'SOURCE_AND_INVERSE_GAP_WAVE',
  provisionalPrototypeCount: RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  seedsPerPrototype: SEEDS_PER_PROTOTYPE,
  totalQuestions,
  combinedCp001DiscoveryQuestions: totalQuestions + 1_440,
  deterministicReplayChecks: totalQuestions,
  canonicalSolverChecks: totalQuestions,
  independentSolverChecks: totalQuestions,
  lifecycleChecks: totalQuestions,
  grammarAgreementChecks: totalQuestions,
  chapterDifficulties: [...chapterDifficulties].sort(),
  audits,
  conclusion: 'PASS_SOURCE_AND_INVERSE_GAP_WAVE',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  const reviewQuestions = RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS.flatMap((prototypeId) =>
    [9, 67, 181].map((seed) => generateRnkCp001SourceWaveQuestion(prototypeId, seed)),
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-source-wave-audit.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-source-wave-review.json'),
    `${JSON.stringify(reviewQuestions, null, 2)}\n`,
  );
  writeFileSync(join(outputDirectory, 'rnk-cp001-source-wave-review.md'), markdownReview());
}

console.log(JSON.stringify(report, null, 2));
