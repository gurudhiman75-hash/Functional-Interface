import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  solveCp004Independently,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
} from './cp004-foundation';
import {
  RNK_CP004_DIFFICULTY_MODEL_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V5_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion,
  optionSatisfiesRnkCp004Authority,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v7';
import {
  buildRnkCp004ReviewPack,
  renderRnkCp004QuestionsAndExplanationsMarkdown,
} from './cp004-review-pack';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function relationKey(clue: RnkCp004Comparison): string {
  return `${clue.higher}>${clue.lower}`;
}

function shortestPath(
  clues: readonly RnkCp004Comparison[],
  start: string,
  end: string,
): readonly string[] | null {
  const outgoing = new Map<string, string[]>();
  for (const clue of clues) {
    const values = outgoing.get(clue.higher) ?? [];
    values.push(clue.lower);
    outgoing.set(clue.higher, values);
  }
  const queue: string[][] = [[start]];
  const visited = new Set<string>([start]);
  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    if (current === end) return path;
    for (const next of outgoing.get(current) ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return null;
}

function expectedDifficulty(question: RnkCp004ExamReadyQuestion): RnkCp004Difficulty {
  const score = question.reviewMetadata.difficultyModel.score;
  return score <= 7 ? 'EASY' : score <= 12 ? 'MEDIUM' : 'HARD';
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v5-output';
mkdirSync(outputDirectory, { recursive: true });
const seedsPerPrototype = 240;
const runtime = RNK_CP004_REMODEL_V5_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) =>
    generateRnkCp004ExamReadyQuestion(prototypeId, seed)),
);

const stableIds = new Set<string>();
const difficulties = new Set<RnkCp004Difficulty>();
let transitiveAuthorityChecks = 0;
let directTrueDistractorChecks = 0;
let pairLocalProofChecks = 0;
let missingProofContractChecks = 0;
let adminNoteChecks = 0;
let edgeContractFailures = 0;

for (const question of runtime) {
  const regenerated = generateRnkCp004ExamReadyQuestion(question.prototypeId, question.seed);
  assert(
    JSON.stringify(regenerated) === JSON.stringify(question),
    `Non-deterministic output at ${question.prototypeId}:${question.seed}`,
  );

  const query = question.displayedEvidence.query;
  if (query.kind === 'VALID_RANK_STATEMENT') {
    const authorityMatches = question.options.filter((option) =>
      optionSatisfiesRnkCp004Authority(question, option.answerKey));
    assert(authorityMatches.length === 1, `Conclusion authority is not single-answer at ${question.prototypeId}:${question.seed}`);
    assert(authorityMatches[0].answerKey === question.answerKey, `Conclusion authority selected the wrong option at ${question.prototypeId}:${question.seed}`);
    const roles = question.reviewMetadata.optionRoleMetadata;
    assert(roles.some((role) => role.role === 'CORRECT_MULTI_STATEMENT_CONCLUSION'), `Multi-clue role missing at ${question.prototypeId}:${question.seed}`);
    const directTrue = roles.find((role) => role.role === 'TRUE_DIRECT_SINGLE_CLUE');
    assert(directTrue, `Direct-true distractor missing at ${question.prototypeId}:${question.seed}`);
    assert(
      question.displayedEvidence.clues.some((clue) => relationKey(clue) === directTrue.answerKey),
      `Direct-true distractor is not a displayed clue at ${question.prototypeId}:${question.seed}`,
    );
    assert(
      !optionSatisfiesRnkCp004Authority(question, directTrue.answerKey),
      `Direct-true distractor satisfies multi-clue authority at ${question.prototypeId}:${question.seed}`,
    );
    const [directHigher, directLower] = directTrue.answerKey.split('>');
    const directIndex = question.displayedEvidence.clues.findIndex((clue) => relationKey(clue) === directTrue.answerKey);
    const remaining = question.displayedEvidence.clues.filter((_, index) => index !== directIndex);
    assert(
      shortestPath(remaining, directHigher, directLower) === null,
      `Direct-true distractor also has a multi-clue path at ${question.prototypeId}:${question.seed}`,
    );
    transitiveAuthorityChecks += 1;
    directTrueDistractorChecks += 1;
  } else {
    assert(
      solveCp004Independently(question.displayedEvidence) === question.answerKey,
      `Generic solver mismatch at ${question.prototypeId}:${question.seed}`,
    );
  }

  assert(question.options.length === 4, `Option count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `Option collision at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.generationVersion === 'RNK_CP004_ENGLISH_REMODEL_V5', `Generation version mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.modelId === RNK_CP004_DIFFICULTY_MODEL_ID, `Difficulty model is unversioned at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.difficultyModel.score === question.reviewMetadata.difficultyProfile.featureScore, `Difficulty score drift at ${question.prototypeId}:${question.seed}`);
  assert(question.difficulty === expectedDifficulty(question), `Difficulty label mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.clueRoleProfile.invariantSatisfied, `Clue accounting failed at ${question.prototypeId}:${question.seed}`);
  assert(question.visibleExplanation.optionAnalysisDisplay === 'NATIVE_COLLAPSED', `Native disclosure contract missing at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.learnerRendererContract.rawHtmlAllowed === false, `Raw HTML allowed at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.learnerRendererContract.adminClueNotesVisibleToLearner === false, `Admin clues leak to learner at ${question.prototypeId}:${question.seed}`);
  assert((question.visibleExplanation.optionAnalysis?.length ?? 0) > 0, `Distractor help missing at ${question.prototypeId}:${question.seed}`);

  const learnerText = [
    ...question.visibleExplanation.lines,
    ...(question.visibleExplanation.optionAnalysis ?? []),
  ].join(' ');
  assert(!learnerText.includes('candidate(s)'), `Placeholder grammar remains at ${question.prototypeId}:${question.seed}`);
  assert(!learnerText.includes('confirmatory'), `Admin clue role leaked into learner text at ${question.prototypeId}:${question.seed}`);
  assert(!learnerText.includes('reduction edge'), `Proof-debug language leaked into learner text at ${question.prototypeId}:${question.seed}`);

  for (const note of question.reviewMetadata.adminClueRoleNotes) {
    assert(!/[“”"]/.test(note), `Admin note falsely quotes paraphrased clue at ${question.prototypeId}:${question.seed}`);
    assert(note.includes('>'), `Admin note does not identify the normalized edge at ${question.prototypeId}:${question.seed}`);
    adminNoteChecks += 1;
  }

  const edge = question.reviewMetadata.edgeContract;
  const topology = question.reviewMetadata.coreTopologyProfile;
  const roles = question.reviewMetadata.clueRoleProfile.roles;
  const expectedAdded = roles.filter((role) =>
    role.proofRole === 'CONFIRMATORY' && role.edgeDistanceClass === 'NON_ADJACENT').length;
  if (
    edge.coreReductionEdges !== topology.transitiveReductionEdgeCount
    || edge.displayedAdjacentEdges + edge.displayedNonAdjacentEdges !== roles.length
    || edge.addedConfirmatoryNonAdjacentEdges !== expectedAdded
  ) edgeContractFailures += 1;

  const proof = question.reviewMetadata.proofCountingContract;
  if (query.kind === 'MISSING_COMPARISON') {
    assert(proof.mode === 'OPTION_AUGMENTATION', `Missing-comparison proof mode is ambiguous at ${question.prototypeId}:${question.seed}`);
    assert(proof.selectedOptionRelations === 1, `Bridge relation is not counted at ${question.prototypeId}:${question.seed}`);
    assert(proof.completedProofRelations === proof.shortestBaseClueProof + 1, `Completed proof count is wrong at ${question.prototypeId}:${question.seed}`);
    missingProofContractChecks += 1;
  } else {
    assert(proof.mode === 'ORDINARY', `Ordinary proof mode is wrong at ${question.prototypeId}:${question.seed}`);
    assert(proof.selectedOptionRelations === 0, `Ordinary proof incorrectly counts option relation at ${question.prototypeId}:${question.seed}`);
    assert(proof.completedProofRelations === proof.shortestBaseClueProof, `Ordinary proof count drift at ${question.prototypeId}:${question.seed}`);
  }

  if (
    query.kind === 'RELATIVE_ORDER_OF_PAIR'
    && question.prototypeId !== RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID
  ) {
    const analysis = question.visibleExplanation.optionAnalysis?.join(' ') ?? '';
    assert(/lies between/.test(analysis), `Pair distractor is not grounded in the visible path at ${question.prototypeId}:${question.seed}`);
    assert(!/\d+ candidates? lie between/.test(analysis), `Pair distractor silently uses hidden full-order counts at ${question.prototypeId}:${question.seed}`);
    pairLocalProofChecks += 1;
  }

  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const analysis = question.visibleExplanation.optionAnalysis?.join(' ') ?? '';
    assert(!/off by one/i.test(analysis), `Exact-distance reason assumes fixed distractor spacing at ${question.prototypeId}:${question.seed}`);
  }

  assert(question.permanentQlId === null, `Permanent QL allocated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication activated early at ${question.prototypeId}:${question.seed}`);

  stableIds.add(question.reviewMetadata.stableQuestionId);
  difficulties.add(question.difficulty);
}

assert(stableIds.size === runtime.length, 'Stable IDs are not unique');
assert(difficulties.size === 3, 'Easy, Medium and Hard are not all reachable');
assert(edgeContractFailures === 0, `Edge metadata contract failed ${edgeContractFailures} time(s)`);
assert(transitiveAuthorityChecks === seedsPerPrototype, 'Transitive authority coverage is incomplete');
assert(directTrueDistractorChecks === seedsPerPrototype, 'Direct-true distractor coverage is incomplete');
assert(pairLocalProofChecks === seedsPerPrototype, 'Pair local-proof coverage is incomplete');
assert(missingProofContractChecks === seedsPerPrototype, 'Missing-comparison proof-contract coverage is incomplete');
assert(adminNoteChecks > 0, 'Admin clue-role notes were not exercised');

const reviewPack = buildRnkCp004ReviewPack();
assert(reviewPack.length === 66, 'Expected 66 V5 review questions');
assert(new Set(reviewPack.map((question) => question.seed)).size === 66, 'Review seeds are reused');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.stableQuestionId)).size === 66, 'Review stable IDs are duplicated');
assert(new Set(reviewPack.map((question) => question.reviewMetadata.normalizedSemanticFingerprint)).size === 66, 'Semantic duplicate remains');

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

const conclusionReview = reviewPack.filter((question) => question.displayedEvidence.query.kind === 'VALID_RANK_STATEMENT');
assert(conclusionReview.length === 6, 'Expected six transitive-conclusion review records');
assert(
  conclusionReview.every((question) =>
    question.reviewMetadata.optionRoleMetadata.some((role) => role.role === 'TRUE_DIRECT_SINGLE_CLUE')),
  'Review pack does not test the two-or-more-statements condition',
);

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

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdown(reviewPack);
assert(markdown.includes('English Remodel V5'), 'V5 title is absent');
assert(markdown.includes('Displayed edge breakdown'), 'Displayed-edge contract is absent');
assert(markdown.includes('Added confirmatory edges'), 'Confirmatory-edge contract is absent');
assert(!markdown.includes('**Added edges:**'), 'Misleading Added edges label remains');
assert(markdown.includes(RNK_CP004_DIFFICULTY_MODEL_ID), 'Difficulty model version is absent');
assert(markdown.includes('Selected bridge relations'), 'Missing-comparison option-edge counting is absent');
assert(markdown.includes('NATIVE_COLLAPSED'), 'Native disclosure contract is absent');
assert(!markdown.includes('<details>'), 'Raw HTML details remain');
assert(!markdown.includes('<summary>'), 'Raw HTML summary remains');
assert(!markdown.includes('candidate(s)'), 'Placeholder grammar remains in review pack');
assert(!markdown.includes('<summary>Clue-role note</summary>'), 'Learner clue-role accordion remains');

const visibleWords = reviewPack.reduce((total, question) => total
  + question.visibleExplanation.lines.join(' ').split(/\s+/).filter(Boolean).length, 0);
const averageVisibleExplanationWords = visibleWords / reviewPack.length;
const fullWords = reviewPack.reduce((total, question) => total
  + question.visibleExplanation.lines.join(' ').split(/\s+/).filter(Boolean).length
  + (question.visibleExplanation.optionAnalysis?.join(' ').split(/\s+/).filter(Boolean).length ?? 0), 0);
const averageFullExplanationWords = fullWords / reviewPack.length;

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_REMODEL_V5_REVIEW_PENDING',
  generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V5',
  sourceReview: 'RNK-CP004-REMODEL-V4-CRITICAL-REVIEW.md',
  runtimePrototypeCount: RNK_CP004_REMODEL_V5_PROTOTYPE_IDS.length,
  runtimeQuestionCount: runtime.length,
  reviewQuestionCount: reviewPack.length,
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-027',
  metadataContracts: {
    misleadingAddedEdgeLabelRemoved: 'PASS',
    difficultyModel: RNK_CP004_DIFFICULTY_MODEL_ID,
    missingComparisonOptionEdgeCounted: 'PASS',
    adminClueNotesSeparated: 'PASS',
  },
  learnerRenderer: {
    nativeDisclosureContract: 'PASS',
    rawHtmlRemoved: 'PASS',
    actualQuestionStudioUiValidation: 'PENDING_INTEGRATION',
    widthTargets: [360, 390, 430],
  },
  distractors: {
    transitiveAuthoritySpecificValidation: 'PASS',
    trueDirectSingleClueDistractor: 'PASS',
    directionPairLocalPathGrounding: 'PASS',
    exactDistanceReasonsDerivedFromOptions: 'PASS',
  },
  clueAccounting: {
    reviewEssentialForFullOrder: reviewEssential,
    reviewConfirmatory,
    reviewUnclassified: 0,
  },
  averageVisibleExplanationWords: Number(averageVisibleExplanationWords.toFixed(2)),
  averageExplanationWordsIncludingCollapsedHelp: Number(averageFullExplanationWords.toFixed(2)),
  answerPositionCounts: answerCounts,
  repeatedFourAnswerSequences: 0,
  normalizedSemanticDuplicates: 0,
  difficultyCoverage: [...difficulties].sort(),
  lifecycle: {
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-v5-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack-v5.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(
  join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled-V5.md'),
  markdown,
  'utf8',
);
console.log(JSON.stringify(report, null, 2));
