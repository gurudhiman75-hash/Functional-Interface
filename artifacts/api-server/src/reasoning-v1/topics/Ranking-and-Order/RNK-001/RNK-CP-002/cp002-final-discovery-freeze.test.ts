import assert from 'node:assert/strict';
import {
  RNK_CP002_AUTHORITIES,
  RNK_CP002_AUTHORITY_IDS,
  RNK_CP002_DISCOVERY_PROTOTYPE_IDS,
} from './cp002-consolidation';
import {
  authorityForRnkCp002Ql,
  generateRnkCp002PermanentQuestion,
  RNK_CP002_PERMANENT_QL_IDS,
  RNK_CP002_QL_TO_AUTHORITY,
} from './cp002-permanent-runtime';
import {
  buildRnkCp002EnglishReviewProjection,
  hashRnkCp002EnglishReviewProjection,
  RNK_CP002_APPROVED_REVIEW_PROJECTION_SHA256,
} from './cp002-review-pack';

const EXPECTED_QL_MAPPING = {
  'RNK-QL-010': 'RNK-CP002-AUTH-01-PEOPLE-BETWEEN-NORMALIZED-POSITIONS',
  'RNK-QL-011': 'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS',
  'RNK-QL-012': 'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION',
  'RNK-QL-013': 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS',
  'RNK-QL-014': 'RNK-CP002-AUTH-05-TOTAL-FROM-MIXED-ENDS-KNOWN-ORDER',
  'RNK-QL-015': 'RNK-CP002-AUTH-06-EXTREME-TOTAL-UNKNOWN-ORDER',
  'RNK-QL-016': 'RNK-CP002-AUTH-07-EXACT-TOTAL-OR-INDETERMINATE',
  'RNK-QL-017': 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS',
} as const;

assert.equal(RNK_CP002_DISCOVERY_PROTOTYPE_IDS.length, 13);
assert.equal(new Set(RNK_CP002_DISCOVERY_PROTOTYPE_IDS).size, 13);
assert.equal(RNK_CP002_AUTHORITIES.length, 8);
assert.deepEqual(RNK_CP002_AUTHORITIES.map((item) => item.authorityId), [...RNK_CP002_AUTHORITY_IDS]);

const ownedPrototypes = RNK_CP002_AUTHORITIES.flatMap((item) => item.sourcePrototypeIds);
assert.equal(ownedPrototypes.length, 13);
assert.equal(new Set(ownedPrototypes).size, 13);
assert.deepEqual([...ownedPrototypes].sort(), [...RNK_CP002_DISCOVERY_PROTOTYPE_IDS].sort());

assert.deepEqual([...RNK_CP002_PERMANENT_QL_IDS], [
  'RNK-QL-010', 'RNK-QL-011', 'RNK-QL-012', 'RNK-QL-013',
  'RNK-QL-014', 'RNK-QL-015', 'RNK-QL-016', 'RNK-QL-017',
]);
assert.deepEqual(RNK_CP002_QL_TO_AUTHORITY, EXPECTED_QL_MAPPING);
assert.equal(new Set(Object.values(RNK_CP002_QL_TO_AUTHORITY)).size, 8);

for (const qlId of RNK_CP002_PERMANENT_QL_IDS) {
  assert.equal(authorityForRnkCp002Ql(qlId), EXPECTED_QL_MAPPING[qlId]);
  const question = generateRnkCp002PermanentQuestion(qlId, 17);
  assert.equal(question.qlId, qlId);
  assert.equal(question.permanentQlId, qlId);
  assert.equal(question.lifecycle.reviewStatus, 'ENGLISH_DISCOVERY_FROZEN');
  assert.equal(question.lifecycle.englishReviewOnly, true);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
  assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.ok(!('prototypeId' in question));
  assert.ok(!('sourcePrototypeId' in question));
}

const projection = buildRnkCp002EnglishReviewProjection();
assert.equal(projection.length, 48);
assert.equal(
  hashRnkCp002EnglishReviewProjection(),
  RNK_CP002_APPROVED_REVIEW_PROJECTION_SHA256,
);
assert.equal(
  RNK_CP002_APPROVED_REVIEW_PROJECTION_SHA256,
  'e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430',
);

const freezeSummary = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-002',
  freezeVersion: 'RNK_CP002_ENGLISH_DISCOVERY_FREEZE_V1',
  discoveryPrototypeCount: RNK_CP002_DISCOVERY_PROTOTYPE_IDS.length,
  frozenAuthorityCount: RNK_CP002_AUTHORITIES.length,
  permanentQlCount: RNK_CP002_PERMANENT_QL_IDS.length,
  permanentRange: 'RNK-QL-010..017',
  nextAvailableQlId: 'RNK-QL-018',
  approvedReviewCount: projection.length,
  approvedReviewProjectionSha256: RNK_CP002_APPROVED_REVIEW_PROJECTION_SHA256,
  openSourceDimensions: 0,
  englishReviewOnly: true,
  questionStudioDiscoverable: false,
  questionBankStatus: 'NOT_STORED',
  testEligibility: 'INELIGIBLE',
  publiclyPublishable: false,
  conclusion: 'PASS_CP002_FINAL_ENGLISH_DISCOVERY_FREEZE',
};
console.log(JSON.stringify(freezeSummary, null, 2));
