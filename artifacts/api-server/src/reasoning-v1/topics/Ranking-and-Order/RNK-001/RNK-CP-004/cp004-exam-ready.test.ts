import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { solveCp004Independently, type RnkCp004Comparison, type RnkCp004Difficulty } from './cp004-foundation';
import {
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V3_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
  type RnkCp004RemodelV3ExplanationMode,
} from './cp004-exam-ready-v5';
import { buildRnkCp004ReviewPack, renderRnkCp004QuestionsAndExplanationsMarkdown } from './cp004-review-pack';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function relationKey(comparison: RnkCp004Comparison): string { return `${comparison.higher}>${comparison.lower}`; }
function isDirectClue(clues: readonly RnkCp004Comparison[], key: string): boolean {
  return clues.some((clue) => relationKey(clue) === key);
}
function wrongOrderViolatesClue(key: string, clues: readonly RnkCp004Comparison[]): boolean {
  const positions = new Map(key.split('|').map((entity, index) => [entity, index]));
  return clues.some((clue) => positions.get(clue.higher)! >= positions.get(clue.lower)!);
}
function visibleWords(question: RnkCp004ExamReadyQuestion): number {
  return question.visibleExplanation.lines.join(' ').split(/\s+/).filter(Boolean).length
    + (question.visibleExplanation.optionAnalysis?.join(' ').split(/\s+/).filter(Boolean).length ?? 0);
}
function minimumVisibleWords(mode: RnkCp004RemodelV3ExplanationMode): number {
  const floors: Partial<Record<RnkCp004RemodelV3ExplanationMode, number>> = {
    PAIR_DIRECTION: 12,
    TRANSITIVE_PROOF: 16,
    NEIGHBOUR_HIGHLIGHT: 20,
    PAIR_DISTANCE: 25,
    POSITION_LINE: 25,
    BLOCK_BRIDGE: 28,
    CHAIN_BUILD: 30,
    OPTION_CONTRADICTION: 35,
  };
  return floors[mode] ?? 12;
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v3-output';
mkdirSync(outputDirectory, { recursive: true });
const seedsPerPrototype = 240;
const runtime = RNK_CP004_REMODEL_V3_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) => generateRnkCp004ExamReadyQuestion(prototypeId, seed)),
);

for (const prototypeId of RNK_CP004_REMODEL_V3_PROTOTYPE_IDS) {
  for (const seed of [0, 1, 7, 31, 97, 239]) {
    const first = generateRnkCp004ExamReadyQuestion(prototypeId, seed);
    const second = generateRnkCp004ExamReadyQuestion(prototypeId, seed);
    assert(JSON.stringify(first) === JSON.stringify(second), `Non-deterministic V3 output at ${prototypeId}:${seed}`);
  }
}

const difficulties = new Set<RnkCp004Difficulty>();
const modes = new Set<RnkCp004RemodelV3ExplanationMode>();
const stableIds = new Set<string>();
let directionPairs = 0;
let distancePairs = 0;
let neighbours = 0;
let conclusions = 0;
let missingComparisons = 0;
let nonAdjacentRuntimeQuestions = 0;

for (const question of runtime) {
  const query = question.displayedEvidence.query;
  const proof = question.reviewMetadata.proofMetrics;
  const topology = question.reviewMetadata.topologyProfile;
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4 && new Set(question.options.map((option) => option.answerKey)).size === 4, `Unsafe options at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].label === question.answer, `Answer text mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.filter((option) => option.misconceptionId === 'CORRECT').length === 1, `Multiple correct options at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.generationVersion === 'RNK_CP004_ENGLISH_REMODEL_V3', `Wrong version at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.explanationMode === question.visibleExplanation.mode, `Mode mismatch at ${question.prototypeId}:${question.seed}`);
  assert(topology.adjacentClueCount + topology.nonAdjacentClueCount === question.displayedEvidence.clues.length, `Topology count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(visibleWords(question) >= minimumVisibleWords(question.visibleExplanation.mode), `Explanation is too bare for ${question.visibleExplanation.mode} at ${question.prototypeId}:${question.seed}`);
  assert(!/joins the blocks/i.test(question.stem), `Solving method leaked into stem at ${question.prototypeId}:${question.seed}`);
  assert(!/\b\d+ complete orders\b/i.test(JSON.stringify(question.visibleExplanation)), `Permutation count leaked at ${question.prototypeId}:${question.seed}`);
  assert(question.permanentQlId === null && question.lifecycle.reviewStatus === 'UNREVIEWED', `Lifecycle advanced early at ${question.prototypeId}:${question.seed}`);
  assert(!question.lifecycle.questionStudioDiscoverable && question.lifecycle.questionBankStatus === 'NOT_STORED', `Storage activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE' && !question.lifecycle.publiclyPublishable, `Release activated early at ${question.prototypeId}:${question.seed}`);
  stableIds.add(question.reviewMetadata.stableQuestionId);
  difficulties.add(question.difficulty);
  modes.add(question.visibleExplanation.mode);
  if (topology.nonAdjacentClueCount > 0) nonAdjacentRuntimeQuestions += 1;

  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    distancePairs += 1;
    assert(query.kind === 'RELATIVE_ORDER_OF_PAIR', `Exact-distance query drift at ${question.seed}`);
    assert(question.reviewMetadata.competency.includes('exact rank difference') && question.visibleExplanation.mode === 'PAIR_DISTANCE', `Exact-distance ontology mismatch at ${question.seed}`);
    assert(proof.shortestExactPositionProofClues !== null && proof.fullOrderProofClues !== null, `Exact-distance proof missing at ${question.seed}`);
    assert(proof.shortestExactPositionProofClues! <= proof.fullOrderProofClues!, `Exact proof exceeds full-order proof at ${question.seed}`);
    assert(question.visibleExplanation.lines.some((line) => /After arranging all candidates/.test(line)) && question.visibleExplanation.lines.some((line) => /−/.test(line)), `Exact-distance teaching incomplete at ${question.seed}`);
    assert(question.options.every((option) => /rank difference/.test(option.label)), `Exact-distance options mismatch at ${question.seed}`);
  } else if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    directionPairs += 1;
    assert(question.reviewMetadata.competency === 'Infer which of two named entities ranks higher' && question.visibleExplanation.mode === 'PAIR_DIRECTION', `Direction ontology drift at ${question.seed}`);
    assert(proof.shortestDirectionalPathClues !== null && proof.shortestExactPositionProofClues === null, `Direction proof metadata unsafe at ${question.seed}`);
    assert(!isDirectClue(question.displayedEvidence.clues, question.answerKey), `Direction answer copied from one clue at ${question.seed}`);
    assert(question.options.every((option) => !/rank difference|positions above|positions below/i.test(option.label)), `Distance wording leaked into direction task at ${question.seed}`);
  }

  if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    neighbours += 1;
    assert(question.options.every((option) => option.answerKey !== query.target), `Target is its own neighbour at ${question.seed}`);
    assert(proof.shortestExactPositionProofClues !== null && proof.shortestExactPositionProofClues > 1, `Direction treated as adjacency proof at ${question.seed}`);
    assert(question.visibleExplanation.lines.some((line) => /After arranging everyone/.test(line)), `Neighbour full-order basis missing at ${question.seed}`);
  }
  if (query.kind === 'VALID_RANK_STATEMENT') {
    conclusions += 1;
    assert(!isDirectClue(question.displayedEvidence.clues, question.answerKey), `Conclusion copied from one clue at ${question.seed}`);
    assert(question.visibleExplanation.lines[0].includes('at least two statements') && proof.shortestDirectionalPathClues !== null, `Conclusion teaching unsafe at ${question.seed}`);
  }
  if (query.kind === 'COMPLETE_ORDER') {
    const wrong = question.options.filter((option) => option.answerKey !== question.answerKey);
    assert(new Set(wrong.map((option) => option.misconceptionId)).size === 3, `Complete-order roles repeat at ${question.seed}`);
    assert(new Set(wrong.map((option) => option.explanation)).size === 3, `Complete-order contradiction targets repeat at ${question.seed}`);
    assert(wrong.every((option) => wrongOrderViolatesClue(option.answerKey, question.displayedEvidence.clues)), `Complete-order distractor lacks clue violation at ${question.seed}`);
  }
  if (query.kind === 'MISSING_COMPARISON') {
    missingComparisons += 1;
    assert(question.visibleExplanation.lines[0].startsWith('Block 1:') && question.visibleExplanation.lines[1].startsWith('Block 2:'), `Blocks are not neutral at ${question.seed}`);
    assert(!/upper|lower/.test(question.visibleExplanation.lines.slice(0, 2).join(' ')), `Solved-state block labels leaked at ${question.seed}`);
    assert(question.visibleExplanation.optionAnalysis?.length === 1, `Bridge failures were not grouped at ${question.seed}`);
    const counts = query.candidates.map((candidate) => countTopologicalOrders(question.displayedEvidence.entities, [...question.displayedEvidence.clues, candidate]));
    assert(counts.filter((count) => count === 1).length === 1 && counts.filter((count) => count > 1).length === 3 && counts.every((count) => count > 0), `Bridge options unsafe at ${question.seed}`);
  }
  if (question.difficulty === 'HARD' && topology.family === 'CHAIN_BACKBONE') {
    assert(question.reviewMetadata.reasoningFeatures.taskWeight >= 4, `Pure chain became Hard from length alone at ${question.prototypeId}:${question.seed}`);
  }
}

assert(stableIds.size === runtime.length, 'Runtime stable IDs are not unique');
assert(difficulties.size === 3, 'Difficulty coverage incomplete');
assert(modes.size === 8, `Expected eight V3 modes, found ${modes.size}`);
assert(directionPairs === seedsPerPrototype && distancePairs === seedsPerPrototype, 'Pair authority runtime counts mismatch');
assert(neighbours === seedsPerPrototype && conclusions === seedsPerPrototype && missingComparisons === seedsPerPrototype, 'Special authority runtime counts mismatch');
assert(nonAdjacentRuntimeQuestions > runtime.length * 0.35, 'Non-adjacent verification diversity remains too low');

const reviewPack = buildRnkCp004ReviewPack();
const expectedReviewCount = RNK_CP004_REMODEL_V3_PROTOTYPE_IDS.length * 6;
assert(reviewPack.length === expectedReviewCount, `Expected ${expectedReviewCount} V3 review questions`);
assert(new Set(reviewPack.map((question) => question.seed)).size === reviewPack.length, 'Review seeds are reused');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.stableQuestionId)).size === reviewPack.length, 'Review stable IDs duplicate');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.normalizedSemanticFingerprint)).size === reviewPack.length, 'Semantic duplicate remains');

const answerCounts = [0, 0, 0, 0];
for (const question of reviewPack) answerCounts[question.correctIndex] += 1;
assert(Math.max(...answerCounts) - Math.min(...answerCounts) <= 1, `Answer positions are not near-balanced: ${answerCounts.join(',')}`);
const answerSequence = reviewPack.map((question) => question.correctIndex);
const fourGrams = new Set<string>();
for (let index = 0; index <= answerSequence.length - 4; index += 1) {
  const key = answerSequence.slice(index, index + 4).join('');
  assert(!fourGrams.has(key), `Repeated four-answer sequence: ${key}`);
  fourGrams.add(key);
}

const totalClues = reviewPack.reduce((sum, question) => sum + question.displayedEvidence.clues.length, 0);
const adjacentClues = reviewPack.reduce((sum, question) => sum + question.reviewMetadata.topologyProfile.adjacentClueCount, 0);
const adjacentEdgeRatio = adjacentClues / totalClues;
assert(adjacentEdgeRatio <= 0.92, `Adjacent-edge ratio remains too high: ${(adjacentEdgeRatio * 100).toFixed(1)}%`);
assert(new Set(reviewPack.map((question) => question.reviewMetadata.topologyProfile.family)).size >= 3, 'Topology-family diversity incomplete');

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdown(reviewPack);
assert(markdown.includes('English Remodel V3') && markdown.includes('Shortest directional path') && markdown.includes('Shortest exact-position proof'), 'V3 proof metadata missing from review document');
assert(!markdown.includes('Fixed blocks: upper') && !markdown.includes('Which additional statement joins the blocks'), 'Old block pedagogy remains');
const averageVisibleExplanationWords = reviewPack.reduce((sum, question) => sum + visibleWords(question), 0) / reviewPack.length;
assert(averageVisibleExplanationWords >= 35 && averageVisibleExplanationWords <= 110, `Average explanation depth is outside range: ${averageVisibleExplanationWords.toFixed(1)}`);

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
  explanationModes: [...modes].sort(),
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
  answerPositionCounts: answerCounts,
  repeatedFourAnswerSequences: 0,
  uniqueReviewSeeds: reviewPack.length,
  normalizedSemanticDuplicates: 0,
  completeOrderDistinctContradictions: 'PASS',
  missingComparisonNeutralBlocks: 'PASS',
  missingComparisonWrongOptionsConsistentButInsufficient: 'PASS',
  featureDerivedDifficulty: 'PASS',
  difficultyCoverage: [...difficulties].sort(),
  lifecycle: {
    questionStudio: 'DISABLED', questionBank: 'NOT_STORED', testEligibility: 'INELIGIBLE',
    publicPublication: false, hindiPunjabi: 'NOT_STARTED',
  },
};
writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-v3-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack-v3.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled-V3.md'), markdown, 'utf8');
console.log(JSON.stringify(report, null, 2));
