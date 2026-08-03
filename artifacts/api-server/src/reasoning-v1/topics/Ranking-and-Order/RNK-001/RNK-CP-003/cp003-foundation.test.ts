import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP003_PROTOTYPE_IDS,
  solveCp003Independently,
  type RnkCp003Difficulty,
} from './cp003-model';
import { generateRnkCp003Question } from './cp003-foundation';
import {
  buildRnkCp003ReviewPack,
  renderRnkCp003QuestionsAndExplanationsMarkdown,
} from './cp003-review-pack';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp003-discovery-output';
mkdirSync(outputDirectory, { recursive: true });

const seedsPerPrototype = 240;
const questions = RNK_CP003_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) => generateRnkCp003Question(prototypeId, seed)),
);

const correctIndexes = new Set<number>();
const contexts = new Set<string>();
const difficulties = new Set<RnkCp003Difficulty>();
const prototypeCounts = new Map<string, number>();
const fingerprints = new Set<string>();

for (const question of questions) {
  const regenerated = generateRnkCp003Question(question.prototypeId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic output at ${question.prototypeId}:${question.seed}`);
  assert(solveCp003Independently(question.displayedEvidence) === question.answerKey, `Independent solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4, `Expected four options at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `Option collision at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.filter((option) => option.misconceptionId === 'CORRECT').length === 1, `Expected one correct option at ${question.prototypeId}:${question.seed}`);
  if (question.answerSemantic === 'RANK') {
    const maximum = question.displayedEvidence.kind === 'TARGET_RANK_AFTER_INSERTION'
      ? question.displayedEvidence.totalBefore + 1
      : question.displayedEvidence.kind === 'TARGET_RANK_AFTER_REMOVAL'
        ? question.displayedEvidence.totalBefore - 1
        : 'total' in question.displayedEvidence
          ? question.displayedEvidence.total
          : Number.MAX_SAFE_INTEGER;
    assert(question.options.every((option) => Number(option.answerKey) >= 1 && Number(option.answerKey) <= maximum), `Out-of-range rank option at ${question.prototypeId}:${question.seed}`);
  }
  if (question.answerSemantic === 'RANK_PAIR' && 'total' in question.displayedEvidence) {
    const pairTotal = question.displayedEvidence.total;
    assert(question.options.every((option) => option.answerKey.split('|').map(Number).every((rank) => rank >= 1 && rank <= pairTotal)), `Out-of-range pair option at ${question.prototypeId}:${question.seed}`);
  }
  assert(question.permanentQlId === null, `Permanent QL allocated before freeze at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.reviewStatus === 'UNREVIEWED', `Review status activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Public publication activated early at ${question.prototypeId}:${question.seed}`);
  assert(!/\bthe\s+the\b/i.test(question.stem), `Duplicate article in stem at ${question.prototypeId}:${question.seed}`);
  assert(!/start end|end end/i.test(question.stem), `Internal direction wording leaked at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.stepByStepSolution.length >= 3, `Explanation is too shallow at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.optionAnalysis.length === 4, `Missing option analysis at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.conclusion.includes(question.answer), `Conclusion does not state the answer at ${question.prototypeId}:${question.seed}`);
  correctIndexes.add(question.correctIndex);
  contexts.add(question.contextId);
  difficulties.add(question.difficulty);
  prototypeCounts.set(question.prototypeId, (prototypeCounts.get(question.prototypeId) ?? 0) + 1);
  fingerprints.add(question.mathematicalFingerprint);
}

assert(correctIndexes.size === 4, 'All four correct-answer positions must be reachable');
assert(contexts.size === 4, 'All four presentation contexts must be reachable');
assert(difficulties.size === 3, 'Easy, Medium and Hard must all be reachable');
assert(prototypeCounts.size === RNK_CP003_PROTOTYPE_IDS.length, 'Every prototype must be generated');
for (const prototypeId of RNK_CP003_PROTOTYPE_IDS) assert(prototypeCounts.get(prototypeId) === seedsPerPrototype, `Unexpected runtime count for ${prototypeId}`);
assert(fingerprints.size > questions.length * 0.85, 'Mathematical fingerprint diversity is unexpectedly low');

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

expectRejection('movement above first position', () => solveCp003Independently({ kind: 'FINAL_RANK_AFTER_SINGLE_MOVEMENT', total: 20, originalRank: 3, originalSide: 'START', direction: 'TOWARD_START', distance: 4, requestedSide: 'START' }));
expectRejection('movement below last position', () => solveCp003Independently({ kind: 'FINAL_RANK_AFTER_SINGLE_MOVEMENT', total: 20, originalRank: 18, originalSide: 'START', direction: 'TOWARD_END', distance: 4, requestedSide: 'START' }));
expectRejection('interchange with same position', () => solveCp003Independently({ kind: 'FINAL_RANKS_AFTER_INTERCHANGE', total: 20, firstOriginalRank: 7, firstOriginalSide: 'START', secondOriginalRank: 14, secondOriginalSide: 'END', firstRequestedSide: 'START', secondRequestedSide: 'START' }));
expectRejection('target removed from list', () => solveCp003Independently({ kind: 'TARGET_RANK_AFTER_REMOVAL', totalBefore: 20, targetOriginalRank: 8, targetOriginalSide: 'START', removedOriginalRank: 13, removedOriginalSide: 'END', requestedSide: 'START' }));
expectRejection('invalid sequential intermediate rank', () => solveCp003Independently({ kind: 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES', total: 20, originalRank: 2, originalSide: 'START', firstDirection: 'TOWARD_START', firstDistance: 3, secondDirection: 'TOWARD_END', secondDistance: 4, requestedSide: 'START' }));

const reviewPack = buildRnkCp003ReviewPack();
assert(reviewPack.length === RNK_CP003_PROTOTYPE_IDS.length * 6, 'Unexpected review-pack size');
assert(new Set(reviewPack.map((question) => `${question.prototypeId}:${question.seed}`)).size === reviewPack.length, 'Duplicate review-pack identity');

const report = {
  checkpointId: 'RNK-CP-003',
  status: 'ENGLISH_DISCOVERY_REVIEW_PENDING',
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-018',
  prototypes: RNK_CP003_PROTOTYPE_IDS,
  prototypeCount: RNK_CP003_PROTOTYPE_IDS.length,
  seedsPerPrototype,
  runtimeQuestionCount: questions.length,
  reviewQuestionCount: reviewPack.length,
  contextCoverage: [...contexts].sort(),
  difficultyCoverage: [...difficulties].sort(),
  correctIndexCoverage: [...correctIndexes].sort(),
  rejectedInvalidNarratives: rejectedNarratives,
  lifecycle: { questionStudio: 'DISABLED', questionBank: 'NOT_STORED', testEligibility: 'INELIGIBLE', publicPublication: false, hindiPunjabi: 'NOT_STARTED' },
};

writeFileSync(join(outputDirectory, 'cp003-discovery-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp003-review-pack.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'RNK-CP-003-Questions-and-Explanations.md'), renderRnkCp003QuestionsAndExplanationsMarkdown(reviewPack), 'utf8');
console.log(JSON.stringify(report, null, 2));
