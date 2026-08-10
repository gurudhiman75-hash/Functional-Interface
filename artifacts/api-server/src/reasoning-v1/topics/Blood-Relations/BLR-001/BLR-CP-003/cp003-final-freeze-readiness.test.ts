import assert from "node:assert/strict";

import {
  BLR_CP003_FINAL_FREEZE_READINESS,
  BLR_CP003_FINAL_FREEZE_READINESS_VERSION,
  BLR_CP003_MIN_ACTIVE_RECORDS_PER_AUTHORITY,
} from "./cp003-final-freeze-readiness";

assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.version,
  BLR_CP003_FINAL_FREEZE_READINESS_VERSION,
);
assert.equal(BLR_CP003_MIN_ACTIVE_RECORDS_PER_AUTHORITY, 4);
assert.equal(BLR_CP003_FINAL_FREEZE_READINESS.humanReviewApproved, true);
assert.equal(BLR_CP003_FINAL_FREEZE_READINESS.acceptedPolishValidated, true);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.postHumanSourceGapConfirmed,
  true,
);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.activeLearnerReviewRecordCount,
  128,
);
assert.equal(BLR_CP003_FINAL_FREEZE_READINESS.rejectedSourceRecordCount, 92);
assert.equal(BLR_CP003_FINAL_FREEZE_READINESS.sourceRecordCount, 208);
assert.equal(BLR_CP003_FINAL_FREEZE_READINESS.provisionalAuthorityCount, 6);

const readinessByAuthority = new Map(
  BLR_CP003_FINAL_FREEZE_READINESS.authorities.map((entry) => [
    entry.authority,
    entry,
  ]),
);

const exactLineage = readinessByAuthority.get(
  "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
);
assert.ok(exactLineage);
assert.equal(exactLineage.learnerEvidenceReady, true);
assert.equal(exactLineage.activeRecordCount, 8);
assert.deepEqual(exactLineage.sourcePrototypeIdsWithoutActiveRecords, []);

for (const authority of [
  "DETERMINE_MEMBER_GENDER",
  "SELECT_UNORDERED_FAMILY_PAIR",
  "IDENTIFY_ALL_MEMBERS_BY_RELATION",
  "DETERMINE_MEMBER_MARITAL_STATUS",
  "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
] as const) {
  const readiness = readinessByAuthority.get(authority);
  assert.ok(readiness, `Missing readiness record for ${authority}.`);
  assert.equal(readiness.learnerEvidenceReady, false);
  assert.equal(readiness.activeRecordCount, 0);
  assert.ok(readiness.rejectedRecordCount > 0);
  assert.ok(readiness.sourcePrototypeIdsWithoutActiveRecords.length > 0);
}

assert.deepEqual(
  [...BLR_CP003_FINAL_FREEZE_READINESS.learnerSupportedAuthorities].sort(),
  ["IDENTIFY_PERSON_BY_EXACT_LINEAGE"],
);
assert.deepEqual(
  [...BLR_CP003_FINAL_FREEZE_READINESS.blockedAuthorities].sort(),
  [
    "DETERMINE_MEMBER_GENDER",
    "DETERMINE_MEMBER_MARITAL_STATUS",
    "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    "SELECT_UNORDERED_FAMILY_PAIR",
  ],
);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.finalDiscoveryFreezeReady,
  false,
);
assert.deepEqual(BLR_CP003_FINAL_FREEZE_READINESS.permanentQlIds, []);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.nextAvailableChapterQlId,
  "BLR-QL-009",
);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.releaseLock.englishReviewOnly,
  true,
);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.releaseLock.questionStudioAllowed,
  false,
);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.releaseLock.questionBankWriteAllowed,
  false,
);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.releaseLock.mockTestAllowed,
  false,
);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.releaseLock.localisationAllowed,
  false,
);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.releaseLock.publicPublicationAllowed,
  false,
);
assert.equal(
  BLR_CP003_FINAL_FREEZE_READINESS.releaseLock.mergeAllowed,
  false,
);

console.log(
  JSON.stringify(
    {
      freezeReadinessVersion: BLR_CP003_FINAL_FREEZE_READINESS.version,
      activeLearnerReviewRecords:
        BLR_CP003_FINAL_FREEZE_READINESS.activeLearnerReviewRecordCount,
      provisionalAuthorities:
        BLR_CP003_FINAL_FREEZE_READINESS.provisionalAuthorityCount,
      learnerSupportedAuthorities:
        BLR_CP003_FINAL_FREEZE_READINESS.learnerSupportedAuthorities,
      blockedAuthorities: BLR_CP003_FINAL_FREEZE_READINESS.blockedAuthorities,
      permanentQlCount:
        BLR_CP003_FINAL_FREEZE_READINESS.permanentQlIds.length,
      nextAvailableQlId:
        BLR_CP003_FINAL_FREEZE_READINESS.nextAvailableChapterQlId,
      verdict:
        "BLR-CP-003 FINAL FREEZE BLOCKED: FIVE PROVISIONAL AUTHORITIES LACK ACTIVE HUMAN-REVIEW EVIDENCE",
    },
    null,
    2,
  ),
);
