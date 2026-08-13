import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateRnkCp001EnglishReviewedAuthorityQuestion } from './cp001-english-review-remediated-runtime';
import {
  listRnkCp001PrototypeAuthorityRows,
  RNK_CP001_DISCOVERY_PROTOTYPE_IDS,
  RNK_CP001_PROVISIONAL_AUTHORITY_IDS,
} from './cp001-provisional-consolidation';
import {
  RNK_CP001_PERMANENT_QL_IDS,
  RNK_CP001_QL_TO_AUTHORITY,
} from './cp001-permanent-runtime';

const FREEZE_VERSION = 'RNK_CP001_ENGLISH_DISCOVERY_FREEZE_V1' as const;
const REVIEW_SEEDS = [5, 16, 47, 92, 151, 233] as const;
const EXPECTED_REVIEW_PROJECTION_SHA256 =
  'c927dfb888a0a49666df1d14ab660360be84516f3c24a96e835d314c944e5597';

const expectedQlIds = [
  'RNK-QL-001',
  'RNK-QL-002',
  'RNK-QL-003',
  'RNK-QL-004',
  'RNK-QL-005',
  'RNK-QL-006',
  'RNK-QL-007',
  'RNK-QL-008',
  'RNK-QL-009',
] as const;

const expectedAuthorityIds = [
  'RNK-CP001-AUTH-01-CONVERT-RANK-BETWEEN-ENDS',
  'RNK-CP001-AUTH-02-TOTAL-FROM-BOTH-END-RANKS',
  'RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK',
  'RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK',
  'RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT',
  'RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT',
  'RNK-CP001-AUTH-07-EXACT-MIDDLE-RANK-FROM-ODD-TOTAL',
  'RNK-CP001-AUTH-08-ODD-TOTAL-FROM-EXACT-MIDDLE-RANK',
  'RNK-CP001-AUTH-09-TOTAL-FROM-BEFORE-AND-AFTER-COUNTS',
] as const;

assert.deepEqual(RNK_CP001_PERMANENT_QL_IDS, expectedQlIds);
assert.deepEqual(RNK_CP001_PROVISIONAL_AUTHORITY_IDS, expectedAuthorityIds);
assert.deepEqual(
  expectedQlIds.map((qlId) => RNK_CP001_QL_TO_AUTHORITY[qlId]),
  expectedAuthorityIds,
);

const ownershipRows = listRnkCp001PrototypeAuthorityRows();
assert.equal(RNK_CP001_DISCOVERY_PROTOTYPE_IDS.length, 13);
assert.equal(ownershipRows.length, 13);
assert.equal(new Set(ownershipRows.map((row) => row.prototypeId)).size, 13);
assert.equal(new Set(ownershipRows.map((row) => row.authorityId)).size, 9);
assert.deepEqual(
  ownershipRows.map((row) => row.prototypeId),
  [...RNK_CP001_DISCOVERY_PROTOTYPE_IDS],
);

const approvedReviewQuestions = RNK_CP001_PROVISIONAL_AUTHORITY_IDS.flatMap((authorityId) =>
  REVIEW_SEEDS.map((seed) => generateRnkCp001EnglishReviewedAuthorityQuestion(authorityId, seed)),
);
assert.equal(approvedReviewQuestions.length, 54);

const projection = approvedReviewQuestions.map((review) => {
  const question = review.question;
  return {
    authorityId: review.provisionalAuthorityId,
    seed: review.seed,
    sourcePrototypeId: review.sourcePrototypeId,
    stem: question.stem,
    options: question.options,
    answer: question.answer,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    mathematicalFingerprint: question.mathematicalFingerprint,
  };
});

const reviewProjectionSha256 = createHash('sha256')
  .update(JSON.stringify(projection), 'utf8')
  .digest('hex');
assert.equal(reviewProjectionSha256, EXPECTED_REVIEW_PROJECTION_SHA256);

for (const review of approvedReviewQuestions) {
  assert.equal(review.permanentQlId, null);
  assert.equal(review.lifecycle.questionStudioDiscoverable, false);
  assert.equal(review.lifecycle.questionBankStatus, 'NOT_STORED');
  assert.equal(review.lifecycle.testEligibility, 'INELIGIBLE');
  assert.equal(review.lifecycle.publiclyPublishable, false);
}

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  freezeVersion: FREEZE_VERSION,
  discoveryPrototypeCount: 13,
  frozenAuthorityCount: 9,
  permanentQlCount: 9,
  permanentQlRange: 'RNK-QL-001..009',
  nextAvailableQlId: 'RNK-QL-010',
  approvedReviewQuestionCount: 54,
  reviewProjectionSha256,
  openSourceDimensions: 0,
  englishManualApproval: true,
  questionStudioDiscoverable: false,
  questionBankStatus: 'NOT_STORED',
  testEligibility: 'INELIGIBLE',
  publiclyPublishable: false,
  ownershipRows,
  conclusion: 'PASS_FINAL_ENGLISH_DISCOVERY_FREEZE',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-final-discovery-freeze.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
}

console.log(JSON.stringify(report, null, 2));
