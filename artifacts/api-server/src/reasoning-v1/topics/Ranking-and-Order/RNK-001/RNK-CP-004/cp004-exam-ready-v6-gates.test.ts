import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  solveCp004Independently,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
} from './cp004-foundation';
import {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v10';
import {
  buildRnkCp004ReviewPackV6,
  renderRnkCp004QuestionsAndExplanationsMarkdownV6,
} from './cp004-review-pack-v6';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function relationKey(clue: RnkCp004Comparison): string {
  return `${clue.higher}>${clue.lower}`;
}

function optionCandidate(answerKey: string): RnkCp004Comparison | null {
  if (!/^[^>:|]+>[^>:|]+$/.test(answerKey)) return null;
  const [higher, lower] = answerKey.split('>');
  return { higher, lower };
}

function visibleWords(question: RnkCp004ExamReadyQuestion): number {
  return question.visibleExplanation.lines.join(' ').split(/\s+/).filter(Boolean).length;
}

function allExplanationWords(question: RnkCp004ExamReadyQuestion): number {
  return visibleWords(question)
    + (question.visibleExplanation.optionAnalysis?.join(' ').split(/\s+/).filter(Boolean).length ?? 0);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v6-output';
mkdirSync(outputDirectory, { recursive: true });

const seedsPerPrototype = 240;
const runtime = RNK_CP004_REMODEL_V6_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) => generateRnkCp004ExamReadyQuestion(prototypeId, seed)),
);

const stableIds = new Set<string>();
const contexts = new Set<string>();
const difficulties = new Set<RnkCp004Difficulty>();
let definitelyTrueChecks = 0;
let missingComparisonChecks = 0;
let relativePairChecks = 0;
let exactDistanceChecks = 0;
let topBottomDistractorChecks = 0;
let languageFailures = 0;

for (const question of runtime) {
  const regenerated = generateRnkCp004ExamReadyQuestion(question.prototypeId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic output at ${question.prototypeId}:${question.seed}`);
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4, `Option count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `Option collision at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.generationVersion === 'RNK_CP004_ENGLISH_REMODEL_V6', `Generation version mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.modelId === RNK_CP004_DIFFICULTY_MODEL_V2_ID, `Difficulty model mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.label === question.difficulty, `Difficulty label mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.reasons.length >= 4, `Difficulty reasons missing at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.languageProfile.mixedContext === false, `Mixed context at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.languageProfile.maximumPhraseRepeat <= 2, `Clue phrase repeated too often at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.languageProfile.clueTemplateIds.length === question.displayedEvidence.clues.length, `Clue template count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.examAuthenticityStatus === 'REVIEW_PENDING', `Exam authenticity status mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.learnerRendererContract.rawHtmlAllowed === false, `Raw HTML enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.learnerRendererContract.adminClueNotesVisibleToLearner === false, `Admin notes exposed to learner at ${question.prototypeId}:${question.seed}`);
  assert(!question.stem.includes('strict highest-to-lowest order'), `Generator-demo introduction remains at ${question.prototypeId}:${question.seed}`);
  assert(!question.stem.includes('A ranking list contains'), `Generic ranking-list introduction remains at ${question.prototypeId}:${question.seed}`);
  assert(!question.stem.includes('candidate(s)'), `Placeholder grammar remains at ${question.prototypeId}:${question.seed}`);
  assert(!question.visibleExplanation.lines.join(' ').includes('confirmatory'), `Admin proof terminology leaked at ${question.prototypeId}:${question.seed}`);
  assert((question.visibleExplanation.optionAnalysis?.length ?? 0) > 0, `Optional learner help missing at ${question.prototypeId}:${question.seed}`);
  assert(question.permanentQlId === null, `Permanent QL allocated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication activated early at ${question.prototypeId}:${question.seed}`);

  if (question.difficulty !== 'EASY' && question.displayedEvidence.clues.length > 0) {
    assert(question.reviewMetadata.languageProfile.reversedClueCount >= 1, `Medium/Hard question lacks reversed wording at ${question.prototypeId}:${question.seed}`);
  }

  stableIds.add(question.reviewMetadata.stableQuestionId);
  contexts.add(question.reviewMetadata.languageProfile.contextFamily);
  difficulties.add(question.difficulty);

  const query = question.displayedEvidence.query;
  if (query.kind === 'MIDDLE_ENTITY') {
    assert(question.displayedEvidence.entities.length % 2 === 1, `Even-sized middle question at ${question.seed}`);
    assert(question.visibleExplanation.lines.some((line) => /middle position is/.test(line)), `Middle formula missing at ${question.seed}`);
  }

  if (query.kind === 'RANK_OF_NAMED_ENTITY') {
    const hasTopBottomRole = question.reviewMetadata.optionRoleMetadata.some((role) => role.role === 'TOP_BOTTOM_CONVERSION_ERROR');
    if (hasTopBottomRole) topBottomDistractorChecks += 1;
    assert(question.visibleExplanation.lines.some((line) => /from the bottom/.test(line)), `Top-bottom distinction missing at ${question.seed}`);
  }

  if (query.kind === 'VALID_RANK_STATEMENT') {
    assert(question.reviewMetadata.authorityCandidateId === RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID, `Definitely-true authority not renamed at ${question.seed}`);
    const roles = new Set(question.reviewMetadata.optionRoleMetadata.map((role) => role.role));
    assert(roles.has('CORRECT_DEFINITELY_TRUE_TRANSITIVE'), `Transitive correct role missing at ${question.seed}`);
    assert(roles.has('FALSE_REVERSE_TRANSITIVE'), `Reverse-transitive role missing at ${question.seed}`);
    assert(roles.has('FALSE_CONTRADICTS_DIRECT'), `Direct-contradiction role missing at ${question.seed}`);
    const directKeys = new Set(question.displayedEvidence.clues.map(relationKey));
    assert(!directKeys.has(question.answerKey), `Correct definitely-true relation is directly stated at ${question.seed}`);
    assert(question.stem.includes('definitely true'), `Definitely-true stem missing at ${question.seed}`);
    definitelyTrueChecks += 1;
  }

  if (query.kind === 'MISSING_COMPARISON') {
    assert(countTopologicalOrders(question.displayedEvidence.entities, question.displayedEvidence.clues) > 1, `Missing-comparison base is already unique at ${question.seed}`);
    const correctCandidates = query.candidates.filter((candidate) =>
      countTopologicalOrders(question.displayedEvidence.entities, [...question.displayedEvidence.clues, candidate]) === 1);
    assert(correctCandidates.length === 1 && relationKey(correctCandidates[0]) === question.answerKey, `Missing-comparison authority mismatch at ${question.seed}`);
    for (const option of question.options) {
      if (option.answerKey === question.answerKey) continue;
      const candidate = optionCandidate(option.answerKey);
      assert(candidate, `Malformed missing-comparison option at ${question.seed}`);
      const count = countTopologicalOrders(question.displayedEvidence.entities, [...question.displayedEvidence.clues, candidate]);
      assert(count === 0 || count >= 2, `Wrong missing-comparison option creates one order at ${question.seed}`);
    }
    assert(question.visibleExplanation.optionAnalysis?.length === 3, `Every missing-comparison distractor must be explained at ${question.seed}`);
    missingComparisonChecks += 1;
  }

  if (query.kind === 'RELATIVE_ORDER_OF_PAIR' && question.prototypeId !== RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const roles = new Set(question.reviewMetadata.optionRoleMetadata.map((role) => role.role));
    assert(roles.has('REVERSE_DIRECTION'), `Pair reverse distractor missing at ${question.seed}`);
    assert(roles.has('CORRECT_DIRECTION_WRONG_GAP'), `Pair wrong-gap distractor missing at ${question.seed}`);
    assert(roles.has('WRONG_DIRECTION_PLAUSIBLE_GAP'), `Pair plausible wrong-direction distractor missing at ${question.seed}`);
    assert(question.reviewMetadata.explanationDepth === 'DIRECT', `Pair explanation is not direct at ${question.seed}`);
    relativePairChecks += 1;
  }

  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const roles = new Set(question.reviewMetadata.optionRoleMetadata.map((role) => role.role));
    assert(roles.has('NUMBER_BETWEEN_CONFUSION'), `Persons-between distractor missing at ${question.seed}`);
    assert(roles.has('INCLUSIVE_COUNT_CONFUSION'), `Inclusive-count distractor missing at ${question.seed}`);
    assert(roles.has('REVERSE_DIRECTION'), `Distance reverse distractor missing at ${question.seed}`);
    assert(question.visibleExplanation.lines.some((line) => /people between them/.test(line)), `Rank-difference distinction missing at ${question.seed}`);
    exactDistanceChecks += 1;
  }

  if (question.reviewMetadata.languageProfile.maximumPhraseRepeat > 2) languageFailures += 1;
}

assert(stableIds.size === runtime.length, 'Runtime stable IDs are not unique');
assert(contexts.size === 6, `Expected six context families, found ${contexts.size}`);
assert(difficulties.size === 3, 'Easy, Medium and Hard are not all reachable');
assert(definitelyTrueChecks === seedsPerPrototype, 'Definitely-true runtime coverage is incomplete');
assert(missingComparisonChecks === seedsPerPrototype, 'Missing-comparison runtime coverage is incomplete');
assert(relativePairChecks === seedsPerPrototype, 'Relative-pair runtime coverage is incomplete');
assert(exactDistanceChecks === seedsPerPrototype, 'Exact-distance runtime coverage is incomplete');
assert(topBottomDistractorChecks > 0, 'Top-bottom conversion distractors are never generated');
assert(languageFailures === 0, 'Language-profile failures remain');

const reviewPack = buildRnkCp004ReviewPackV6();
assert(reviewPack.length === 66, 'Expected 66 V6 review questions');
assert(new Set(reviewPack.map((question) => question.seed)).size === 66, 'Review seeds are reused');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.stableQuestionId)).size === 66, 'Review stable IDs are duplicated');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.normalizedSemanticFingerprint)).size === 66, 'Review semantic duplicate remains');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.languageProfile.contextFamily)).size === 6, 'Review pack does not represent all six contexts');

const ordinary = reviewPack.filter((question) => question.displayedEvidence.query.kind !== 'MISSING_COMPARISON');
const reviewEssential = ordinary.reduce(
  (total, question) => total + (question.reviewMetadata.clueRoleProfile.essentialForFullOrder ?? 0),
  0,
);
const reviewConfirmatory = ordinary.reduce(
  (total, question) => total + question.reviewMetadata.clueRoleProfile.confirmatory,
  0,
);
assert(reviewEssential === 322, `Expected 322 essential clues, found ${reviewEssential}`);
assert(reviewConfirmatory === 45, `Expected 45 confirmatory clues, found ${reviewConfirmatory}`);
assert(reviewPack.every((question) => question.reviewMetadata.clueRoleProfile.invariantSatisfied), 'Review clue accounting mismatch remains');

const answerCounts = [0, 0, 0, 0];
for (const question of reviewPack) answerCounts[question.correctIndex] += 1;
assert(Math.max(...answerCounts) - Math.min(...answerCounts) <= 1, `Answer positions are imbalanced: ${answerCounts.join('/')}`);
const answerSequence = reviewPack.map((question) => question.correctIndex);
const fourGrams = new Set<string>();
for (let index = 0; index <= answerSequence.length - 4; index += 1) {
  const key = answerSequence.slice(index, index + 4).join('');
  assert(!fourGrams.has(key), `Repeated four-answer sequence: ${key}`);
  fourGrams.add(key);
}

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdownV6(reviewPack);
assert(markdown.includes('Exam-Authentic English Remodel V6'), 'V6 title is absent');
assert(markdown.includes('Difficulty reasons:'), 'Human-readable difficulty reasons are absent');
assert(markdown.includes('Context family:'), 'Context metadata is absent');
assert(markdown.includes('Optional learner help'), 'Optional learner help is absent');
assert(!markdown.includes('<details>'), 'Raw HTML disclosure remains');
assert(!markdown.includes('candidate(s)'), 'Placeholder grammar remains in review output');
assert(!markdown.includes('strict highest-to-lowest order'), 'Generator-demo introduction remains in review output');

const averageVisibleExplanationWords = reviewPack.reduce((total, question) => total + visibleWords(question), 0) / reviewPack.length;
const averageWordsIncludingOptionalHelp = reviewPack.reduce((total, question) => total + allExplanationWords(question), 0) / reviewPack.length;
const difficultyDistribution = reviewPack.reduce<Record<RnkCp004Difficulty, number>>((counts, question) => {
  counts[question.difficulty] += 1;
  return counts;
}, { EASY: 0, MEDIUM: 0, HARD: 0 });
const contextDistribution = reviewPack.reduce<Record<string, number>>((counts, question) => {
  const family = question.reviewMetadata.languageProfile.contextFamily;
  counts[family] = (counts[family] ?? 0) + 1;
  return counts;
}, {});

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
  examAuthenticity: {
    contextFamilies: [...contexts].sort(),
    contextDistribution,
    cluePhraseRepeatGate: 'PASS',
    contextConsistencyGate: 'PASS',
    reversedClueGate: 'PASS',
    explanationDepthGate: 'PASS',
  },
  prototypeRemodels: {
    definitelyTrueRelation: 'PASS',
    missingComparisonOptionWiseProof: 'PASS',
    relativePairCompetitiveOptions: 'PASS',
    exactDistanceMisconceptionPool: 'PASS',
    namedRankTopBottomDistractor: 'PASS',
  },
  difficulty: {
    modelId: RNK_CP004_DIFFICULTY_MODEL_V2_ID,
    humanReadableReasons: 'PASS',
    distribution: difficultyDistribution,
  },
  clueAccounting: {
    reviewEssentialForFullOrder: reviewEssential,
    reviewConfirmatory,
    reviewUnclassified: 0,
  },
  averageVisibleExplanationWords: Number(averageVisibleExplanationWords.toFixed(2)),
  averageWordsIncludingOptionalHelp: Number(averageWordsIncludingOptionalHelp.toFixed(2)),
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

writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-v6-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack-v6.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(
  join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled-V6.md'),
  markdown,
  'utf8',
);
console.log(JSON.stringify(report, null, 2));
