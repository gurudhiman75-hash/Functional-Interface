import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { solveCp004Independently, type RnkCp004Comparison, type RnkCp004Difficulty } from './cp004-foundation';
import { RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID } from './cp004-exam-ready-v5';
import {
  RNK_CP004_REMODEL_V4_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v6';
import { buildRnkCp004ReviewPack, renderRnkCp004QuestionsAndExplanationsMarkdown } from './cp004-review-pack';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function relationKey(clue: RnkCp004Comparison): string {
  return `${clue.higher}>${clue.lower}`;
}

function connectedComponents(
  entities: readonly string[],
  clues: readonly RnkCp004Comparison[],
): readonly (readonly string[])[] {
  const neighbours = new Map(entities.map((entity) => [entity, new Set<string>()]));
  for (const clue of clues) {
    neighbours.get(clue.higher)?.add(clue.lower);
    neighbours.get(clue.lower)?.add(clue.higher);
  }
  const unseen = new Set(entities);
  const components: string[][] = [];
  while (unseen.size > 0) {
    const first = unseen.values().next().value as string;
    const queue = [first];
    const component: string[] = [];
    unseen.delete(first);
    while (queue.length > 0) {
      const current = queue.shift()!;
      component.push(current);
      for (const neighbour of neighbours.get(current) ?? []) {
        if (unseen.delete(neighbour)) queue.push(neighbour);
      }
    }
    components.push(component);
  }
  return components;
}

function hasTwoUniqueBlocks(
  entities: readonly string[],
  clues: readonly RnkCp004Comparison[],
): boolean {
  const components = connectedComponents(entities, clues);
  if (components.length !== 2) return false;
  return components.every((component) => {
    const set = new Set(component);
    const local = clues.filter((clue) => set.has(clue.higher) && set.has(clue.lower));
    return countTopologicalOrders(component, local) === 1;
  });
}

function solvedOrder(question: RnkCp004ExamReadyQuestion): readonly string[] {
  const evidence = question.displayedEvidence;
  const orders: string[][] = [];
  const entityIndex = new Map(evidence.entities.map((entity, index) => [entity, index]));
  const clues = evidence.query.kind === 'MISSING_COMPARISON'
    ? (() => {
      const bridge = evidence.query.candidates.find((candidate) => relationKey(candidate) === question.answerKey)!;
      return [...evidence.clues, bridge];
    })()
    : evidence.clues;
  const prerequisites = Array.from({ length: evidence.entities.length }, () => 0);
  for (const clue of clues) prerequisites[entityIndex.get(clue.lower)!] |= 1 << entityIndex.get(clue.higher)!;
  const visit = (mask: number, order: string[]): void => {
    if (orders.length > 0) return;
    if (mask === (1 << evidence.entities.length) - 1) {
      orders.push([...order]);
      return;
    }
    for (let index = 0; index < evidence.entities.length; index += 1) {
      const bit = 1 << index;
      if ((mask & bit) !== 0) continue;
      if ((prerequisites[index] & mask) !== prerequisites[index]) continue;
      order.push(evidence.entities[index]);
      visit(mask | bit, order);
      order.pop();
    }
  };
  visit(0, []);
  return orders[0];
}

function expectedDifficulty(question: RnkCp004ExamReadyQuestion): RnkCp004Difficulty {
  const score = question.reviewMetadata.difficultyProfile.featureScore;
  return score <= 7 ? 'EASY' : score <= 12 ? 'MEDIUM' : 'HARD';
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-exam-ready-v4-output';
mkdirSync(outputDirectory, { recursive: true });
const seedsPerPrototype = 240;
const runtime = RNK_CP004_REMODEL_V4_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) => generateRnkCp004ExamReadyQuestion(prototypeId, seed)),
);

const stableIds = new Set<string>();
const difficulties = new Set<RnkCp004Difficulty>();
let accountingFailures = 0;
let confirmatoryRuntimeClues = 0;
let pairGuardChecks = 0;
let missingAlternativeProofs = 0;

for (const question of runtime) {
  const regenerated = generateRnkCp004ExamReadyQuestion(question.prototypeId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic output at ${question.prototypeId}:${question.seed}`);
  assert(solveCp004Independently(question.displayedEvidence) === question.answerKey, `Solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4, `Option count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `Option collision at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.generationVersion === 'RNK_CP004_ENGLISH_REMODEL_V4', `Generation version mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.clueRoleProfile.invariantSatisfied, `Clue accounting failed at ${question.prototypeId}:${question.seed}`);
  assert(
    question.reviewMetadata.clueRoleProfile.statementCount
      === question.reviewMetadata.clueRoleProfile.accountedStatementCount,
    `Unclassified clue at ${question.prototypeId}:${question.seed}`,
  );
  assert(question.reviewMetadata.shortestAnswerProofClues >= 1, `Shortest-answer proof missing at ${question.prototypeId}:${question.seed}`);
  assert(question.difficulty === expectedDifficulty(question), `Difficulty mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.visibleExplanation.optionAnalysisDisplay === 'COLLAPSED', `Collapsed option help missing at ${question.prototypeId}:${question.seed}`);
  assert((question.visibleExplanation.optionAnalysis?.length ?? 0) > 0, `Distractor explanation missing at ${question.prototypeId}:${question.seed}`);
  assert(question.permanentQlId === null, `Permanent QL allocated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated early at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication activated early at ${question.prototypeId}:${question.seed}`);

  stableIds.add(question.reviewMetadata.stableQuestionId);
  difficulties.add(question.difficulty);
  if (!question.reviewMetadata.clueRoleProfile.invariantSatisfied) accountingFailures += 1;
  confirmatoryRuntimeClues += question.reviewMetadata.clueRoleProfile.confirmatory;

  const evidence = question.displayedEvidence;
  question.reviewMetadata.clueRoleProfile.roles.forEach((role) => {
    const remaining = evidence.clues.filter((_, index) => index !== role.index);
    if (role.proofRole === 'CONFIRMATORY') {
      const preserved = evidence.query.kind === 'MISSING_COMPARISON'
        ? hasTwoUniqueBlocks(evidence.entities, remaining)
        : countTopologicalOrders(evidence.entities, remaining) === 1;
      assert(preserved, `Confirmatory clue is not removable at ${question.prototypeId}:${question.seed}:${role.index}`);
    }
    if (role.proofRole === 'ESSENTIAL_FOR_FULL_ORDER') {
      assert(countTopologicalOrders(evidence.entities, remaining) !== 1, `Full-order clue misclassified at ${question.prototypeId}:${question.seed}:${role.index}`);
    }
    if (role.proofRole === 'ESSENTIAL_FOR_BLOCK_ORDER') {
      assert(!hasTwoUniqueBlocks(evidence.entities, remaining), `Block clue misclassified at ${question.prototypeId}:${question.seed}:${role.index}`);
    }
  });

  if (evidence.query.kind === 'RELATIVE_ORDER_OF_PAIR'
    && question.prototypeId !== RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const order = solvedOrder(question);
    const distance = Math.abs(order.indexOf(evidence.query.first) - order.indexOf(evidence.query.second));
    assert(distance > 1, `Immediate distractor can also be true at ${question.prototypeId}:${question.seed}`);
    pairGuardChecks += 1;
  }

  if (evidence.query.kind === 'MISSING_COMPARISON') {
    assert(
      question.visibleExplanation.optionAnalysis?.some((line) => /permits both/.test(line)),
      `Alternative-order proof missing at ${question.prototypeId}:${question.seed}`,
    );
    missingAlternativeProofs += 1;
  }

  if (question.visibleExplanation.mode === 'POSITION_LINE') {
    const rows = question.visibleExplanation.lines.filter((line) => /\d+\. /.test(line));
    assert(rows.length <= 2, `Position rendering remains too tall at ${question.prototypeId}:${question.seed}`);
  }

  const topology = question.reviewMetadata.coreTopologyProfile;
  assert(
    topology.transitiveReductionFamily
      === (evidence.query.kind === 'MISSING_COMPARISON' ? 'TWO_ORDERED_BLOCKS' : 'TOTAL_ORDER_CHAIN'),
    `Core topology misreported at ${question.prototypeId}:${question.seed}`,
  );
}

assert(stableIds.size === runtime.length, 'Stable IDs are not unique');
assert(difficulties.size === 3, 'Easy, Medium and Hard are not all reachable');
assert(accountingFailures === 0, 'Runtime clue accounting failures remain');
assert(pairGuardChecks === seedsPerPrototype, 'Direction-pair guard coverage is incomplete');
assert(missingAlternativeProofs === seedsPerPrototype, 'Missing-comparison ambiguity proof coverage is incomplete');

const reviewPack = buildRnkCp004ReviewPack();
assert(reviewPack.length === 66, 'Expected 66 V4 review questions');
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

const markdown = renderRnkCp004QuestionsAndExplanationsMarkdown(reviewPack);
assert(markdown.includes('English Remodel V4'), 'V4 title is absent');
assert(markdown.includes('<summary>Why are the other options wrong?</summary>'), 'Progressive distractor component is absent');
assert(markdown.includes('accounted '), 'Clue accounting is absent from review output');
assert(markdown.includes('TOTAL_ORDER_CHAIN'), 'Core topology report is absent');
assert(!markdown.includes('CHAIN_WITH_NON_ADJACENT_VERIFICATION'), 'Confirmatory edges are still described as core topology');

const visibleWords = reviewPack.reduce((total, question) => total
  + question.visibleExplanation.lines.join(' ').split(/\s+/).filter(Boolean).length
  + (question.visibleExplanation.verificationNote?.split(/\s+/).filter(Boolean).length ?? 0), 0);
const averageVisibleExplanationWords = visibleWords / reviewPack.length;

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_REMODEL_V4_REVIEW_PENDING',
  generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V4',
  sourceReview: 'RNK-CP004-REMODEL-V3-CRITICAL-REVIEW.md',
  runtimePrototypeCount: RNK_CP004_REMODEL_V4_PROTOTYPE_IDS.length,
  runtimeQuestionCount: runtime.length,
  reviewQuestionCount: reviewPack.length,
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-027',
  clueAccounting: {
    runtimeFailures: accountingFailures,
    runtimeConfirmatoryClues: confirmatoryRuntimeClues,
    reviewEssentialForFullOrder: reviewEssential,
    reviewConfirmatory: reviewConfirmatory,
    reviewUnclassified: 0,
  },
  shortestAnswerProof: 'PASS',
  taskSpecificDifficulty: 'PASS',
  progressiveDistractorHelp: 'PASS',
  directionPairNonAdjacentGuard: 'PASS',
  missingComparisonAlternativeOrderProof: 'PASS',
  compactPositionRendering: 'PASS',
  coreTopologyReporting: 'PASS',
  averageVisibleExplanationWords: Number(averageVisibleExplanationWords.toFixed(2)),
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

writeFileSync(join(outputDirectory, 'cp004-exam-ready-remodel-v4-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-exam-ready-review-pack-v4.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(
  join(outputDirectory, 'RNK-CP-004-Questions-and-Explanations-Remodeled-V4.md'),
  markdown,
  'utf8',
);
console.log(JSON.stringify(report, null, 2));
