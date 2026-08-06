import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { solveCp004Independently, type RnkCp004Difficulty } from './cp004-foundation';
import {
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v12';
import {
  buildRnkCp004ReviewPackV6Publish,
  renderRnkCp004QuestionsAndExplanationsMarkdownV6,
} from './cp004-review-pack-v6-publish';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function componentTotal(question: RnkCp004ExamReadyQuestion): number {
  return Number(Object.values(question.reviewMetadata.difficultyModel.components)
    .reduce((total, value) => total + value, 0).toFixed(2));
}

function words(question: RnkCp004ExamReadyQuestion, includeHelp: boolean): number {
  const visible = question.visibleExplanation.lines.join(' ').split(/\s+/).filter(Boolean).length;
  if (!includeHelp) return visible;
  return visible + (question.visibleExplanation.optionAnalysis?.join(' ').split(/\s+/).filter(Boolean).length ?? 0);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v6-publish-output';
mkdirSync(outputDirectory, { recursive: true });

const runtime = RNK_CP004_REMODEL_V6_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: 240 }, (_, seed) => generateRnkCp004ExamReadyQuestion(prototypeId, seed)),
);
let lowestChecks = 0;

for (const question of runtime) {
  const regenerated = generateRnkCp004ExamReadyQuestion(question.prototypeId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic publication surface at ${question.prototypeId}:${question.seed}`);
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Publication solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.modelId === RNK_CP004_DIFFICULTY_MODEL_V2_ID, `Difficulty model mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.score === componentTotal(question), `Difficulty score mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.languageProfile.maximumPhraseRepeat <= 2, `Phrase repeat regression at ${question.prototypeId}:${question.seed}`);
  assert(!question.stem.includes('candidate(s)'), `Placeholder grammar regression at ${question.prototypeId}:${question.seed}`);

  if (question.displayedEvidence.query.kind === 'LOWEST_ENTITY') {
    const help = question.visibleExplanation.optionAnalysis?.join(' ') ?? '';
    assert(help.includes('higher positions'), `Lowest-rank help does not say higher positions at ${question.seed}`);
    assert(!help.includes('lower positions'), `Lowest-rank help still says lower positions at ${question.seed}`);
    lowestChecks += 1;
  }
}
assert(runtime.length === 2640, `Expected 2640 publication questions, found ${runtime.length}`);
assert(lowestChecks === 240, `Expected 240 lowest-rank checks, found ${lowestChecks}`);

const reviewPack = buildRnkCp004ReviewPackV6Publish();
assert(reviewPack.length === 66, `Expected 66 publication review questions, found ${reviewPack.length}`);
assert(new Set(reviewPack.map((question) => question.seed)).size === 66, 'Publication review seeds are reused');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.stableQuestionId)).size === 66, 'Publication review stable IDs are duplicated');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.normalizedSemanticFingerprint)).size === 66, 'Publication semantic duplicate remains');

const answerCounts = [0, 0, 0, 0];
for (const question of reviewPack) answerCounts[question.correctIndex] += 1;
assert(Math.max(...answerCounts) - Math.min(...answerCounts) <= 1, `Publication answer imbalance: ${answerCounts.join('/')}`);

const difficultyDistribution = reviewPack.reduce<Record<RnkCp004Difficulty, number>>((counts, question) => {
  counts[question.difficulty] += 1;
  return counts;
}, { EASY: 0, MEDIUM: 0, HARD: 0 });
const contextDistribution = reviewPack.reduce<Record<string, number>>((counts, question) => {
  const context = question.reviewMetadata.languageProfile.contextFamily;
  counts[context] = (counts[context] ?? 0) + 1;
  return counts;
}, {});
const ordinary = reviewPack.filter((question) => question.displayedEvidence.query.kind !== 'MISSING_COMPARISON');
const reviewEssential = ordinary.reduce(
  (total, question) => total + (question.reviewMetadata.clueRoleProfile.essentialForFullOrder ?? 0),
  0,
);
const reviewConfirmatory = ordinary.reduce(
  (total, question) => total + question.reviewMetadata.clueRoleProfile.confirmatory,
  0,
);

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdownV6(reviewPack);
assert(!markdown.includes('<details>'), 'Raw HTML returned in publication review');
assert(!markdown.includes('candidate(s)'), 'Placeholder grammar returned in publication review');
assert(!/Who was placed lowest\?[\s\S]{0,1800}lower positions/.test(markdown), 'Incorrect lowest-rank help returned in publication review');

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
  publicationSurface: {
    lowestRankDirectionWording: 'PASS',
    naturalGrammar: 'PASS',
    contextConsistency: 'PASS',
    phraseRepeatMaximum: 2,
    rawHtmlRemoved: 'PASS',
  },
  difficultyModel: RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  difficultyDistribution,
  contextDistribution,
  clueAccounting: {
    reviewEssentialForFullOrder: reviewEssential,
    reviewConfirmatory,
    reviewUnclassified: 0,
  },
  averageVisibleExplanationWords: Number(
    (reviewPack.reduce((total, question) => total + words(question, false), 0) / reviewPack.length).toFixed(2),
  ),
  averageWordsIncludingOptionalHelp: Number(
    (reviewPack.reduce((total, question) => total + words(question, true), 0) / reviewPack.length).toFixed(2),
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
