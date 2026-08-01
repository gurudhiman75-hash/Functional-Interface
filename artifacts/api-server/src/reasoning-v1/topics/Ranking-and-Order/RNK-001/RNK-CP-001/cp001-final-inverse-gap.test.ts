import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp001FinalInverseQuestion,
  RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID,
  solveRnkCp001FinalInverseCanonical,
  solveRnkCp001FinalInverseIndependently,
} from './cp001-final-inverse-gap';

const SEED_COUNT = 240;
const contexts = new Set<string>();
const difficulties = new Set<string>();
const stems = new Set<string>();
const fingerprints = new Set<string>();
const correctPositions = [0, 0, 0, 0];
let boundaryStart = 0;
let boundaryEnd = 0;

function lowercaseInitial(text: string): string {
  return `${text[0].toLowerCase()}${text.slice(1)}`;
}

for (let seed = 0; seed < SEED_COUNT; seed += 1) {
  const question = generateRnkCp001FinalInverseQuestion(seed);
  const replay = generateRnkCp001FinalInverseQuestion(seed);
  assert.deepEqual(replay, question, `Seed ${seed} must replay byte-stably`);

  assert.equal(question.packageId, 'RNK-001');
  assert.equal(question.checkpointId, 'RNK-CP-001');
  assert.equal(question.waveId, 'FINAL_MIRRORED_INVERSE_ADDENDUM');
  assert.equal(question.prototypeId, RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID);
  assert.equal(question.permanentQlId, null);
  assert.equal(question.locale, 'en-IN');

  assert.equal(
    question.answer,
    solveRnkCp001FinalInverseCanonical(question.normalizedState),
  );
  assert.equal(
    question.answer,
    solveRnkCp001FinalInverseIndependently(question.displayedEvidence),
  );

  const state = question.normalizedState;
  assert.ok(state.total >= 8 && Number.isInteger(state.total));
  assert.equal(state.rankFromStart + state.rankFromEnd, state.total + 1);
  assert.equal(state.beforeCount, state.rankFromStart - 1);
  assert.equal(state.afterCount, state.rankFromEnd - 1);
  assert.equal(state.beforeCount + state.afterCount + 1, state.total);
  assert.equal(question.answer, state.total - state.beforeCount);

  if (state.rankFromStart === 1) boundaryStart += 1;
  if (state.rankFromStart === state.total) boundaryEnd += 1;

  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
  assert.equal(question.options[question.correctIndex]?.value, question.answer);
  assert.equal(question.options.filter((option) => option.value === question.answer).length, 1);
  assert.equal(question.options.filter((option) => option.misconceptionId === 'CORRECT').length, 1);

  assert.ok(question.stem.includes(question.targetName));
  assert.ok(!question.stem.includes(lowercaseInitial(question.targetName)));
  assert.ok(question.stem.endsWith('?'));
  assert.ok(!/\b0 people are\b/i.test(question.stem));
  assert.ok(!/\b1 people are\b/i.test(question.stem));
  assert.ok(!/\bno one are\b/i.test(question.stem));
  assert.ok(!/\bone person are\b/i.test(question.stem));

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
  stems.add(question.stem);
  fingerprints.add(question.mathematicalFingerprint);
  correctPositions[question.correctIndex] += 1;
}

assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
assert.deepEqual([...difficulties].sort(), ['EASY', 'HARD', 'MEDIUM']);
assert.ok(correctPositions.every((count) => count > 0));
assert.ok(stems.size >= 200, `Stem diversity too low: ${stems.size}`);
assert.ok(fingerprints.size >= 190, `State diversity too low: ${fingerprints.size}`);
assert.ok(boundaryStart > 0, 'First-position boundary must be covered');
assert.ok(boundaryEnd > 0, 'Last-position boundary must be covered');

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  waveId: 'FINAL_MIRRORED_INVERSE_ADDENDUM',
  prototypeId: RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID,
  permanentQlCount: 0,
  generatedQuestions: SEED_COUNT,
  combinedCp001DiscoveryQuestions: 3_120,
  deterministicReplayChecks: SEED_COUNT,
  canonicalSolverChecks: SEED_COUNT,
  independentSolverChecks: SEED_COUNT,
  properNameChecks: SEED_COUNT,
  grammarChecks: SEED_COUNT,
  lifecycleChecks: SEED_COUNT,
  contexts: [...contexts].sort(),
  difficulties: [...difficulties].sort(),
  correctPositions,
  uniqueStems: stems.size,
  uniqueFingerprints: fingerprints.size,
  boundaryStart,
  boundaryEnd,
  conclusion: 'PASS_FINAL_MIRRORED_INVERSE_ADDENDUM',
};

function markdownReview(): string {
  const lines: string[] = [
    '# RNK-CP-001 — Final Mirrored Inverse Review',
    '',
    'Status: executable English discovery; no permanent QL.',
    '',
  ];

  for (const seed of [12, 79, 193]) {
    const question = generateRnkCp001FinalInverseQuestion(seed);
    lines.push(
      `## Seed ${seed}`,
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
  return `${lines.join('\n')}\n`;
}

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  const reviewQuestions = [12, 79, 193].map((seed) => generateRnkCp001FinalInverseQuestion(seed));
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-final-inverse-audit.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-final-inverse-review.json'),
    `${JSON.stringify(reviewQuestions, null, 2)}\n`,
  );
  writeFileSync(join(outputDirectory, 'rnk-cp001-final-inverse-review.md'), markdownReview());
}

console.log(JSON.stringify(report, null, 2));
