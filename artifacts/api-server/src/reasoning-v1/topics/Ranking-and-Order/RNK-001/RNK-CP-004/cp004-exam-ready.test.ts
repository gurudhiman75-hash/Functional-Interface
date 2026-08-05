import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  reconstructUniqueOrder,
  solveCp004Independently,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
} from './cp004-foundation';
import {
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V3_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004RemodelV3ExplanationMode,
} from './cp004-exam-ready-v5';
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

function visibleWordCount(question: ReturnType<typeof generateRnkCp004ExamReadyQuestion>): number {
  return question.visibleExplanation.lines.join(' ').split(/\s+/).filter(Boolean).length
    + (question.visibleExplanation.optionAnalysis?.join(' ').split(/\s+/).filter(Boolean).length ?? 0);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v3-output';
mkdirSync(outputDirectory, { recursive: true });

const seedsPerPrototype = 240;
const runtime = RNK_CP004_REMODEL_V3_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) =>
    generateRnkCp004ExamReadyQuestion(prototypeId, seed),
  ),
);

const determinismSeeds = [0, 1, 7, 31, 97, 239] as const;
for (const prototypeId of RNK_CP004_REMODEL_V3_PROTOTYPE_IDS) {
  for (const seed of determinismSeeds) {
    const first = generateRnkCp004ExamReadyQuestion(prototypeId, seed);
    const second = generateRnkCp004ExamReadyQuestion(prototypeId, seed);
    assert(JSON.stringify(first) === JSON.stringify(second), `Non-deterministic V3 output at ${prototypeId}:${seed}`);
  }
}

const difficulties = new Set<RnkCp004Difficulty>();
const explanationModes = new Set<RnkCp004RemodelV3ExplanationMode>();
const stableIds = new Set<string>();
let directionPairCount = 0;
let exactDistanceCount = 0;
let neighbourCount = 0;
let conclusionCount = 0;
let missingCount = 0;
let nonAdjacentRuntimeQuestions = 0;

for (const question of runtime) {
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Independent solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4, `Expected four options at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `Option collision at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].label === question.answer, `Answer text mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.filter((option) => option.misconceptionId === 'CORRECT').length === 1, `Expected one correct option at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.generationVersion === 'RNK_CP004_ENGLISH_REMODEL_V3', `Wrong generation version at ${question.prototypeId}:${question.seed}`);
  assert(question.visibleExplanation.mode === question.reviewMetadata.explanationMode, `Explanation-mode mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.proofMetrics.fullOrderProofClues === null || question.reviewMetadata.proofMetrics.fullOrderProofClues! > 0, `Invalid full-order proof metadata at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.topologyProfile.adjacentClueCount + question.reviewMetadata.topologyProfile.nonAdjacentClueCount === question.displayedEvidence.clues.length, `Topology count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(!/shortest proof/i.test(question.stem), `Internal proof terminology leaked into stem at ${question.prototypeId}:${question.seed}`);
  assert(!/joins the blocks/i.test(question.stem), `Block-solving method leaked into stem at ${question.prototypeId}:${question.seed}`);
  assert(!/\b\d+ complete orders\b/i.test(JSON.stringify(question.visibleExplanation)), `Permutation count leaked into learner explanation at ${question.prototypeId}:${question.seed}`);
  assert(visibleWordCount(question) >= 20, `Learner explanation is too bare at ${question.prototypeId}:${question.seed}`);
  assert(question.permanentQlId === null, `Permanent QL allocated before approval at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.reviewStatus === 'UNREVIEWED', `Lifecycle activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication activated early at ${question.prototypeId}:${question.seed}`);

  stableIds.add(question.reviewMetadata.stableQuestionId);
  difficulties.add(question.difficulty);
  explanationModes.add(question.visibleExplanation.mode);
  if (question.reviewMetadata.topologyProfile.nonAdjacentClueCount > 0) nonAdjacentRuntimeQuestions += 1;

  const query = question.displayedEvidence.query;
  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    exactDistanceCount += 1;
    assert(query.kind === 'RELATIVE_ORDER_OF_PAIR', `Exact-distance authority lost pair query at seed ${question.seed}`);
    assert(question.reviewMetadata.competency.includes('exact rank difference'), `Exact-distance competency mismatch at seed ${question.seed}`);
    assert(question.visibleExplanation.mode === 'PAIR_DISTANCE', `Exact-distance renderer mismatch at seed ${question.seed}`);
    assert(question.reviewMetadata.proofMetrics.shortestExactPositionProofClues !== null, `Exact-distance proof metadata missing at seed ${question.seed}`);
    assert(question.reviewMetadata.proofMetrics.fullOrderProofClues !== null, `Exact-distance full-order proof missing at seed ${question.seed}`);
    assert(question.reviewMetadata.proofMetrics.shortestExactPositionProofClues! <= question.reviewMetadata.proofMetrics.fullOrderProofClues!, `Exact-distance minimum proof exceeds full-order proof at seed ${question.seed}`);
    assert(question.visibleExplanation.lines.some((line) => /After arranging all candidates/.test(line)), `Exact-distance explanation omits full-order basis at seed ${question.seed}`);
    assert(question.visibleExplanation.lines.some((line) => /−/.test(line)), `Exact-distance explanation omits rank subtraction at seed ${question.seed}`);
    assert(question.options.every((option) => /rank difference/.test(option.label)), `Exact-distance option ontology mismatch at seed ${question.seed}`);
  } else if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    directionPairCount += 1;
    assert(question.reviewMetadata.competency === 'Infer which of two named entities ranks higher', `Direction-pair competency drift at seed ${question.seed}`);
    assert(question.visibleExplanation.mode === 'PAIR_DIRECTION', `Direction-pair renderer mismatch at seed ${question.seed}`);
    assert(question.reviewMetadata.proofMetrics.shortestDirectionalPathClues !== null, `Direction proof metadata missing at seed ${question.seed}`);
    assert(question.reviewMetadata.proofMetrics.shortestExactPositionProofClues === null, `Direction-only task incorrectly claims exact-position proof at seed ${question.seed}`);
    assert(!isDirectClue(question.displayedEvidence.clues, question.answerKey), `Direction-pair answer is copied from one clue at seed ${question.seed}`);
    assert(question.options.every((option) => !/rank difference|positions above|positions below/i.test(option.label)), `Exact-distance wording leaked into direction-only authority at seed ${question.seed}`);
  }

  if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    neighbourCount += 1;
    assert(question.options.every((option) => option.answerKey !== query.target), `Target is its own neighbour at ${question.seed}`);
    assert(question.reviewMetadata.proofMetrics.shortestExactPositionProofClues !== null, `Neighbour exact-position proof missing at ${question.seed}`);
    assert(question.reviewMetadata.proofMetrics.shortestExactPositionProofClues! > 1, `A single comparison was incorrectly treated as adjacency proof at ${question.seed}`);
    assert(question.visibleExplanation.lines.some((line) => /After arranging everyone/.test(line)), `Neighbour explanation omits full-order basis at ${question.seed}`);
  }

  if (query.kind === 'VALID_RANK_STATEMENT') {
    conclusionCount += 1;
    assert(!isDirectClue(question.displayedEvidence.clues, question.answerKey), `Conclusion answer is copied from one clue at ${question.seed}`);
    assert(question.visibleExplanation.lines[0].includes('at least two statements'), `Conclusion explanation ignores stem contract at ${question.seed}`);
    assert(question.reviewMetadata.proofMetrics.shortestDirectionalPathClues !== null, `Conclusion path proof missing at ${question.seed}`);
  }

  if (query.kind === 'COMPLETE_ORDER') {
    const wrongOptions = question.options.filter((option) => option.answerKey !== question.answerKey);
    assert(new Set(wrongOptions.map((option) => option.misconceptionId)).size === 3, `Complete-order distractor roles repeat at ${question.seed}`);
    assert(new Set(wrongOptions.map((option) => option.explanation)).size === 3, `Complete-order contradiction targets repeat at ${question.seed}`);
    for (const option of wrongOptions) {
      assert(wrongOrderViolatesClue(option.answerKey, question.displayedEvidence.clues), `Complete-order distractor has no clue violation at ${question.seed}`);
    }
  }

  if (query.kind === 'MISSING_COMPARISON') {
    missingCount += 1;
    assert(question.visibleExplanation.lines[0].startsWith('Block 1:'), `Missing-comparison blocks are not neutrally labelled at ${question.seed}`);
    assert(question.visibleExplanation.lines[1].startsWith('Block 2:'), `Missing-comparison second block is not neutral at ${question.seed}`);
    assert(!/upper|lower/.test(question.visibleExplanation.lines.slice(0, 2).join(' ')), `Solved-state block labels leaked at ${question.seed}`);
    assert(question.visibleExplanation.optionAnalysis?.length === 1, `Repeated missing-comparison bullets were not grouped at ${question.seed}`);
    const optionCounts = query.candidates.map((candidate) =>
      countTopologicalOrders(question.displayedEvidence.entities, [...question.displayedEvidence.clues, candidate]),
    );
    assert(optionCounts.filter((count) => count === 1).length === 1, `Missing-comparison options are not single-answer safe at ${question.seed}`);
    assert(optionCounts.filter((count) => count > 1).length === 3, `Wrong bridge options must remain consistent but insufficient at ${question.seed}`);
    assert(optionCounts.every((count) => count > 0), `Contradictory bridge filler remains at ${question.seed}`);
  }

  if (question.difficulty === 'HARD' && question.reviewMetadata.topologyProfile.family === 'CHAIN_BACKBONE') {
    assert(question.reviewMetadata.reasoningFeatures.taskWeight >= 4, `Pure chain became Hard from length alone at ${question.prototypeId}:${question.seed}`);
  }
}

assert(stableIds.size === runtime.length, 'Runtime stable IDs are not unique');
assert(difficulties.size === 3, 'Easy, Medium and Hard must all be reachable');
assert(explanationModes.size === 8, `Expected eight Remodel V3 explanation modes, found ${explanationModes.size}`);
assert(directionPairCount === seedsPerPrototype, 'Unexpected direction-pair runtime count');
assert(exactDistanceCount === seedsPerPrototype, 'Unexpected exact-distance runtime count');
assert(neighbourCount === seedsPerPrototype, 'Unexpected neighbour runtime count');
assert(conclusionCount === seedsPerPrototype, 'Unexpected conclusion runtime count');
assert(missingCount === seedsPerPrototype, 'Unexpected missing-comparison runtime count');
assert(nonAdjacentRuntimeQuestions > runtime.length * 0.35, 'Non-adjacent verification-link diversity remains too low');

const reviewPack = buildRnkCp004ReviewPack();
assert(reviewPack.length === RNK_CP004_REMODEL_V3_PROTOTYPE_IDS.length * 6, `Expected ${RNK_CP004_REMODEL_V3_PROTOTYPE_IDS.length * 6} Remodel V3 review questions`);
assert(new Set(reviewPack.map((question) => question.seed)).size === reviewPack.length, 'Review seeds are reused');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.stableQuestionId)).size === reviewPack.length, 'Review stable IDs are duplicated');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.normalizedSemanticFingerprint)).size === reviewPack.length, 'Normalized semantic duplicate remains');

const correctIndexCounts = [0, 0, 0, 0];
for (const question of reviewPack) correctIndexCounts[question.correctIndex] += 1;
assert(Math.max(...correctIndexCounts) - Math.min(...correctIndexCounts) <= 1, `Answer positions are not near-balanced: ${correctIndexCounts.join(',')}`);

const answerSequence = reviewPack.map((question) => question.correctIndex);
const fourGrams = new Set<string>();
for (let index = 0; index <= answerSequence.length - 4; index += 1) {
  const key = answerSequence.slice(index, index + 4).join('');
  assert(!fourGrams.has(key), `Repeated four-answer sequence detected: ${key}`);
  fourGrams.add(key);
}

const totalClues = reviewPack.reduce((total, question) => total + question.displayedEvidence.clues.length, 0);
const adjacentClues = reviewPack.reduce((total, question) => total + question.reviewMetadata.topologyProfile.adjacentClueCount, 0);
const adjacentEdgeRatio = adjacentClues / totalClues;
assert(adjacentEdgeRatio <= 0.92, `Review adjacent-edge ratio remains too high: ${(adjacentEdgeRatio * 100).toFixed(1)}%`);
assert(new Set(reviewPack.map((question) => question.reviewMetadata.topologyProfile.family)).size >= 3, 'Review pack lacks topology-family diversity');

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdown(reviewPack);
assert(markdown.includes('English Remodel V3'), 'V3 review title is absent');
assert(markdown.includes('Shortest directional path'), 'Directional proof metadata is absent');
assert(markdown.includes('Shortest exact-position proof'), 'Exact-position proof metadata is absent');
assert(!markdown.includes('Fixed blocks: upper'), 'Solved-state block labels remain');
assert(!markdown.includes('Which additional statement joins the blocks'), 'Instructional block method remains in stem');
for (const forbidden of ['**Mental picture:**', '**Key rule:**', '**Step-by-step solution:**', '**Exam-speed shortcut:**']) {
  assert(!markdown.includes(forbidden), `Forced visible section remains: ${forbidden}`);
}

const averageVisibleExplanationWords = reviewPack.reduce((total, question) => total + visibleWordCount(question), 0) / reviewPack.length;
assert(averageVisibleExplanationWords >= 40, `V3 explanations remain too bare: ${averageVisibleExplanationWords.toFixed(1)} words`);
assert(averageVisibleExplanationWords <= 110, `V3 explanations became cluttered: ${averageVisibleExplanationWords.toFixed(1)} words`);

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_REMODEL_V3_REVIEW_PENDING',
  generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V3',
  sourceReview: 'RNK-CP004-REMODEL-V2-CRITICAL-REVIEW-UPDATED(1).md',
  runtimePrototypeCount: RNK_CP004_REMODEL_V3_PROTOTYPE_IDS.length,
  runtimeQuestionCount: runtime.length,
  reviewQuestionCount: reviewPack.length,
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-027',
  taskOntology: {
    directionOnlyPairAuthority: 'RNK-CP004-PROT-RELATIVE-ORDER-OF-PAIR',
    exactRankDifferenceAuthority: RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  },
  explanationModes: [...explanationModes].sort(),
  averageVisibleExplanationWords: Number(averageVisibleExplanationWords.toFixed(2)),
  proofMetadata: {
    directionalPathSeparatedFromExactPosition: 'PASS',
    neighbourAdjacencyRequiresExactPositionProof: 'PASS',
    fullOrderProofRecorded: 'PASS',
  },
  topology: {
    adjacentEdgeRatio: Number(adjacentEdgeRatio.toFixed(4)),
    nonAdjacentRuntimeQuestions,
    reviewFamilies: [...new Set(reviewPack.map((question) => question.reviewMetadata.topologyProfile.family))].sort(),
  },
  answerPositionCounts: correctIndexCounts,
  repeatedFourAnswerSequences: 0,
  uniqueReviewSeeds: reviewPack.length,
  normalizedSemanticDuplicates: 0,
  completeOrderDistinctContradictions: 'PASS',
  missingComparisonNeutralBlocks: 'PASS',
  missingComparisonWrongOptionsConsistentButInsufficient: 'PASS',
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

writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-v3-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack-v3.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(
  join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled-V3.md'),
  markdown,
  'utf8',
);
console.log(JSON.stringify(report, null, 2));
