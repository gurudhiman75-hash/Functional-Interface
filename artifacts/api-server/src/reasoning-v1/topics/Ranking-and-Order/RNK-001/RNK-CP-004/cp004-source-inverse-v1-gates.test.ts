import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { reconstructUniqueOrder, solveCp004Independently } from './cp004-foundation';
import {
  RNK_CP004_ENGLISH_APPROVAL_ID,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  RNK_CP004_SOURCE_INVERSE_VERSION,
  generateRnkCp004SourceInverseQuestion,
  type RnkCp004SourceInverseQuestion,
  type RnkCp004SourceInverseVariant,
} from './cp004-source-inverse-v1';
import {
  buildRnkCp004SourceInverseReviewPack,
  renderRnkCp004SourceInverseMarkdown,
} from './cp004-source-inverse-review-pack';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function expectedDisplayedAnswer(question: RnkCp004SourceInverseQuestion): string {
  const profile = question.reviewMetadata.sourceInverseProfile;
  const query = question.displayedEvidence.query;
  const canonical = solveCp004Independently(question.displayedEvidence);
  if (profile.variant === 'CANONICAL' || profile.variant === 'ENTITY_AT_RANK_FROM_BOTTOM') return canonical;
  if (profile.variant === 'RANK_FROM_BOTTOM') {
    assert(query.kind === 'RANK_OF_NAMED_ENTITY', 'Bottom-rank variant has wrong query kind');
    const order = reconstructUniqueOrder(question.displayedEvidence.entities, question.displayedEvidence.clues);
    const topRank = order.indexOf(query.target) + 1;
    return String(order.length - topRank + 1);
  }
  assert(query.kind === 'COMPLETE_ORDER', 'Reverse-order variant has wrong query kind');
  return canonical.split('|').reverse().join('|');
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-source-inverse-v1-output';
mkdirSync(outputDirectory, { recursive: true });

const runtime = RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: 240 }, (_, seed) => generateRnkCp004SourceInverseQuestion(prototypeId, seed)),
);

const variantCounts = new Map<RnkCp004SourceInverseVariant, number>();
const coverageCounts = new Map<string, number>();
const neighbourDirections = new Map<string, number>();
const pairOrientations = new Map<string, number>();
let transformedCount = 0;

for (const question of runtime) {
  const profile = question.reviewMetadata.sourceInverseProfile;
  const canonical = solveCp004Independently(question.displayedEvidence);
  assert(question.reviewMetadata.examAuthenticityStatus === 'MANUAL_ENGLISH_APPROVED', `Approval status missing at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.englishManualApprovalId === RNK_CP004_ENGLISH_APPROVAL_ID, `Approval ID mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.sourceInverseStatus === 'EXPANSION_ACTIVE', `Expansion status mismatch at ${question.prototypeId}:${question.seed}`);
  assert(profile.version === RNK_CP004_SOURCE_INVERSE_VERSION, `Expansion version mismatch at ${question.prototypeId}:${question.seed}`);
  assert(profile.authorityDecision === 'EXISTING_AUTHORITY_PARAMETER', `Authority inflation at ${question.prototypeId}:${question.seed}`);
  assert(profile.permanentQlImpact === 'NONE', `Permanent QL impact must remain none at ${question.prototypeId}:${question.seed}`);
  assert(profile.canonicalAnswerKey === canonical, `Canonical solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(profile.displayedAnswerKey === question.answerKey, `Displayed key metadata mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.answerKey === expectedDisplayedAnswer(question), `Displayed inverse answer mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4, `Option count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option key mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].label === question.answer, `Correct option label mismatch at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((item) => item.answerKey)).size === 4, `Duplicate option key at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication enabled at ${question.prototypeId}:${question.seed}`);

  variantCounts.set(profile.variant, (variantCounts.get(profile.variant) ?? 0) + 1);
  coverageCounts.set(profile.coverageClass, (coverageCounts.get(profile.coverageClass) ?? 0) + 1);
  if (profile.variant !== 'CANONICAL') transformedCount += 1;

  const query = question.displayedEvidence.query;
  if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    neighbourDirections.set(query.direction, (neighbourDirections.get(query.direction) ?? 0) + 1);
  }
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const order = reconstructUniqueOrder(question.displayedEvidence.entities, question.displayedEvidence.clues);
    const orientation = order.indexOf(query.first) < order.indexOf(query.second) ? 'FIRST_IS_HIGHER' : 'SECOND_IS_HIGHER';
    pairOrientations.set(orientation, (pairOrientations.get(orientation) ?? 0) + 1);
  }
}

assert(runtime.length === 2640, `Expected 2640 source-inverse runtime records, found ${runtime.length}`);
assert(variantCounts.get('ENTITY_AT_RANK_FROM_BOTTOM') === 120, 'Entity-at-rank bottom coverage mismatch');
assert(variantCounts.get('RANK_FROM_BOTTOM') === 120, 'Named-rank bottom coverage mismatch');
assert(variantCounts.get('ORDER_LOWEST_TO_HIGHEST') === 120, 'Lowest-to-highest coverage mismatch');
assert(variantCounts.get('CANONICAL') === 2280, 'Canonical coverage mismatch');
assert(transformedCount === 360, `Expected 360 transformed runtime records, found ${transformedCount}`);
assert(coverageCounts.get('SOURCE_INVERSE_PARAMETER') === 720, 'Source-inverse parameter family count mismatch');
assert(coverageCounts.get('ENDPOINT_PAIRED_AUTHORITY') === 480, 'Endpoint paired-authority count mismatch');
assert(coverageCounts.get('ABOVE_BELOW_PARAMETER') === 240, 'Above/below parameter count mismatch');
assert(coverageCounts.get('PAIR_INPUT_SYMMETRY') === 480, 'Pair symmetry count mismatch');
assert(coverageCounts.get('NO_MATERIAL_INVERSE') === 720, 'No-material-inverse count mismatch');
assert((neighbourDirections.get('ABOVE') ?? 0) > 0 && (neighbourDirections.get('BELOW') ?? 0) > 0, 'Immediate-neighbour direction coverage incomplete');
assert((pairOrientations.get('FIRST_IS_HIGHER') ?? 0) > 0 && (pairOrientations.get('SECOND_IS_HIGHER') ?? 0) > 0, 'Pair input symmetry coverage incomplete');

const reviewPack = buildRnkCp004SourceInverseReviewPack();
assert(reviewPack.length === 36, `Expected 36 inverse review records, found ${reviewPack.length}`);
const reviewVariantCounts = new Map<string, number>();
const contextCounts = new Map<string, number>();
const answerCounts = [0, 0, 0, 0];
for (const question of reviewPack) {
  const variant = question.reviewMetadata.sourceInverseProfile.variant;
  assert(variant !== 'CANONICAL', 'Targeted inverse pack contains a canonical record');
  assert(question.answerKey === expectedDisplayedAnswer(question), `Review answer mismatch at ${question.prototypeId}:${question.seed}`);
  reviewVariantCounts.set(variant, (reviewVariantCounts.get(variant) ?? 0) + 1);
  const context = question.reviewMetadata.languageProfile.contextFamily;
  contextCounts.set(context, (contextCounts.get(context) ?? 0) + 1);
  answerCounts[question.correctIndex] += 1;
}
assert(reviewVariantCounts.get('ENTITY_AT_RANK_FROM_BOTTOM') === 12, 'Review entity-bottom count mismatch');
assert(reviewVariantCounts.get('RANK_FROM_BOTTOM') === 12, 'Review rank-bottom count mismatch');
assert(reviewVariantCounts.get('ORDER_LOWEST_TO_HIGHEST') === 12, 'Review reverse-order count mismatch');
for (const count of contextCounts.values()) assert(count === 6, `Review context count mismatch: ${count}`);
assert(answerCounts.every((count) => count === 9), `Review answers are not balanced: ${answerCounts.join('/')}`);

const markdown = renderRnkCp004SourceInverseMarkdown(reviewPack);
assert(markdown.includes('from the bottom'), 'Bottom-rank wording missing from inverse pack');
assert(markdown.includes('from lowest to highest'), 'Reverse-order wording missing from inverse pack');
assert(!markdown.includes('permanent QL impact ALLOCATED'), 'Inverse pack claims permanent allocation');

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_APPROVED_SOURCE_INVERSE_EXPANSION_ACTIVE',
  englishManualApproval: {
    status: 'APPROVED',
    approvalId: RNK_CP004_ENGLISH_APPROVAL_ID,
  },
  sourceInverseVersion: RNK_CP004_SOURCE_INVERSE_VERSION,
  runtimePrototypeCount: RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length,
  runtimeQuestionCount: runtime.length,
  transformedRuntimeQuestionCount: transformedCount,
  variantCounts: Object.fromEntries([...variantCounts.entries()].sort()),
  coverageClassCounts: Object.fromEntries([...coverageCounts.entries()].sort()),
  targetedReviewQuestionCount: reviewPack.length,
  targetedReviewPerInverseVariant: 12,
  targetedReviewVariantCounts: Object.fromEntries([...reviewVariantCounts.entries()].sort()),
  targetedReviewContextCounts: Object.fromEntries([...contextCounts.entries()].sort()),
  targetedReviewAnswerPositions: answerCounts,
  inverseDecisions: {
    entityAtRankFromBottom: 'PARAMETER_VARIANT_OF_ENTITY_AT_EXACT_RANK',
    rankFromBottom: 'PARAMETER_VARIANT_OF_RANK_OF_NAMED_ENTITY',
    orderLowestToHighest: 'PRESENTATION_PARAMETER_OF_COMPLETE_ORDER',
    highestLowest: 'EXISTING_PAIRED_AUTHORITIES',
    immediateAboveBelow: 'EXISTING_DIRECTION_PARAMETER',
    pairInputOrientation: 'EXISTING_SYMMETRY',
    definitelyFalseRelation: 'SEPARATE_AUTHORITY_CANDIDATE_REQUIRES_SOURCE_PROOF',
    cannotDetermineOrPossibleRelation: 'OWNED_BY_RNK_CP007',
  },
  permanentQlCount: null,
  permanentQlImpactFromInverseExpansion: 0,
  nextAvailableQlId: 'RNK-QL-027',
  nextPhase: 'OWNERSHIP_AND_MERGE_SPLIT_CONSOLIDATION',
  lifecycle: {
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(join(outputDirectory, 'cp004-source-inverse-v1-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-source-inverse-review-pack-v1.json'), `${JSON.stringify(reviewPack, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'RNK-CP-004-Source-Inverse-Expansion-V1-Review.md'), markdown, 'utf8');
console.log(JSON.stringify(report, null, 2));
