import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { solveCp004Independently, type RnkCp004Difficulty } from './cp004-foundation';
import {
  RNK_CP004_DIFFICULTY_MODEL_V3_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v13';
import {
  buildRnkCp004ReviewPackV7Final,
  renderRnkCp004QuestionsAndExplanationsMarkdownV7,
  structuralShapeFingerprint,
} from './cp004-review-pack-v7-final';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function words(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function visibleText(question: RnkCp004ExamReadyQuestion): string {
  return [
    question.stem,
    ...question.options.map((item) => item.label),
    ...question.visibleExplanation.lines,
    ...(question.visibleExplanation.optionAnalysis ?? []),
    question.visibleExplanation.answer,
  ].join('\n');
}

function componentTotal(question: RnkCp004ExamReadyQuestion): number {
  return Number(Object.values(question.reviewMetadata.difficultyModel.components)
    .reduce((total, value) => total + value, 0).toFixed(2));
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v7-final-output';
mkdirSync(outputDirectory, { recursive: true });

const runtime = RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: 240 }, (_, seed) => generateRnkCp004ExamReadyQuestion(prototypeId, seed)),
);
const runtimeDifficulty = { EASY: 0, MEDIUM: 0, HARD: 0 } satisfies Record<RnkCp004Difficulty, number>;
const stemVariants = new Map<string, Set<string>>();
const explanationVariants = new Map<string, Set<string>>();
const runtimeConfirmatory = new Map<number, number>();
let directionQuestions = 0;
let distanceQuestions = 0;
let compactAmbiguityProofs = 0;

for (const question of runtime) {
  const regenerated = generateRnkCp004ExamReadyQuestion(question.prototypeId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic output at ${question.prototypeId}:${question.seed}`);
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4, `Option count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((item) => item.answerKey)).size === 4, `Option collision at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.editorialDiversityProfile.distractorCount === 3, `Distractor count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.optionRoleMetadata.length === 4, `Option-role mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.modelId === RNK_CP004_DIFFICULTY_MODEL_V3_ID, `Difficulty model mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.score === componentTotal(question), `Difficulty score mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.label === question.difficulty, `Difficulty label mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.reasons.includes('3 distractors across 4 options'), `Distractor reason mismatch at ${question.prototypeId}:${question.seed}`);

  const text = visibleText(question);
  assert(!/\b1 people\b/.test(text), `Singular/plural defect at ${question.prototypeId}:${question.seed}`);
  assert(!/\b1 persons\b/.test(text), `Singular/plural defect at ${question.prototypeId}:${question.seed}`);
  assert(!text.includes('rank positions above'), `Unnatural wording at ${question.prototypeId}:${question.seed}`);
  assert(!text.includes('1 places above'), `Singular place defect at ${question.prototypeId}:${question.seed}`);

  const query = question.displayedEvidence.query;
  const editorial = question.reviewMetadata.editorialDiversityProfile;
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR'
    && question.prototypeId !== RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    directionQuestions += 1;
    const roles = new Set(question.reviewMetadata.optionRoleMetadata.map((record) => record.role));
    assert(editorial.optionSemanticMode === 'DIRECTION_ONLY', `Direction semantic drift at ${question.seed}`);
    assert(roles.has('CORRECT') && roles.has('REVERSE_DIRECTION'), `Direction roles incomplete at ${question.seed}`);
    assert(roles.has('SAME_RANK_CONTRADICTION') && roles.has('CANNOT_DETERMINE_CONTRADICTION'), `Direction distractors incomplete at ${question.seed}`);
    assert(question.options.every((item) => !item.answerKey.startsWith('GAP:')), `Mixed gap option remains at ${question.seed}`);
    const shortest = question.reviewMetadata.reasoningFeatures.shortestProofClueCount;
    assert(question.difficulty === (shortest <= 3 ? 'EASY' : 'MEDIUM'), `Pair difficulty ignores shortest proof at ${question.seed}`);
  }
  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    distanceQuestions += 1;
    assert(editorial.optionSemanticMode === 'EXACT_DISTANCE', `Distance semantic drift at ${question.seed}`);
    assert(question.options.every((item) => /\bplace(?:s)? above\b/.test(item.label)), `Distance option is not naturally phrased at ${question.seed}`);
    const feature = question.reviewMetadata.reasoningFeatures;
    const reversed = question.reviewMetadata.languageProfile.reversedClueCount;
    const confirmatory = question.reviewMetadata.clueRoleProfile.confirmatory;
    const expected = feature.entityCount >= 8 && reversed >= 2 && confirmatory > 0 ? 'HARD' : 'MEDIUM';
    assert(question.difficulty === expected, `Distance difficulty overstatement at ${question.seed}`);
  }
  if (query.kind === 'MIDDLE_ENTITY' && question.displayedEvidence.entities.length === 5) {
    assert(question.difficulty === 'EASY', `Five-person middle is not Easy at ${question.seed}`);
  }
  if (query.kind === 'RANK_OF_NAMED_ENTITY' || query.kind === 'IMMEDIATE_NEIGHBOUR') {
    assert(question.difficulty !== 'HARD', `Difficulty inflation remains at ${question.prototypeId}:${question.seed}`);
  }
  if (query.kind === 'VALID_RANK_STATEMENT') {
    assert(question.difficulty === 'MEDIUM', `Definitely-true relation is not Medium at ${question.seed}`);
    assert(question.reviewMetadata.editorialDiversityProfile.distractorCount === question.options.length - 1, `Definitely-true distractor count mismatch at ${question.seed}`);
  }
  if (query.kind === 'MISSING_COMPARISON') {
    for (const line of question.visibleExplanation.optionAnalysis ?? []) {
      assert(line.includes('contradicts') || line.includes('permits'), `Missing-comparison help is not proof-based at ${question.seed}`);
      assert(words(line) <= 35, `Missing-comparison help is too long at ${question.seed}`);
      if (line.includes('permits')) compactAmbiguityProofs += 1;
    }
  }
  if (query.kind === 'HIGHEST_ENTITY' || query.kind === 'LOWEST_ENTITY') {
    assert((question.visibleExplanation.optionAnalysis ?? []).length === 3, `Endpoint help is not option-specific at ${question.seed}`);
    assert((question.visibleExplanation.optionAnalysis ?? []).every((line) => /^Option [A-D]:/.test(line)), `Endpoint help lacks option labels at ${question.seed}`);
  }

  assert(question.reviewMetadata.clueRoleProfile.invariantSatisfied, `Clue accounting failed at ${question.prototypeId}:${question.seed}`);
  assert(!question.lifecycle.questionStudioDiscoverable, `Question Studio enabled early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank enabled early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility enabled early at ${question.prototypeId}:${question.seed}`);
  assert(!question.lifecycle.publiclyPublishable, `Publication enabled early at ${question.prototypeId}:${question.seed}`);

  const stems = stemVariants.get(question.prototypeId) ?? new Set<string>();
  stems.add(editorial.stemVariantId);
  stemVariants.set(question.prototypeId, stems);
  const explanations = explanationVariants.get(question.prototypeId) ?? new Set<string>();
  explanations.add(editorial.explanationVariantId);
  explanationVariants.set(question.prototypeId, explanations);
  runtimeDifficulty[question.difficulty] += 1;
  const confirmatory = question.reviewMetadata.clueRoleProfile.confirmatory;
  runtimeConfirmatory.set(confirmatory, (runtimeConfirmatory.get(confirmatory) ?? 0) + 1);
}

assert(runtime.length === 2640, `Expected 2640 runtime questions, found ${runtime.length}`);
assert(directionQuestions === 240, `Expected 240 direction questions, found ${directionQuestions}`);
assert(distanceQuestions === 240, `Expected 240 distance questions, found ${distanceQuestions}`);
assert(compactAmbiguityProofs > 0, 'Compact ambiguity proof was not exercised');
for (const prototypeId of RNK_CP004_REMODEL_V7_PROTOTYPE_IDS) {
  assert((stemVariants.get(prototypeId)?.size ?? 0) >= 3, `Insufficient stem diversity for ${prototypeId}`);
  assert((explanationVariants.get(prototypeId)?.size ?? 0) >= 3, `Insufficient explanation diversity for ${prototypeId}`);
}

const reviewPack = buildRnkCp004ReviewPackV7Final();
assert(reviewPack.length === 132, `Expected 132 review questions, found ${reviewPack.length}`);
assert(new Set(reviewPack.map((question) => question.seed)).size === 132, 'Review seeds are reused');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.stableQuestionId)).size === 132, 'Review stable IDs are duplicated');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.normalizedSemanticFingerprint)).size === 132, 'Review semantic duplicate remains');

const prototypeCounts = new Map<string, number>();
const contexts = new Map<string, number>();
const contextByPrototype = new Map<string, Map<string, number>>();
const shapesByPrototype = new Map<string, Set<string>>();
const reviewDifficulty = { EASY: 0, MEDIUM: 0, HARD: 0 } satisfies Record<RnkCp004Difficulty, number>;
const answerCounts = [0, 0, 0, 0];
const answerSequence: number[] = [];
const confirmatoryCoverage = new Set<number>();

reviewPack.forEach((question, index) => {
  prototypeCounts.set(question.prototypeId, (prototypeCounts.get(question.prototypeId) ?? 0) + 1);
  const context = question.reviewMetadata.languageProfile.contextFamily;
  contexts.set(context, (contexts.get(context) ?? 0) + 1);
  const localContexts = contextByPrototype.get(question.prototypeId) ?? new Map<string, number>();
  localContexts.set(context, (localContexts.get(context) ?? 0) + 1);
  contextByPrototype.set(question.prototypeId, localContexts);
  const shapes = shapesByPrototype.get(question.prototypeId) ?? new Set<string>();
  const shape = structuralShapeFingerprint(question);
  assert(!shapes.has(shape), `Repeated structural shape for ${question.prototypeId}`);
  shapes.add(shape);
  shapesByPrototype.set(question.prototypeId, shapes);
  reviewDifficulty[question.difficulty] += 1;
  answerCounts[question.correctIndex] += 1;
  answerSequence.push(question.correctIndex);
  confirmatoryCoverage.add(question.reviewMetadata.clueRoleProfile.confirmatory);

  if (index % 11 === 0) {
    const batch = reviewPack.slice(index, index + 11);
    assert(batch.length === 11, `Incomplete mixed batch at item ${index + 1}`);
    assert(new Set(batch.map((item) => item.prototypeId)).size === 11, `Mixed batch repeats an authority at item ${index + 1}`);
  }
});

for (const prototypeId of RNK_CP004_REMODEL_V7_PROTOTYPE_IDS) {
  assert(prototypeCounts.get(prototypeId) === 12, `Expected 12 review records for ${prototypeId}`);
  assert(shapesByPrototype.get(prototypeId)?.size === 12, `Expected 12 structures for ${prototypeId}`);
  const localContexts = contextByPrototype.get(prototypeId);
  assert(localContexts?.size === 6, `Expected six contexts for ${prototypeId}`);
  for (const count of localContexts?.values() ?? []) assert(count === 2, `Context is not represented twice for ${prototypeId}`);
}
for (const count of contexts.values()) assert(count === 22, `Context distribution is not 22 each`);
assert(confirmatoryCoverage.has(0) && confirmatoryCoverage.has(1) && confirmatoryCoverage.has(2), 'Review confirmatory-clue variation is incomplete');
assert(Math.max(...answerCounts) - Math.min(...answerCounts) <= 1, `Answer positions are imbalanced: ${answerCounts.join('/')}`);
const fourGrams = new Set<string>();
for (let index = 0; index <= answerSequence.length - 4; index += 1) {
  const key = answerSequence.slice(index, index + 4).join('');
  assert(!fourGrams.has(key), `Repeated four-answer sequence ${key}`);
  fourGrams.add(key);
}

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdownV7(reviewPack);
assert(markdown.includes('Mixed review batch 12'), 'Mixed review batches are incomplete');
assert(!markdown.includes('There are 1 people'), 'Grammar defect remains in review pack');
assert(!markdown.includes('rank positions above'), 'Unnatural wording remains in review pack');
assert(!markdown.includes('4 misconception-based distractor'), 'Distractor metadata defect remains in review pack');

const averageVisibleWords = Number((reviewPack.reduce(
  (total, question) => total + words(question.visibleExplanation.lines.join(' ')), 0,
) / reviewPack.length).toFixed(2));
const averageAllWords = Number((reviewPack.reduce(
  (total, question) => total + words([...question.visibleExplanation.lines, ...(question.visibleExplanation.optionAnalysis ?? [])].join(' ')), 0,
) / reviewPack.length).toFixed(2));

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_REMODEL_V7_TARGETED_REVIEW_PENDING',
  generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V7',
  sourceReview: 'RNK-CP-004-V6-Critical-SSC-Banking-Review.md',
  runtimePrototypeCount: RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length,
  runtimeQuestionCount: runtime.length,
  reviewQuestionCount: reviewPack.length,
  reviewEvidencePerAuthority: 12,
  mixedReviewBatchCount: 12,
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-027',
  correctedDefects: {
    singularPluralRendering: 'PASS',
    distractorCountInvariant: 'PASS',
    naturalPlacesAboveWording: 'PASS',
    endpointOptionSpecificHelp: 'PASS',
    compactMissingComparisonHelp: 'PASS',
  },
  optionArchitecture: {
    directionOnlyConsistentSemantics: 'PASS',
    exactDistanceSeparateAuthority: 'PASS',
    definitelyTrueThreeDistractors: 'PASS',
  },
  editorialDiversity: {
    minimumStemVariantsPerAuthority: 3,
    minimumExplanationVariantsPerAuthority: 3,
    independentStructuralRecordsPerAuthority: 12,
    mixedAuthorityReviewBatches: 12,
    contextDistribution: Object.fromEntries([...contexts.entries()].sort()),
    confirmatoryCountsRepresented: [...confirmatoryCoverage].sort(),
    answerSequenceAuthority: 'ORDER_4_DE_BRUIJN_BALANCED_PREFIX',
  },
  difficulty: {
    modelId: RNK_CP004_DIFFICULTY_MODEL_V3_ID,
    runtimeDistribution: runtimeDifficulty,
    reviewDistribution: reviewDifficulty,
    shortestProofLedPairCalibration: 'PASS',
    fivePersonMiddleEasy: 'PASS',
    namedRankHardInflationRemoved: 'PASS',
    immediateNeighbourHardInflationRemoved: 'PASS',
    exactDistanceHardGuard: 'PASS',
  },
  averageVisibleExplanationWords: averageVisibleWords,
  averageWordsIncludingOptionalHelp: averageAllWords,
  answerPositionCounts: answerCounts,
  repeatedFourAnswerSequences: 0,
  normalizedSemanticDuplicates: 0,
  lifecycle: {
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-v7-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack-v7.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled-V7.md'), markdown, 'utf8');
console.log(JSON.stringify(report, null, 2));
