import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP004_PROTOTYPE_IDS,
  reconstructUniqueOrder,
  solveCp004Independently,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
} from './cp004-foundation';
import {
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion,
} from './cp004-exam-ready';
import {
  buildRnkCp004ReviewPack,
  renderRnkCp004QuestionsAndExplanationsMarkdown,
} from './cp004-review-pack';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function isDirectClue(
  clues: readonly RnkCp004Comparison[],
  key: string,
): boolean {
  return clues.some((clue) => relationKey(clue) === key);
}

function wrongOrderViolatesClue(
  key: string,
  clues: readonly RnkCp004Comparison[],
): boolean {
  const order = key.split('|');
  const positions = new Map(order.map((entity, index) => [entity, index]));
  return clues.some((clue) => positions.get(clue.higher)! >= positions.get(clue.lower)!);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-output';
mkdirSync(outputDirectory, { recursive: true });

const seedsPerPrototype = 240;
const runtime = RNK_CP004_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) =>
    generateRnkCp004ExamReadyQuestion(prototypeId, seed),
  ),
);

const difficulties = new Set<RnkCp004Difficulty>();
const stableIds = new Set<string>();
let indirectPairCount = 0;
let transitiveConclusionCount = 0;
let sufficiencyCount = 0;

for (const question of runtime) {
  const regenerated = generateRnkCp004ExamReadyQuestion(question.prototypeId, question.seed);
  assert(
    JSON.stringify(regenerated) === JSON.stringify(question),
    `Non-deterministic remodel at ${question.prototypeId}:${question.seed}`,
  );
  assert(
    solveCp004Independently(question.displayedEvidence) === question.answerKey,
    `Reviewed independent-solver mismatch at ${question.prototypeId}:${question.seed}`,
  );
  assert(question.options.length === 4, `Expected four options at ${question.prototypeId}:${question.seed}`);
  assert(
    new Set(question.options.map((option) => option.answerKey)).size === 4,
    `Reviewed option collision at ${question.prototypeId}:${question.seed}`,
  );
  assert(
    question.options[question.correctIndex].answerKey === question.answerKey,
    `Reviewed correct option mismatch at ${question.prototypeId}:${question.seed}`,
  );
  assert(
    question.options.filter((option) => option.misconceptionId === 'CORRECT').length === 1,
    `Expected one reviewed correct option at ${question.prototypeId}:${question.seed}`,
  );
  assert(question.stem.includes('\n\n- '), `Clues are not line-separated at ${question.prototypeId}:${question.seed}`);
  assert(!/cycle-free order/i.test(JSON.stringify(question.explanation)), `Cycle-free was equated with uniqueness at ${question.prototypeId}:${question.seed}`);
  assert(!/Consider the answer choices as the proposed comparisons/i.test(question.stem), `Old option wording remains at ${question.prototypeId}:${question.seed}`);
  assert(!/sufficient to determine one complete ranking/i.test(question.stem), `Imprecise sufficiency wording remains at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.stepByStepSolution.length >= 3, `Explanation is too short at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.optionAnalysis.length === 4, `Reviewed option analysis missing at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.conclusion === `Answer: ${question.answer}.`, `Conclusion padding remains at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.stableQuestionId.length > 0, `Stable question ID missing at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.competency.length > 0, `Competency missing at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.reviewStatus === 'REVIEW_PENDING', `Unexpected review status at ${question.prototypeId}:${question.seed}`);
  assert(question.permanentQlId === null, `Permanent QL allocated before approval at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.reviewStatus === 'UNREVIEWED', `Lifecycle activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication activated early at ${question.prototypeId}:${question.seed}`);

  stableIds.add(question.reviewMetadata.stableQuestionId);
  difficulties.add(question.difficulty);

  const query = question.displayedEvidence.query;
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    indirectPairCount += 1;
    for (const option of question.options) {
      assert(
        option.label.includes(query.first) && option.label.includes(query.second),
        `Pair-relation option does not address the named pair at ${question.prototypeId}:${question.seed}`,
      );
    }
    assert(
      !isDirectClue(question.displayedEvidence.clues, question.answerKey),
      `Pair-relation answer is copied from a clue at ${question.prototypeId}:${question.seed}`,
    );
  }

  if (query.kind === 'VALID_RANK_STATEMENT') {
    transitiveConclusionCount += 1;
    assert(
      !isDirectClue(question.displayedEvidence.clues, question.answerKey),
      `Conclusion answer is copied from a clue at ${question.prototypeId}:${question.seed}`,
    );
    const order = reconstructUniqueOrder(question.displayedEvidence.entities, question.displayedEvidence.clues);
    const positions = new Map(order.map((entity, index) => [entity, index]));
    const trueCandidates = query.candidates.filter(
      (candidate) => positions.get(candidate.higher)! < positions.get(candidate.lower)!,
    );
    assert(trueCandidates.length === 1, `Conclusion options are not single-answer safe at ${question.prototypeId}:${question.seed}`);
  }

  if (query.kind === 'COMPLETE_ORDER') {
    for (const option of question.options) {
      if (option.answerKey === question.answerKey) continue;
      assert(
        wrongOrderViolatesClue(option.answerKey, question.displayedEvidence.clues),
        `Complete-order distractor has no identifiable clue violation at ${question.prototypeId}:${question.seed}`,
      );
    }
  }

  if (query.kind === 'MISSING_COMPARISON') {
    sufficiencyCount += 1;
    const baseCount = countTopologicalOrders(question.displayedEvidence.entities, question.displayedEvidence.clues);
    assert(baseCount > 1, `Sufficiency base is already unique at ${question.prototypeId}:${question.seed}`);
    const optionCounts = query.candidates.map((candidate) =>
      countTopologicalOrders(
        question.displayedEvidence.entities,
        [...question.displayedEvidence.clues, candidate],
      ),
    );
    assert(optionCounts.filter((count) => count === 1).length === 1, `Sufficiency options are not single-answer safe at ${question.prototypeId}:${question.seed}`);
    assert(
      question.explanation.stepByStepSolution[0].startsWith('The base clues form these blocks:'),
      `Sufficiency explanation does not begin with base blocks at ${question.prototypeId}:${question.seed}`,
    );
    assert(
      !question.explanation.stepByStepSolution[0].includes('unique order'),
      `Sufficiency explanation reveals the final order too early at ${question.prototypeId}:${question.seed}`,
    );
    for (const option of question.options) {
      if (option.answerKey === question.answerKey) continue;
      assert(
        /permits \d+ complete orders|no valid ranking remains/.test(option.explanation),
        `Wrong sufficiency option does not explain remaining ambiguity at ${question.prototypeId}:${question.seed}`,
      );
    }
  }
}

assert(stableIds.size === runtime.length, 'Stable reviewed question IDs are not unique');
assert(difficulties.size === 3, 'Remodel must reach Easy, Medium and Hard');
assert(indirectPairCount === seedsPerPrototype, 'Unexpected pair-relation runtime count');
assert(transitiveConclusionCount === seedsPerPrototype, 'Unexpected conclusion runtime count');
assert(sufficiencyCount === seedsPerPrototype, 'Unexpected sufficiency runtime count');

const reviewPack = buildRnkCp004ReviewPack();
assert(reviewPack.length === 60, 'Expected 60 remodeled review questions');
const correctIndexCounts = [0, 0, 0, 0];
for (const question of reviewPack) correctIndexCounts[question.correctIndex] += 1;
assert(correctIndexCounts.every((count) => count === 15), `Review answer positions are not balanced: ${correctIndexCounts.join(',')}`);
const answerSequence = reviewPack.map((question) => question.correctIndex);
const fourGrams = new Set<string>();
for (let index = 0; index <= answerSequence.length - 4; index += 1) {
  const key = answerSequence.slice(index, index + 4).join('');
  assert(!fourGrams.has(key), `Repeated four-answer sequence detected: ${key}`);
  fourGrams.add(key);
}
assert(
  new Set(reviewPack.map((question) => question.explanation.mentalPicture)).size >= 8,
  'Mental-picture explanations remain over-templated',
);
assert(
  new Set(reviewPack.map((question) => question.explanation.keyRule)).size >= 8,
  'Key-rule explanations remain over-templated',
);
assert(
  new Set(reviewPack.map((question) => question.explanation.examSpeedShortcut)).size >= 8,
  'Exam-speed shortcuts remain over-templated',
);

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_REMODEL_REVIEW_PENDING',
  generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V1',
  sourceReview: 'RNK-CP004-EXAM-READINESS-CRITICAL-REVIEW.md',
  runtimeQuestionCount: runtime.length,
  reviewQuestionCount: reviewPack.length,
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-027',
  answerPositionCounts: correctIndexCounts,
  repeatedFourAnswerSequences: 0,
  pairRelationSamePairOptions: 'PASS',
  pairRelationDirectClueLeakage: 0,
  conclusionDirectClueLeakage: 0,
  sufficiencyBlockFirstProof: 'PASS',
  stableMetadata: 'PASS',
  difficultyCoverage: [...difficulties].sort(),
  lifecycle: {
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(
  join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled.md'),
  renderRnkCp004QuestionsAndExplanationsMarkdown(reviewPack),
  'utf8',
);
console.log(JSON.stringify(report, null, 2));
