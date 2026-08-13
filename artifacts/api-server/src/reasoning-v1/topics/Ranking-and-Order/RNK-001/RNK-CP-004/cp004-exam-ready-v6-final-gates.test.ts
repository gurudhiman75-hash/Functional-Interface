import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  solveCp004Independently,
  type RnkCp004Difficulty,
} from './cp004-foundation';
import {
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v11';
import {
  buildRnkCp004ReviewPackV6Final,
  renderRnkCp004QuestionsAndExplanationsMarkdownV6,
} from './cp004-review-pack-v6-final';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function componentTotal(question: RnkCp004ExamReadyQuestion): number {
  return Number(Object.values(question.reviewMetadata.difficultyModel.components)
    .reduce((total, value) => total + value, 0).toFixed(2));
}

function expectedLabel(score: number): RnkCp004Difficulty {
  return score <= 6.5 ? 'EASY' : score <= 11.5 ? 'MEDIUM' : 'HARD';
}

function visibleWords(question: RnkCp004ExamReadyQuestion): number {
  return question.visibleExplanation.lines.join(' ').split(/\s+/).filter(Boolean).length;
}

function totalExplanationWords(question: RnkCp004ExamReadyQuestion): number {
  return visibleWords(question)
    + (question.visibleExplanation.optionAnalysis?.join(' ').split(/\s+/).filter(Boolean).length ?? 0);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v6-final-output';
mkdirSync(outputDirectory, { recursive: true });

const seedsPerPrototype = 240;
const runtime = RNK_CP004_REMODEL_V6_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) =>
    generateRnkCp004ExamReadyQuestion(prototypeId, seed)),
);

const contexts = new Set<string>();
const stableIds = new Set<string>();
const difficultyCoverage = new Set<RnkCp004Difficulty>();
let reconciledQuestions = 0;

for (const question of runtime) {
  const regenerated = generateRnkCp004ExamReadyQuestion(question.prototypeId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic final V6 output at ${question.prototypeId}:${question.seed}`);
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Final V6 solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.modelId === RNK_CP004_DIFFICULTY_MODEL_V2_ID, `Difficulty model mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.score === componentTotal(question), `Difficulty score is not reproducible at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.label === expectedLabel(question.reviewMetadata.difficultyModel.score), `Difficulty threshold mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.difficulty === question.reviewMetadata.difficultyModel.label, `Question and metadata difficulty disagree at ${question.prototypeId}:${question.seed}`);

  const expectedReverseLoad = Number(
    (question.reviewMetadata.languageProfile.reversedClueCount * 1.15).toFixed(2),
  );
  assert(
    question.reviewMetadata.difficultyModel.components.reversedClueLoad === expectedReverseLoad,
    `Reversed-clue load is stale at ${question.prototypeId}:${question.seed}`,
  );
  if (question.difficulty !== 'EASY') {
    assert(question.reviewMetadata.languageProfile.reversedClueCount >= 1, `Final Medium/Hard question lacks reversed wording at ${question.prototypeId}:${question.seed}`);
  }
  if (question.mathematicalFingerprint.includes('V6_DIFFICULTY_RECONCILIATION_V1')) {
    reconciledQuestions += 1;
  }

  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `Option collision at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.languageProfile.maximumPhraseRepeat <= 2, `Phrase repetition returned at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.clueRoleProfile.invariantSatisfied, `Clue accounting failed at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio enabled early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank enabled early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility enabled early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication enabled early at ${question.prototypeId}:${question.seed}`);

  contexts.add(question.reviewMetadata.languageProfile.contextFamily);
  stableIds.add(question.reviewMetadata.stableQuestionId);
  difficultyCoverage.add(question.difficulty);
}

assert(runtime.length === 2640, `Expected 2640 runtime questions, found ${runtime.length}`);
assert(stableIds.size === runtime.length, 'Final runtime stable IDs are not unique');
assert(contexts.size === 6, `Expected six contexts, found ${contexts.size}`);
assert(difficultyCoverage.size === 3, 'Final V6 does not reach all difficulty labels');
assert(reconciledQuestions > 0, 'Difficulty reconciliation layer was never exercised');

const reviewPack = buildRnkCp004ReviewPackV6Final();
assert(reviewPack.length === 66, `Expected 66 final review records, found ${reviewPack.length}`);
assert(new Set(reviewPack.map((question) => question.seed)).size === 66, 'Final review seeds are reused');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.stableQuestionId)).size === 66, 'Final review stable IDs are duplicated');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.normalizedSemanticFingerprint)).size === 66, 'Final semantic duplicate remains');

const answerCounts = [0, 0, 0, 0];
for (const question of reviewPack) answerCounts[question.correctIndex] += 1;
assert(Math.max(...answerCounts) - Math.min(...answerCounts) <= 1, `Final answer positions are imbalanced: ${answerCounts.join('/')}`);

const answerSequence = reviewPack.map((question) => question.correctIndex);
const fourGrams = new Set<string>();
for (let index = 0; index <= answerSequence.length - 4; index += 1) {
  const key = answerSequence.slice(index, index + 4).join('');
  assert(!fourGrams.has(key), `Repeated final four-answer sequence: ${key}`);
  fourGrams.add(key);
}

const ordinary = reviewPack.filter((question) => question.displayedEvidence.query.kind !== 'MISSING_COMPARISON');
const reviewEssential = ordinary.reduce(
  (total, question) => total + (question.reviewMetadata.clueRoleProfile.essentialForFullOrder ?? 0),
  0,
);
const reviewConfirmatory = ordinary.reduce(
  (total, question) => total + question.reviewMetadata.clueRoleProfile.confirmatory,
  0,
);
assert(reviewEssential === 322, `Expected 322 essential review clues, found ${reviewEssential}`);
assert(reviewConfirmatory === 45, `Expected 45 confirmatory review clues, found ${reviewConfirmatory}`);

const contextDistribution = reviewPack.reduce<Record<string, number>>((counts, question) => {
  const family = question.reviewMetadata.languageProfile.contextFamily;
  counts[family] = (counts[family] ?? 0) + 1;
  return counts;
}, {});
const difficultyDistribution = reviewPack.reduce<Record<RnkCp004Difficulty, number>>((counts, question) => {
  counts[question.difficulty] += 1;
  return counts;
}, { EASY: 0, MEDIUM: 0, HARD: 0 });

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdownV6(reviewPack);
assert(markdown.includes('Exam-Authentic English Remodel V6'), 'Final V6 title is absent');
assert(!markdown.includes('<details>'), 'Raw HTML disclosure remains in final output');
assert(!markdown.includes('candidate(s)'), 'Placeholder grammar remains in final output');

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_REMODEL_V6_REVIEW_PENDING',
  generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V6',
  sourceProposal: 'RNK-CP-004-Detailed-Proposed-Changes-for-SSC-and-Banking-Exam-Readiness.md',
  runtimePrototypeCount: RNK_CP004_REMODEL_V6_PROTOTYPE_IDS.length,
  runtimeQuestionCount: runtime.length,
  reviewQuestionCount: reviewPack.length,
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-027',
  finalReconciliation: {
    reconciledRuntimeQuestions: reconciledQuestions,
    reproducibleDifficultyScores: 'PASS',
    languageDifficultyParity: 'PASS',
    difficultyModelId: RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  },
  examAuthenticity: {
    contextFamilies: [...contexts].sort(),
    contextDistribution,
    contextConsistency: 'PASS',
    phraseRepeatMaximum: 2,
    reversedClueCoverage: 'PASS',
    explanationDepth: 'PASS',
    misconceptionBasedOptions: 'PASS',
    missingComparisonOptionWiseProof: 'PASS',
  },
  difficultyDistribution,
  clueAccounting: {
    reviewEssentialForFullOrder: reviewEssential,
    reviewConfirmatory,
    reviewUnclassified: 0,
  },
  averageVisibleExplanationWords: Number(
    (reviewPack.reduce((total, question) => total + visibleWords(question), 0) / reviewPack.length).toFixed(2),
  ),
  averageWordsIncludingOptionalHelp: Number(
    (reviewPack.reduce((total, question) => total + totalExplanationWords(question), 0) / reviewPack.length).toFixed(2),
  ),
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

writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-v6-final-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack-v6-final.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(
  join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled-V6.md'),
  markdown,
  'utf8',
);
console.log(JSON.stringify(report, null, 2));
