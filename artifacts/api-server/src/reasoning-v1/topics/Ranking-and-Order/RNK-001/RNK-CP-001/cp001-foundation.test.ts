import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp001Question,
  RNK_CP001_PROTOTYPE_IDS,
  solveCp001Independently,
  type RnkContextId,
  type RnkCp001PrototypeId,
  type RnkDifficulty,
} from './cp001-runtime';

const SEEDS_PER_PROTOTYPE = 240;

interface PrototypeAudit {
  readonly prototypeId: RnkCp001PrototypeId;
  readonly generated: number;
  readonly contexts: readonly RnkContextId[];
  readonly difficulties: readonly RnkDifficulty[];
  readonly correctPositions: readonly number[];
  readonly uniqueStems: number;
  readonly uniqueFingerprints: number;
  readonly boundaryStart: number;
  readonly boundaryEnd: number;
}

function auditPrototype(prototypeId: RnkCp001PrototypeId): PrototypeAudit {
  const contexts = new Set<RnkContextId>();
  const difficulties = new Set<RnkDifficulty>();
  const correctPositions = [0, 0, 0, 0];
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  let boundaryStart = 0;
  let boundaryEnd = 0;

  for (let seed = 0; seed < SEEDS_PER_PROTOTYPE; seed += 1) {
    const question = generateRnkCp001Question(prototypeId, seed);
    const replay = generateRnkCp001Question(prototypeId, seed);

    assert.deepEqual(replay, question, `${prototypeId} seed ${seed} must replay byte-stably`);
    assert.equal(question.packageId, 'RNK-001');
    assert.equal(question.checkpointId, 'RNK-CP-001');
    assert.equal(question.prototypeId, prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.locale, 'en-IN');
    assert.equal(question.answer, solveCp001Independently(question.displayedEvidence));

    const state = question.normalizedState;
    assert.ok(Number.isInteger(state.total) && state.total >= 8);
    assert.ok(state.rankFromStart >= 1 && state.rankFromStart <= state.total);
    assert.ok(state.rankFromEnd >= 1 && state.rankFromEnd <= state.total);
    assert.equal(state.rankFromStart + state.rankFromEnd, state.total + 1);
    assert.equal(state.beforeCount, state.rankFromStart - 1);
    assert.equal(state.afterCount, state.total - state.rankFromStart);
    assert.equal(state.beforeCount + state.afterCount + 1, state.total);

    if (state.rankFromStart === 1) boundaryStart += 1;
    if (state.rankFromStart === state.total) boundaryEnd += 1;

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

    assert.ok(question.stem.startsWith(question.targetName) || question.stem.includes(question.targetName));
    assert.ok(question.stem.endsWith('?'));
    assert.ok(!/\b(?:0|1) people are\b/.test(question.stem), `Broken count agreement: ${question.stem}`);
    assert.ok(question.explanation.keyRule.length >= 45);
    assert.equal(question.explanation.stepByStepSolution.length, 3);
    assert.ok(question.explanation.stepByStepSolution.every((step) => /\d/.test(step)));
    assert.ok(question.explanation.examSpeedShortcut.length >= 35);
    assert.equal(question.explanation.optionAnalysis.length, 4);
    assert.ok(question.explanation.optionAnalysis.every((line, index) => line.includes(`Option ${index + 1}`)));
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
  assert.deepEqual([...difficulties].sort(), ['EASY', 'HARD', 'MEDIUM']);
  assert.ok(correctPositions.every((count) => count > 0), `${prototypeId} must use every answer position`);
  assert.ok(stems.size >= 150, `${prototypeId} stem diversity too low: ${stems.size}`);

  const oneVariableEvidence =
    prototypeId === 'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK' ||
    prototypeId === 'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE';
  const minimumFingerprintDiversity = oneVariableEvidence ? 90 : 120;
  assert.ok(
    fingerprints.size >= minimumFingerprintDiversity,
    `${prototypeId} state diversity too low: ${fingerprints.size} < ${minimumFingerprintDiversity}`,
  );

  assert.ok(boundaryStart > 0, `${prototypeId} must cover first position`);
  assert.ok(boundaryEnd > 0, `${prototypeId} must cover last position`);

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
  };
}

function markdownReview(): string {
  const lines: string[] = [
    '# RNK-CP-001 — Provisional English Review',
    '',
    'Status: executable discovery only; no permanent QLs.',
    '',
  ];

  for (const prototypeId of RNK_CP001_PROTOTYPE_IDS) {
    lines.push(`## ${prototypeId}`, '');
    for (const seed of [7, 41, 113]) {
      const question = generateRnkCp001Question(prototypeId, seed);
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

const audits = RNK_CP001_PROTOTYPE_IDS.map(auditPrototype);
const totalQuestions = audits.reduce((sum, audit) => sum + audit.generated, 0);
const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  provisionalPrototypeCount: RNK_CP001_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  seedsPerPrototype: SEEDS_PER_PROTOTYPE,
  totalQuestions,
  deterministicReplayChecks: totalQuestions,
  independentSolverChecks: totalQuestions,
  lifecycleChecks: totalQuestions,
  grammarAgreementChecks: totalQuestions,
  audits,
  conclusion: 'PASS_EXECUTABLE_DISCOVERY_FOUNDATION',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  const reviewQuestions = RNK_CP001_PROTOTYPE_IDS.flatMap((prototypeId) =>
    [7, 41, 113].map((seed) => generateRnkCp001Question(prototypeId, seed)),
  );
  writeFileSync(join(outputDirectory, 'rnk-cp001-foundation-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(join(outputDirectory, 'rnk-cp001-provisional-review.json'), `${JSON.stringify(reviewQuestions, null, 2)}\n`);
  writeFileSync(join(outputDirectory, 'rnk-cp001-provisional-review.md'), markdownReview());
}

console.log(JSON.stringify(report, null, 2));
