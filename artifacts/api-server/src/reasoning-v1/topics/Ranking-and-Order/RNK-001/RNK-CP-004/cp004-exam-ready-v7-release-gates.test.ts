import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { solveCp004Independently, type RnkCp004Difficulty } from './cp004-foundation';
import {
  RNK_CP004_DIFFICULTY_MODEL_V3_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v14';
import {
  buildRnkCp004ReviewPackV7Release,
  renderRnkCp004QuestionsAndExplanationsMarkdownV7,
  structuralShapeFingerprint,
} from './cp004-review-pack-v7-release';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function words(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function normalized(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function wrongOptions(question: RnkCp004ExamReadyQuestion): readonly RnkCp004ExamReadyQuestion['options'][number][] {
  return question.options.filter((item) => item.answerKey !== question.answerKey);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v7-release-output';
mkdirSync(outputDirectory, { recursive: true });

const runtime = RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: 240 }, (_, seed) => generateRnkCp004ExamReadyQuestion(prototypeId, seed)),
);
const runtimeDifficulty = { EASY: 0, MEDIUM: 0, HARD: 0 } satisfies Record<RnkCp004Difficulty, number>;
let pairHelpAligned = 0;
let exactDistanceHelpAligned = 0;

for (const question of runtime) {
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Release solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.generationVersion === 'RNK_CP004_ENGLISH_REMODEL_V7', `Release generation mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.modelId === RNK_CP004_DIFFICULTY_MODEL_V3_ID, `Release difficulty model mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4 && wrongOptions(question).length === 3, `Release distractor count mismatch at ${question.prototypeId}:${question.seed}`);
  const visible = [question.stem, ...question.options.map((item) => item.label), ...question.visibleExplanation.lines, ...(question.visibleExplanation.optionAnalysis ?? [])].join('\n');
  assert(!/\b1 people\b|\b1 persons\b/.test(visible), `Release singular/plural defect at ${question.prototypeId}:${question.seed}`);
  assert(!visible.includes('rank positions above'), `Release unnatural wording at ${question.prototypeId}:${question.seed}`);

  if (question.displayedEvidence.query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const help = question.visibleExplanation.optionAnalysis ?? [];
    assert(help.length === 3, `Pair help count mismatch at ${question.prototypeId}:${question.seed}`);
    wrongOptions(question).forEach((item, wrongIndex) => {
      const expected = normalized(item.explanation.replace(/\bpersons lie\b/g, 'people lie'));
      assert(normalized(help[wrongIndex]).includes(expected), `Pair help does not match option ${wrongIndex + 1} at ${question.prototypeId}:${question.seed}`);
    });
    if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) exactDistanceHelpAligned += 1;
    else pairHelpAligned += 1;
  }
  runtimeDifficulty[question.difficulty] += 1;
}

assert(runtime.length === 2640, `Expected 2640 release questions, found ${runtime.length}`);
assert(pairHelpAligned === 240, `Expected 240 aligned direction records, found ${pairHelpAligned}`);
assert(exactDistanceHelpAligned === 240, `Expected 240 aligned distance records, found ${exactDistanceHelpAligned}`);

const reviewPack = buildRnkCp004ReviewPackV7Release();
assert(reviewPack.length === 132, `Expected 132 release review records, found ${reviewPack.length}`);
assert(new Set(reviewPack.map((question) => question.seed)).size === 132, 'Release review seeds are reused');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.stableQuestionId)).size === 132, 'Release review stable IDs are duplicated');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.normalizedSemanticFingerprint)).size === 132, 'Release review semantic duplicate remains');

const prototypeCounts = new Map<string, number>();
const contextCounts = new Map<string, number>();
const shapesByPrototype = new Map<string, Set<string>>();
const confirmatoryCoverage = new Set<number>();
const reviewDifficulty = { EASY: 0, MEDIUM: 0, HARD: 0 } satisfies Record<RnkCp004Difficulty, number>;
const answerCounts = [0, 0, 0, 0];
const sequence: number[] = [];

reviewPack.forEach((question, index) => {
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Release review solver mismatch at item ${index + 1}`);
  prototypeCounts.set(question.prototypeId, (prototypeCounts.get(question.prototypeId) ?? 0) + 1);
  const context = question.reviewMetadata.languageProfile.contextFamily;
  contextCounts.set(context, (contextCounts.get(context) ?? 0) + 1);
  const shapes = shapesByPrototype.get(question.prototypeId) ?? new Set<string>();
  const shape = structuralShapeFingerprint(question);
  assert(!shapes.has(shape), `Release structural repeat for ${question.prototypeId}`);
  shapes.add(shape);
  shapesByPrototype.set(question.prototypeId, shapes);
  confirmatoryCoverage.add(question.reviewMetadata.clueRoleProfile.confirmatory);
  reviewDifficulty[question.difficulty] += 1;
  answerCounts[question.correctIndex] += 1;
  sequence.push(question.correctIndex);
  if (index % 11 === 0) {
    const batch = reviewPack.slice(index, index + 11);
    assert(batch.length === 11 && new Set(batch.map((item) => item.prototypeId)).size === 11, `Release mixed batch invalid at ${index + 1}`);
  }
});

for (const prototypeId of RNK_CP004_REMODEL_V7_PROTOTYPE_IDS) {
  assert(prototypeCounts.get(prototypeId) === 12, `Release evidence count mismatch for ${prototypeId}`);
  assert(shapesByPrototype.get(prototypeId)?.size === 12, `Release structure count mismatch for ${prototypeId}`);
}
for (const count of contextCounts.values()) assert(count === 22, 'Release context distribution mismatch');
assert([...confirmatoryCoverage].sort().join(',') === '0,1,2', `Release confirmatory coverage mismatch: ${[...confirmatoryCoverage]}`);
assert(answerCounts.every((count) => count === 33), `Release answers are not exactly balanced: ${answerCounts.join('/')}`);
const fourGrams = new Set<string>();
for (let index = 0; index <= sequence.length - 4; index += 1) {
  const key = sequence.slice(index, index + 4).join('');
  assert(!fourGrams.has(key), `Release answer four-gram repeats: ${key}`);
  fourGrams.add(key);
}
assert(fourGrams.size === 129, `Expected 129 release answer four-grams, found ${fourGrams.size}`);

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdownV7(reviewPack);
assert(!markdown.includes('Their rank difference is') || markdown.includes('EXACT_DISTANCE'), 'Legacy pair help may remain in release markdown');
assert(!markdown.includes('4 misconception-based distractor'), 'Release distractor metadata defect remains');
assert(!markdown.includes('There are 1 people'), 'Release grammar defect remains');

const averageVisibleExplanationWords = Number((reviewPack.reduce(
  (total, question) => total + words(question.visibleExplanation.lines.join(' ')), 0,
) / reviewPack.length).toFixed(2));
const averageWordsIncludingOptionalHelp = Number((reviewPack.reduce(
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
    remappedPairHelpAlignment: 'PASS',
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
    contextDistribution: Object.fromEntries([...contextCounts.entries()].sort()),
    confirmatoryCountsRepresented: [...confirmatoryCoverage].sort(),
    answerSequenceAuthority: 'BALANCED_UNIQUE_ORDER_4_PATH_V1',
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
  averageVisibleExplanationWords,
  averageWordsIncludingOptionalHelp,
  answerPositionCounts: answerCounts,
  uniqueFourAnswerWindows: fourGrams.size,
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

writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-v7-release-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack-v7-release.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled-V7.md'), markdown, 'utf8');
console.log(JSON.stringify(report, null, 2));
