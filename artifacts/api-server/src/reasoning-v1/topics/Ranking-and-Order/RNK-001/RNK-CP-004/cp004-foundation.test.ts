import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP004_PROTOTYPE_IDS,
  generateRnkCp004Question,
  reconstructUniqueOrder,
  solveCp004Independently,
  type RnkCp004Difficulty,
} from './cp004-foundation';
import { buildRnkCp004ReviewPack, renderRnkCp004QuestionsAndExplanationsMarkdown } from './cp004-review-pack';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-discovery-output';
mkdirSync(outputDirectory, { recursive: true });

const seedsPerPrototype = 240;
const questions = RNK_CP004_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) => generateRnkCp004Question(prototypeId, seed)),
);

const correctIndexes = new Set<number>();
const difficulties = new Set<RnkCp004Difficulty>();
const entityCounts = new Set<number>();
const prototypeCounts = new Map<string, number>();
const fingerprints = new Set<string>();

for (const question of questions) {
  const regenerated = generateRnkCp004Question(question.prototypeId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic output at ${question.prototypeId}:${question.seed}`);
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Independent solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4, `Expected four options at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `Option collision at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.filter((option) => option.misconceptionId === 'CORRECT').length === 1, `Expected one correct option at ${question.prototypeId}:${question.seed}`);
  assert(question.permanentQlId === null, `Permanent QL allocated before freeze at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.reviewStatus === 'UNREVIEWED', `Review status activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Public publication activated early at ${question.prototypeId}:${question.seed}`);
  assert(!/\bthe\s+the\b/i.test(question.stem), `Duplicate article in stem at ${question.prototypeId}:${question.seed}`);
  assert(!/cannot be determined/i.test(question.answer), `Partial-order answer leaked into CP-004 at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.stepByStepSolution.length === 4, `Expected four teaching steps at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.optionAnalysis.length === 4, `Missing option analysis at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.conclusion.includes(question.answer), `Conclusion omits answer at ${question.prototypeId}:${question.seed}`);
  if (question.displayedEvidence.query.kind !== 'MISSING_COMPARISON') {
    reconstructUniqueOrder(question.displayedEvidence.entities, question.displayedEvidence.clues);
  }
  correctIndexes.add(question.correctIndex);
  difficulties.add(question.difficulty);
  entityCounts.add(question.displayedEvidence.entities.length);
  prototypeCounts.set(question.prototypeId, (prototypeCounts.get(question.prototypeId) ?? 0) + 1);
  fingerprints.add(question.mathematicalFingerprint);
}

assert(correctIndexes.size === 4, 'All four correct-answer positions must be reachable');
assert(difficulties.size === 3, 'Easy, Medium and Hard must all be reachable');
assert([...entityCounts].every((count) => count >= 5 && count <= 8), 'Unexpected entity count');
assert(entityCounts.size === 4, 'Entity counts 5, 6, 7 and 8 must all be reachable');
assert(prototypeCounts.size === RNK_CP004_PROTOTYPE_IDS.length, 'Every prototype must be generated');
for (const prototypeId of RNK_CP004_PROTOTYPE_IDS) {
  assert(prototypeCounts.get(prototypeId) === seedsPerPrototype, `Unexpected runtime count for ${prototypeId}`);
}
assert(fingerprints.size > questions.length * 0.8, 'Mathematical fingerprint diversity is unexpectedly low');

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

expectRejection('comparison cycle', () => reconstructUniqueOrder(['A', 'B', 'C'], [
  { higher: 'A', lower: 'B' },
  { higher: 'B', lower: 'C' },
  { higher: 'C', lower: 'A' },
]));
expectRejection('ambiguous exact order', () => reconstructUniqueOrder(['A', 'B', 'C'], [
  { higher: 'A', lower: 'B' },
]));
expectRejection('duplicate entity', () => reconstructUniqueOrder(['A', 'A', 'B'], [
  { higher: 'A', lower: 'B' },
]));
expectRejection('unknown clue entity', () => reconstructUniqueOrder(['A', 'B'], [
  { higher: 'A', lower: 'C' },
]));
expectRejection('self comparison', () => reconstructUniqueOrder(['A', 'B'], [
  { higher: 'A', lower: 'A' },
]));

const reviewPack = buildRnkCp004ReviewPack();
assert(reviewPack.length >= RNK_CP004_PROTOTYPE_IDS.length * 6, 'Unexpected review-pack size');
assert(new Set(reviewPack.map((question) => `${question.prototypeId}:${question.seed}`)).size === reviewPack.length, 'Duplicate review-pack identity');

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_DISCOVERY_REVIEW_PENDING',
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-027',
  prototypes: RNK_CP004_PROTOTYPE_IDS,
  prototypeCount: RNK_CP004_PROTOTYPE_IDS.length,
  seedsPerPrototype,
  runtimeQuestionCount: questions.length,
  reviewQuestionCount: reviewPack.length,
  entityCountCoverage: [...entityCounts].sort(),
  difficultyCoverage: [...difficulties].sort(),
  correctIndexCoverage: [...correctIndexes].sort(),
  rejectedInvalidNarratives: rejectedNarratives,
  ownership: {
    exactUniqueMultiEntityOrder: 'RNK-CP-004',
    presentationLedRowQueueMeritRace: 'RNK-CP-005',
    attributeLedHeightAgeMarks: 'RNK-CP-006',
    partialOrderPossibilityDefiniteness: 'RNK-CP-007',
  },
  lifecycle: {
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(join(outputDirectory, 'cp004-discovery-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-review-pack.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations.md'), renderRnkCp004QuestionsAndExplanationsMarkdown(reviewPack), 'utf8');
console.log(JSON.stringify(report, null, 2));
