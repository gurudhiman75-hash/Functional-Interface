import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP003_SOURCE_PROTOTYPE_IDS,
  generateRnkCp003SourceQuestion,
  replayMixedTransformations,
  solveCp003SourceIndependently,
  type RnkCp003SourceQuestion,
} from './cp003-source-wave';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const REVIEW_SEEDS = [0, 1, 2, 7, 31, 97] as const;
const outputDirectory = process.argv[2] ?? 'rnk-cp003-source-wave-output';
mkdirSync(outputDirectory, { recursive: true });

const seedsPerPrototype = 240;
const questions = RNK_CP003_SOURCE_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) =>
    generateRnkCp003SourceQuestion(prototypeId, seed),
  ),
);

const contexts = new Set<string>();
const difficulties = new Set<string>();
const correctIndexes = new Set<number>();
const prototypeCounts = new Map<string, number>();
const fingerprints = new Set<string>();

for (const question of questions) {
  const regenerated = generateRnkCp003SourceQuestion(question.prototypeId, question.seed);
  assert(
    JSON.stringify(regenerated) === JSON.stringify(question),
    `Non-deterministic source question at ${question.prototypeId}:${question.seed}`,
  );
  assert(
    solveCp003SourceIndependently(question.displayedEvidence) === question.answer,
    `Source solver mismatch at ${question.prototypeId}:${question.seed}`,
  );
  assert(question.options.length === 4, `Expected four options at ${question.prototypeId}:${question.seed}`);
  assert(
    new Set(question.options.map((option) => option.answer)).size === 4,
    `Option collision at ${question.prototypeId}:${question.seed}`,
  );
  assert(
    question.options[question.correctIndex].answer === question.answer,
    `Correct option mismatch at ${question.prototypeId}:${question.seed}`,
  );
  assert(
    question.options.filter((option) => option.misconceptionId === 'CORRECT').length === 1,
    `Expected one correct option at ${question.prototypeId}:${question.seed}`,
  );
  const maximum = question.displayedEvidence.kind.includes('MEMBERSHIP_CHANGE')
    ? question.displayedEvidence.kind === 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE'
      ? question.displayedEvidence.membershipKind === 'INSERT'
        ? question.displayedEvidence.totalBefore + question.displayedEvidence.membershipCount
        : question.displayedEvidence.totalBefore - question.displayedEvidence.membershipCount
      : question.displayedEvidence.totalBefore
    : question.displayedEvidence.total;
  assert(
    question.options.every((option) => option.answer >= 1 && option.answer <= maximum),
    `Out-of-range source option at ${question.prototypeId}:${question.seed}`,
  );
  assert(question.permanentQlId === null, `Permanent identity allocated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.reviewStatus === 'UNREVIEWED', `Review status activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Public publication activated early at ${question.prototypeId}:${question.seed}`);
  assert(!/\bthe\s+the\b/i.test(question.stem), `Duplicate article at ${question.prototypeId}:${question.seed}`);
  assert(!/\b1 places\b/i.test(question.stem), `Singular movement error at ${question.prototypeId}:${question.seed}`);
  assert(!/start end|end end/i.test(question.stem), `Internal direction wording leaked at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.stepByStepSolution.length >= 4, `Shallow explanation at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.optionAnalysis.length === 4, `Missing option analysis at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.conclusion.includes(String(question.answer)), `Conclusion misses answer at ${question.prototypeId}:${question.seed}`);

  contexts.add(question.contextId);
  difficulties.add(question.difficulty);
  correctIndexes.add(question.correctIndex);
  prototypeCounts.set(question.prototypeId, (prototypeCounts.get(question.prototypeId) ?? 0) + 1);
  fingerprints.add(question.mathematicalFingerprint);
}

assert(contexts.size === 3, 'Merit-list, row and queue contexts must all be reachable');
assert(difficulties.size === 3, 'Easy, Medium and Hard must all be reachable');
assert(correctIndexes.size === 4, 'All four correct-answer positions must be reachable');
assert(prototypeCounts.size === RNK_CP003_SOURCE_PROTOTYPE_IDS.length, 'Every source prototype must be generated');
for (const prototypeId of RNK_CP003_SOURCE_PROTOTYPE_IDS) {
  assert(prototypeCounts.get(prototypeId) === seedsPerPrototype, `Unexpected count for ${prototypeId}`);
}
assert(fingerprints.size > questions.length * 0.9, 'Source mathematical fingerprint diversity is too low');

const rejectedNarratives: string[] = [];
const expectRejection = (label: string, operation: () => unknown): void => {
  try {
    operation();
    throw new Error(`Expected rejection did not occur: ${label}`);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Expected rejection did not occur')) throw error;
    rejectedNarratives.push(label);
  }
};

expectRejection('moving person does not move', () =>
  solveCp003SourceIndependently({
    kind: 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES',
    total: 20,
    moverOriginalRankFromStart: 5,
    moverFinalRankFromStart: 5,
    targetOriginalRank: 12,
    targetOriginalSide: 'START',
    requestedSide: 'START',
  }),
);
expectRejection('target is the moving person', () =>
  solveCp003SourceIndependently({
    kind: 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES',
    total: 20,
    moverOriginalRankFromStart: 5,
    moverFinalRankFromStart: 9,
    targetOriginalRank: 5,
    targetOriginalSide: 'START',
    requestedSide: 'START',
  }),
);
expectRejection('membership removal deletes target', () =>
  replayMixedTransformations(20, 3, 'TOWARD_END', 1, 'REMOVE', 'START', 3, 'CHANGE_THEN_MOVE'),
);
expectRejection('mixed movement crosses upper boundary', () =>
  replayMixedTransformations(20, 2, 'TOWARD_START', 3, 'INSERT', 'END', 2, 'MOVE_THEN_CHANGE'),
);
expectRejection('membership removal leaves too few people', () =>
  replayMixedTransformations(5, 3, 'TOWARD_END', 1, 'REMOVE', 'END', 4, 'MOVE_THEN_CHANGE'),
);

const reviewPack = RNK_CP003_SOURCE_PROTOTYPE_IDS.flatMap((prototypeId) =>
  REVIEW_SEEDS.map((seed) => generateRnkCp003SourceQuestion(prototypeId, seed)),
);
assert(reviewPack.length === 24, 'Unexpected supplementary review-pack size');
assert(
  new Set(reviewPack.map((question) => `${question.prototypeId}:${question.seed}`)).size === reviewPack.length,
  'Duplicate supplementary review identity',
);

function renderMarkdown(reviewQuestions: readonly RnkCp003SourceQuestion[]): string {
  const lines: string[] = ['# RNK-CP-003 Supplementary Questions and Explanations', ''];
  reviewQuestions.forEach((question, index) => {
    lines.push(`## Question ${index + 1}`, '', question.stem, '');
    question.options.forEach((option, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.label}`);
    });
    lines.push(
      '',
      '### Explanation',
      '',
      `**Correct answer:** ${question.answer}`,
      '',
      `**Key rule:** ${question.explanation.keyRule}`,
      '',
      '**Step-by-step solution:**',
      '',
    );
    question.explanation.stepByStepSolution.forEach((step, stepIndex) => {
      lines.push(`${stepIndex + 1}. ${step}`);
    });
    lines.push(
      '',
      `**Exam-speed shortcut:** ${question.explanation.examSpeedShortcut}`,
      '',
      '**Option analysis:**',
      '',
    );
    question.explanation.optionAnalysis.forEach((analysis) => lines.push(`- ${analysis}`));
    lines.push('', `**Conclusion:** ${question.explanation.conclusion}`, '', '---', '');
  });
  return `${lines.join('\n').trim()}\n`;
}

const report = {
  checkpointId: 'RNK-CP-003',
  status: 'SUPPLEMENTARY_ENGLISH_REVIEW_PENDING',
  initialApprovedPrototypes: 9,
  supplementaryPrototypes: RNK_CP003_SOURCE_PROTOTYPE_IDS,
  supplementaryPrototypeCount: RNK_CP003_SOURCE_PROTOTYPE_IDS.length,
  seedsPerPrototype,
  supplementaryRuntimeQuestionCount: questions.length,
  cumulativeDiscoveryPrototypeCount: 13,
  cumulativeDiscoveryQuestionCount: 3120,
  supplementaryReviewQuestionCount: reviewPack.length,
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-018',
  contextCoverage: [...contexts].sort(),
  difficultyCoverage: [...difficulties].sort(),
  correctIndexCoverage: [...correctIndexes].sort(),
  rejectedInvalidNarratives: rejectedNarratives,
  lifecycle: {
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(join(outputDirectory, 'cp003-source-wave-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp003-supplementary-review-pack.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(
  join(outputDirectory, 'RNK-CP-003-Supplementary-Questions-and-Explanations.md'),
  renderMarkdown(reviewPack),
  'utf8',
);
console.log(JSON.stringify(report, null, 2));
