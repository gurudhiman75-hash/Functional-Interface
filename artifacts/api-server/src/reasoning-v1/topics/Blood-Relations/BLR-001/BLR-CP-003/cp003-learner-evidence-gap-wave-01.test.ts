import assert from "node:assert/strict";

import {
  BLR_CP003_GAP_WAVE_01_RELEASE_LOCK,
  BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01,
  BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01_VERSION,
} from "./cp003-learner-evidence-gap-wave-01";

assert.equal(
  BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01_VERSION,
  "BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01",
);
assert.equal(BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01.length, 5);
assert.deepEqual(
  BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01.map((entry) => entry.authority).sort(),
  [
    "DETERMINE_MEMBER_GENDER",
    "DETERMINE_MEMBER_MARITAL_STATUS",
    "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    "SELECT_UNORDERED_FAMILY_PAIR",
  ],
);

for (const entry of BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01) {
  assert.equal(entry.disposition, "RETAIN_AND_PROVE");
  assert.equal(entry.currentActiveRecords, 0);
  assert.equal(entry.minimumCandidateRecords, 4);
  assert.ok(entry.candidateTaskContract.length > 60);
  assert.ok(entry.evidenceContract.length >= 3);
  assert.ok(entry.implementationBoundary.length >= 3);
  assert.equal(entry.humanReviewRequired, true);
}

assert.equal(BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.preserveApprovedV5Pack, true);
assert.equal(BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.candidatePackVersion, "V6");
assert.equal(
  BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.minimumCandidateRecordsPerAuthority,
  4,
);
assert.equal(BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.humanReviewRequired, true);
assert.equal(BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.finalFreezeAllowed, false);
assert.equal(
  BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.permanentQlAllocationAllowed,
  false,
);
assert.equal(
  BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.nextAvailableChapterQlId,
  "BLR-QL-009",
);
assert.equal(BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.questionStudioAllowed, false);
assert.equal(
  BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.questionBankWriteAllowed,
  false,
);
assert.equal(BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.mockTestAllowed, false);
assert.equal(BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.localisationAllowed, false);
assert.equal(
  BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.publicPublicationAllowed,
  false,
);
assert.equal(BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.mergeAllowed, false);

console.log(
  JSON.stringify(
    {
      gapWaveVersion: BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01_VERSION,
      blockedAuthorities: BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01.length,
      minimumCandidateRecords:
        BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.minimumCandidateRecordsPerAuthority,
      candidatePackVersion:
        BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.candidatePackVersion,
      permanentQlCount: 0,
      nextAvailableQlId:
        BLR_CP003_GAP_WAVE_01_RELEASE_LOCK.nextAvailableChapterQlId,
      verdict:
        "BLR-CP-003 GAP WAVE 01 SCOPED; V5 PRESERVED; V6 HUMAN REVIEW REQUIRED BEFORE FREEZE",
    },
    null,
    2,
  ),
);
