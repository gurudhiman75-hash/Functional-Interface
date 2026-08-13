import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp001SourceWaveReviewedQuestion,
  RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS,
  solveRnkCp001SourceWaveCanonical,
  solveRnkCp001SourceWaveIndependently,
  type RnkCp001SourceWavePrototypeId,
} from './cp001-source-wave-reviewed';

const SEEDS_PER_PROTOTYPE = 240;

interface ReviewedPrototypeAudit {
  readonly prototypeId: RnkCp001SourceWavePrototypeId;
  readonly generated: number;
  readonly uniqueStems: number;
  readonly contexts: readonly string[];
  readonly difficulties: readonly string[];
  readonly correctPositions: readonly number[];
  readonly properNameChecks: number;
  readonly grammarChecks: number;
}

function lowercaseInitial(text: string): string {
  return `${text[0].toLowerCase()}${text.slice(1)}`;
}

function auditPrototype(prototypeId: RnkCp001SourceWavePrototypeId): ReviewedPrototypeAudit {
  const stems = new Set<string>();
  const contexts = new Set<string>();
  const difficulties = new Set<string>();
  const correctPositions = [0, 0, 0, 0];
  let properNameChecks = 0;
  let grammarChecks = 0;

  for (let seed = 0; seed < SEEDS_PER_PROTOTYPE; seed += 1) {
    const question = generateRnkCp001SourceWaveReviewedQuestion(prototypeId, seed);
    const replay = generateRnkCp001SourceWaveReviewedQuestion(prototypeId, seed);
    assert.deepEqual(replay, question, `${prototypeId} seed ${seed} must replay deterministically`);

    assert.equal(
      question.answer,
      solveRnkCp001SourceWaveIndependently(question.displayedEvidence),
      `${prototypeId} seed ${seed}: independent solver disagreement`,
    );
    assert.equal(
      question.answer,
      solveRnkCp001SourceWaveCanonical(prototypeId, question.normalizedState),
      `${prototypeId} seed ${seed}: canonical solver disagreement`,
    );

    const lowercaseName = lowercaseInitial(question.targetName);
    assert.ok(question.stem.includes(question.targetName), `${prototypeId} seed ${seed}: proper name missing`);
    assert.ok(
      !question.stem.includes(lowercaseName),
      `${prototypeId} seed ${seed}: learner stem lowercases proper name ${question.targetName}`,
    );
    properNameChecks += 1;

    assert.ok(!/\b0 people are\b/i.test(question.stem));
    assert.ok(!/\b1 people are\b/i.test(question.stem));
    assert.ok(!/\b1 people is\b/i.test(question.stem));
    assert.ok(!/\bno one are\b/i.test(question.stem));
    assert.ok(!/\bone person are\b/i.test(question.stem));
    grammarChecks += 1;

    if (question.displayedEvidence.kind === 'TOTAL_FROM_MIDDLE_RANK') {
      assert.ok(
        question.explanation.stepByStepSolution.some((step) => step.includes('×')),
        `${prototypeId} seed ${seed}: reviewed multiplication sign missing`,
      );
      assert.ok(
        question.explanation.stepByStepSolution.every((step) => !step.includes(' x ')),
        `${prototypeId} seed ${seed}: raw x multiplication leaked`,
      );
    }

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options[question.correctIndex]?.value, question.answer);
    assert.equal(question.options.filter((option) => option.value === question.answer).length, 1);
    assert.equal(question.options.filter((option) => option.misconceptionId === 'CORRECT').length, 1);
    assert.equal(question.explanation.optionAnalysis.length, 4);
    assert.ok(question.explanation.stepByStepSolution.every((step) => /\d/.test(step)));

    assert.equal(question.permanentQlId, null);
    assert.equal(question.lifecycle.reviewStatus, 'UNREVIEWED');
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(question.lifecycle.publiclyPublishable, false);

    stems.add(question.stem);
    contexts.add(question.contextId);
    difficulties.add(question.difficulty);
    correctPositions[question.correctIndex] += 1;
  }

  assert.ok(stems.size >= 150, `${prototypeId} reviewed stem diversity too low: ${stems.size}`);
  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
  assert.ok(difficulties.has('EASY'));
  assert.ok(difficulties.has('MEDIUM'));
  assert.ok(correctPositions.every((count) => count > 0));

  return {
    prototypeId,
    generated: SEEDS_PER_PROTOTYPE,
    uniqueStems: stems.size,
    contexts: [...contexts].sort(),
    difficulties: [...difficulties].sort(),
    correctPositions,
    properNameChecks,
    grammarChecks,
  };
}

function markdownReview(): string {
  const lines: string[] = [
    '# RNK-CP-001 — Reviewed Source and Inverse Gap Wave',
    '',
    'Status: executable English discovery; no permanent QLs.',
    '',
  ];

  for (const prototypeId of RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS) {
    lines.push(`## ${prototypeId}`, '');
    for (const seed of [9, 67, 181]) {
      const question = generateRnkCp001SourceWaveReviewedQuestion(prototypeId, seed);
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
const difficultyCoverage = new Set(audits.flatMap((audit) => audit.difficulties));
assert.deepEqual([...difficultyCoverage].sort(), ['EASY', 'HARD', 'MEDIUM']);

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  waveId: 'SOURCE_AND_INVERSE_GAP_WAVE_REVIEWED',
  provisionalPrototypeCount: RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  seedsPerPrototype: SEEDS_PER_PROTOTYPE,
  totalQuestions,
  combinedCp001DiscoveryQuestions: totalQuestions + 1_440,
  deterministicReplayChecks: totalQuestions,
  independentSolverChecks: totalQuestions,
  canonicalSolverChecks: totalQuestions,
  properNameChecks: totalQuestions,
  grammarAgreementChecks: totalQuestions,
  lifecycleChecks: totalQuestions,
  difficultyCoverage: [...difficultyCoverage].sort(),
  audits,
  conclusion: 'PASS_REVIEWED_SOURCE_AND_INVERSE_GAP_WAVE',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  const reviewQuestions = RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS.flatMap((prototypeId) =>
    [9, 67, 181].map((seed) => generateRnkCp001SourceWaveReviewedQuestion(prototypeId, seed)),
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-source-wave-reviewed-audit.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-source-wave-reviewed.json'),
    `${JSON.stringify(reviewQuestions, null, 2)}\n`,
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-source-wave-reviewed.md'),
    markdownReview(),
  );
}

console.log(JSON.stringify(report, null, 2));
