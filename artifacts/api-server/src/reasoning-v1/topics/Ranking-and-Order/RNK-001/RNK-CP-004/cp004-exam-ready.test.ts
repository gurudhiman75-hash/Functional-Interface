import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP004_PROTOTYPE_IDS,
  reconstructUniqueOrder,
  solveCp004Independently,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
  type RnkCp004Query,
} from './cp004-foundation';
import {
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExplanationMode,
} from './cp004-exam-ready-v3';
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

function isDirectClue(clues: readonly RnkCp004Comparison[], key: string): boolean {
  return clues.some((clue) => relationKey(clue) === key);
}

function wrongOrderViolatesClue(key: string, clues: readonly RnkCp004Comparison[]): boolean {
  const order = key.split('|');
  const positions = new Map(order.map((entity, index) => [entity, index]));
  return clues.some((clue) => positions.get(clue.higher)! >= positions.get(clue.lower)!);
}

function expectedMode(query: RnkCp004Query): RnkCp004ExplanationMode {
  switch (query.kind) {
    case 'HIGHEST_ENTITY':
    case 'LOWEST_ENTITY':
      return 'ENDPOINT_MINIMAL';
    case 'ENTITY_AT_EXACT_RANK':
    case 'RANK_OF_NAMED_ENTITY':
    case 'MIDDLE_ENTITY':
      return 'POSITION_LINE';
    case 'RELATIVE_ORDER_OF_PAIR':
      return 'PAIR_PATH';
    case 'IMMEDIATE_NEIGHBOUR':
      return 'NEIGHBOUR_HIGHLIGHT';
    case 'COMPLETE_ORDER':
      return 'OPTION_CONTRADICTION';
    case 'VALID_RANK_STATEMENT':
      return 'TRANSITIVE_PROOF';
    case 'MISSING_COMPARISON':
      return 'BLOCK_BRIDGE';
  }
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v2-output';
mkdirSync(outputDirectory, { recursive: true });

const seedsPerPrototype = 240;
const runtime = RNK_CP004_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) =>
    generateRnkCp004ExamReadyQuestion(prototypeId, seed),
  ),
);

const difficulties = new Set<RnkCp004Difficulty>();
const stableIds = new Set<string>();
const explanationModes = new Set<RnkCp004ExplanationMode>();
let indirectPairCount = 0;
let transitiveConclusionCount = 0;
let immediateNeighbourCount = 0;
let sufficiencyCount = 0;
let removedRedundantClues = 0;

for (const question of runtime) {
  const regenerated = generateRnkCp004ExamReadyQuestion(question.prototypeId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic V2 output at ${question.prototypeId}:${question.seed}`);
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Independent solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4, `Expected four options at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `Option collision at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].label === question.answer, `Answer text mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.filter((option) => option.misconceptionId === 'CORRECT').length === 1, `Expected one correct option at ${question.prototypeId}:${question.seed}`);
  assert(question.stem.includes('\n\n- '), `Clues are not line-separated at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.generationVersion === 'RNK_CP004_ENGLISH_REMODEL_V2', `Wrong generation version at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.explanationMode === expectedMode(question.displayedEvidence.query), `Wrong explanation mode at ${question.prototypeId}:${question.seed}`);
  assert(question.visibleExplanation.mode === question.reviewMetadata.explanationMode, `Visible mode mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.visibleExplanation.lines.length >= 1 && question.visibleExplanation.lines.length <= 3, `Visible explanation is not adaptive at ${question.prototypeId}:${question.seed}`);
  assert(!/must not merely repeat a clue/i.test(JSON.stringify(question)), `Incorrect conclusion rule remains at ${question.prototypeId}:${question.seed}`);
  assert(!/stopping before the (top|bottom) endpoint/i.test(JSON.stringify(question)), `Speculative endpoint diagnosis remains at ${question.prototypeId}:${question.seed}`);
  assert(!/counting from the bottom instead of the top/i.test(JSON.stringify(question.options)), `Unrelated counting diagnosis remains at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.stableQuestionId.length > 0, `Stable ID missing at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.normalizedSemanticFingerprint.length > 0, `Normalized fingerprint missing at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.reasoningFeatures.featureScore > 0, `Feature score missing at ${question.prototypeId}:${question.seed}`);
  assert(question.permanentQlId === null, `Permanent QL allocated before approval at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.reviewStatus === 'UNREVIEWED', `Lifecycle activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication activated early at ${question.prototypeId}:${question.seed}`);

  stableIds.add(question.reviewMetadata.stableQuestionId);
  difficulties.add(question.difficulty);
  explanationModes.add(question.visibleExplanation.mode);
  removedRedundantClues += Math.max(0, question.reviewMetadata.reasoningFeatures.redundantClueCount);

  const query = question.displayedEvidence.query;
  const redundancyBudget = query.kind === 'COMPLETE_ORDER' || query.kind === 'VALID_RANK_STATEMENT' ? 1 : 0;
  assert(question.reviewMetadata.reasoningFeatures.redundantClueCount <= redundancyBudget, `Redundancy budget exceeded at ${question.prototypeId}:${question.seed}`);

  if (query.kind === 'HIGHEST_ENTITY' || query.kind === 'LOWEST_ENTITY') {
    assert(question.visibleExplanation.lines.length === 2, `Endpoint explanation is not minimal at ${question.prototypeId}:${question.seed}`);
    assert(!question.visibleExplanation.optionAnalysis, `Endpoint item exposes unnecessary option analysis at ${question.prototypeId}:${question.seed}`);
  }

  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    indirectPairCount += 1;
    assert(!isDirectClue(question.displayedEvidence.clues, question.answerKey), `Pair answer is copied from a clue at ${question.prototypeId}:${question.seed}`);
    for (const option of question.options) {
      assert(option.label.includes(query.first) && option.label.includes(query.second), `Pair option does not address the named pair at ${question.prototypeId}:${question.seed}`);
      assert(!/same rank|cannot be determined/i.test(option.label), `Dead pair distractor remains at ${question.prototypeId}:${question.seed}`);
    }
  }

  if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    immediateNeighbourCount += 1;
    assert(question.options.every((option) => option.answerKey !== query.target), `Target is used as its own neighbour at ${question.prototypeId}:${question.seed}`);
    assert(question.options.every((option) => /directly|position|positions/.test(option.explanation)), `Neighbour explanation is not positional at ${question.prototypeId}:${question.seed}`);
  }

  if (query.kind === 'VALID_RANK_STATEMENT') {
    transitiveConclusionCount += 1;
    assert(!isDirectClue(question.displayedEvidence.clues, question.answerKey), `Conclusion answer is copied from a clue at ${question.prototypeId}:${question.seed}`);
    assert(question.visibleExplanation.lines.some((line) => /directly from one clue or indirectly/i.test(line)), `Correct conclusion pedagogy missing at ${question.prototypeId}:${question.seed}`);
    const order = reconstructUniqueOrder(question.displayedEvidence.entities, question.displayedEvidence.clues);
    const positions = new Map(order.map((entity, index) => [entity, index]));
    const trueCandidates = query.candidates.filter((candidate) => positions.get(candidate.higher)! < positions.get(candidate.lower)!);
    assert(trueCandidates.length === 1, `Conclusion options are not single-answer safe at ${question.prototypeId}:${question.seed}`);
  }

  if (query.kind === 'COMPLETE_ORDER') {
    for (const option of question.options) {
      if (option.answerKey === question.answerKey) continue;
      assert(wrongOrderViolatesClue(option.answerKey, question.displayedEvidence.clues), `Complete-order distractor has no clue violation at ${question.prototypeId}:${question.seed}`);
    }
    assert(question.visibleExplanation.optionAnalysis?.length === 3, `Complete-order explanation should analyse three wrong options at ${question.prototypeId}:${question.seed}`);
  }

  if (query.kind === 'MISSING_COMPARISON') {
    sufficiencyCount += 1;
    const baseCount = countTopologicalOrders(question.displayedEvidence.entities, question.displayedEvidence.clues);
    assert(baseCount > 1, `Sufficiency base is already unique at ${question.prototypeId}:${question.seed}`);
    assert(question.reviewMetadata.validatorBaseOrderCount === baseCount, `Validator count metadata mismatch at ${question.prototypeId}:${question.seed}`);
    assert(!/\b\d+ complete orders\b/i.test(JSON.stringify(question.visibleExplanation)), `Validator permutation counts leaked into student explanation at ${question.prototypeId}:${question.seed}`);
    assert(question.visibleExplanation.lines[0].startsWith('Fixed blocks:'), `Block explanation does not begin with fixed blocks at ${question.prototypeId}:${question.seed}`);
    assert(question.visibleExplanation.lines.length === 3, `Block explanation should have three decisive lines at ${question.prototypeId}:${question.seed}`);
    const optionCounts = query.candidates.map((candidate) => countTopologicalOrders(question.displayedEvidence.entities, [...question.displayedEvidence.clues, candidate]));
    assert(optionCounts.filter((count) => count === 1).length === 1, `Sufficiency options are not single-answer safe at ${question.prototypeId}:${question.seed}`);
  }
}

assert(stableIds.size === runtime.length, 'Stable IDs are not unique');
assert(difficulties.size === 3, 'Easy, Medium and Hard must all be reachable');
assert(explanationModes.size === 7, 'All seven adaptive explanation modes must be reachable');
assert(indirectPairCount === seedsPerPrototype, 'Unexpected pair runtime count');
assert(immediateNeighbourCount === seedsPerPrototype, 'Unexpected neighbour runtime count');
assert(transitiveConclusionCount === seedsPerPrototype, 'Unexpected conclusion runtime count');
assert(sufficiencyCount === seedsPerPrototype, 'Unexpected sufficiency runtime count');

const reviewPack = buildRnkCp004ReviewPack();
assert(reviewPack.length === 60, 'Expected 60 V2 review questions');
assert(new Set(reviewPack.map((question) => question.seed)).size === 60, 'Review seeds are reused across prototypes');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.stableQuestionId)).size === 60, 'Review stable IDs are duplicated');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.normalizedSemanticFingerprint)).size === 60, 'Normalized semantic duplicate remains in review pack');

const correctIndexCounts = [0, 0, 0, 0];
for (const question of reviewPack) {
  correctIndexCounts[question.correctIndex] += 1;
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Review correct option moved incorrectly at ${question.reviewMetadata.stableQuestionId}`);
}
assert(correctIndexCounts.every((count) => count === 15), `Review answer positions are not balanced: ${correctIndexCounts.join(',')}`);

const answerSequence = reviewPack.map((question) => question.correctIndex);
const fourGrams = new Set<string>();
for (let index = 0; index <= answerSequence.length - 4; index += 1) {
  const key = answerSequence.slice(index, index + 4).join('');
  assert(!fourGrams.has(key), `Repeated four-answer sequence detected: ${key}`);
  fourGrams.add(key);
}

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdown(reviewPack);
for (const forbidden of ['**Mental picture:**', '**Key rule:**', '**Step-by-step solution:**', '**Exam-speed shortcut:**', '**Option analysis:**']) {
  assert(!markdown.includes(forbidden), `Forced visible section remains: ${forbidden}`);
}
assert(markdown.includes('**Explanation mode:**'), 'Adaptive explanation metadata is absent');
assert(markdown.includes('English Remodel V2'), 'V2 review title is absent');

const visibleWords = reviewPack.reduce((total, question) =>
  total + question.visibleExplanation.lines.join(' ').split(/\s+/).filter(Boolean).length
    + (question.visibleExplanation.optionAnalysis?.join(' ').split(/\s+/).filter(Boolean).length ?? 0), 0);
const averageVisibleExplanationWords = visibleWords / reviewPack.length;
assert(averageVisibleExplanationWords < 90, `Visible explanations remain too long: ${averageVisibleExplanationWords.toFixed(1)} words`);

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_REMODEL_V2_REVIEW_PENDING',
  generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V2',
  sourceReview: 'RNK-CP004-REMODEL-V1-CRITICAL-REVIEW.md',
  runtimeQuestionCount: runtime.length,
  reviewQuestionCount: reviewPack.length,
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-027',
  adaptiveExplanationModes: [...explanationModes].sort(),
  averageVisibleExplanationWords: Number(averageVisibleExplanationWords.toFixed(2)),
  answerPositionCounts: correctIndexCounts,
  repeatedFourAnswerSequences: 0,
  uniqueReviewSeeds: 60,
  normalizedSemanticDuplicates: 0,
  pairDeadDistractors: 0,
  selfNeighbourDistractors: 0,
  conclusionRuleCorrected: 'PASS',
  studentPermutationCountsExposed: 0,
  clueRedundancyBudgets: 'PASS',
  featureDerivedDifficulty: 'PASS',
  difficultyCoverage: [...difficulties].sort(),
  lifecycle: {
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-v2-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack-v2.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(
  join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled-V2.md'),
  markdown,
  'utf8',
);
console.log(JSON.stringify(report, null, 2));
