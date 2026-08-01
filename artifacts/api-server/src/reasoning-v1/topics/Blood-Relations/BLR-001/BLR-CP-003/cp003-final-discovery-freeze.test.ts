import assert from "node:assert/strict";

import {
  BLR_CP003_ENGLISH_DISCOVERY_FREEZE_VERSION,
  BLR_CP003_FINAL_DISCOVERY_FREEZE,
  BLR_CP003_FROZEN_PROTOTYPE_IDS,
  BLR_CP003_FROZEN_QUESTION_FORMS,
  BLR_CP003_FROZEN_SOLVE_AUTHORITIES,
  BLR_CP003_FROZEN_TOPOLOGY_IDS,
  BLR_CP003_INSTANCE_PROPERTIES,
  BLR_CP003_OWNERSHIP_DISPOSITIONS,
  BLR_CP003_PERMANENT_QL_IDS,
  BLR_CP003_RELEASE_LOCK,
  BLR_CP003_SOURCE_EVIDENCE_LEDGER,
} from "./cp003-final-discovery-freeze";
import { BLR_CP003_PERMANENT_CONTRACTS } from "./cp003-permanent-contracts";

assert.equal(
  BLR_CP003_ENGLISH_DISCOVERY_FREEZE_VERSION,
  "BLR_CP003_ENGLISH_DISCOVERY_FREEZE_V1",
);
assert.equal(
  BLR_CP003_FINAL_DISCOVERY_FREEZE.version,
  BLR_CP003_ENGLISH_DISCOVERY_FREEZE_VERSION,
);
assert.equal(BLR_CP003_FINAL_DISCOVERY_FREEZE.approvedBy, "PROJECT_OWNER");
assert.equal(BLR_CP003_FINAL_DISCOVERY_FREEZE.approvalDirective, "FINISH_CP");
assert.deepEqual(BLR_CP003_PERMANENT_QL_IDS, [
  "BLR-QL-009",
  "BLR-QL-010",
  "BLR-QL-011",
  "BLR-QL-012",
]);
assert.deepEqual(BLR_CP003_FROZEN_SOLVE_AUTHORITIES, [
  "SELECT_UNORDERED_FAMILY_PAIR",
  "IDENTIFY_ALL_MEMBERS_BY_RELATION",
  "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
  "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
]);
assert.equal(BLR_CP003_PERMANENT_CONTRACTS.length, 4);
assert.equal(BLR_CP003_FROZEN_PROTOTYPE_IDS.length, 29);
assert.equal(BLR_CP003_FROZEN_TOPOLOGY_IDS.length, 9);
assert.equal(BLR_CP003_FROZEN_QUESTION_FORMS.length, 13);

for (const contract of BLR_CP003_PERMANENT_CONTRACTS) {
  assert.ok(contract.sourcePrototypeIds.length > 0);
  assert.ok(contract.questionForms.length > 0);
  assert.equal(contract.status, "ENGLISH_DISCOVERY_FROZEN");
  assert.equal(contract.reviewOnly, true);
  assert.equal(contract.publiclyPublishable, false);
  assert.equal(contract.questionStudioVisible, false);
  assert.equal(contract.questionBankEligible, false);
  assert.equal(contract.mockTestEligible, false);
}

for (const property of [
  "SHARED_PASSAGE_GROUPING",
  "NEGATIVE_CLUE_COUNT",
  "UNKNOWN_SPOUSE_BOUNDARY",
  "TARGET_MARITAL_STATUS",
  "COMPLETE_SET_CARDINALITY",
  "MATERNAL_OR_PATERNAL_BRANCH",
  "DIFFICULTY_TIER",
]) {
  assert.ok(BLR_CP003_INSTANCE_PROPERTIES.includes(property as never));
}

assert.ok(BLR_CP003_SOURCE_EVIDENCE_LEDGER.length >= 5);
assert.ok(
  BLR_CP003_SOURCE_EVIDENCE_LEDGER.some(
    (entry) => entry.strength === "HUMAN_REVIEW",
  ),
);
assert.ok(
  BLR_CP003_SOURCE_EVIDENCE_LEDGER.some(
    (entry) =>
      entry.strength === "EXECUTABLE" &&
      entry.supports.includes("TWO_HUNDRED_NINETY_EIGHT_APPROVED_RECORDS"),
  ),
);

for (const owner of [
  "BLR-QL-001",
  "BLR-QL-002",
  "BLR-QL-003",
  "BLR-QL-005",
  "BLR-QL-006",
  "BLR-QL-007",
  "BLR-QL-008",
  "BLR-QL-009",
  "BLR-QL-010",
  "BLR-QL-011",
  "BLR-QL-012",
  "BLR-CP-004",
  "BLR-CP-005",
  "BLR-CP-006/007",
]) {
  assert.ok(
    BLR_CP003_OWNERSHIP_DISPOSITIONS.some(
      (entry) => entry.ownerQlId === owner,
    ),
    `Missing CP-003 ownership disposition for ${owner}.`,
  );
}

assert.equal(BLR_CP003_RELEASE_LOCK.permanentQlRange, "BLR-QL-009..BLR-QL-012");
assert.equal(BLR_CP003_RELEASE_LOCK.permanentQlCount, 4);
assert.equal(BLR_CP003_RELEASE_LOCK.nextAvailableChapterQlId, "BLR-QL-013");
assert.equal(BLR_CP003_RELEASE_LOCK.approvedRecordCount, 298);
assert.equal(BLR_CP003_RELEASE_LOCK.sharedPassageGroupCount, 102);
assert.equal(BLR_CP003_RELEASE_LOCK.topologyCount, 9);
assert.equal(BLR_CP003_RELEASE_LOCK.prototypeCount, 29);
assert.equal(BLR_CP003_RELEASE_LOCK.solveAuthorityCount, 4);
assert.equal(BLR_CP003_RELEASE_LOCK.questionFormCount, 13);
assert.deepEqual(BLR_CP003_RELEASE_LOCK.answerPositions, [74, 75, 75, 74]);
assert.equal(BLR_CP003_RELEASE_LOCK.structuralSaturationApproved, true);
assert.equal(BLR_CP003_RELEASE_LOCK.finalDiscoveryFreezeApproved, true);
assert.equal(BLR_CP003_RELEASE_LOCK.englishReviewOnly, true);
assert.equal(BLR_CP003_RELEASE_LOCK.questionStudioAllowed, false);
assert.equal(BLR_CP003_RELEASE_LOCK.questionBankWriteAllowed, false);
assert.equal(BLR_CP003_RELEASE_LOCK.mockTestAllowed, false);
assert.equal(BLR_CP003_RELEASE_LOCK.localisationAllowed, false);
assert.equal(BLR_CP003_RELEASE_LOCK.publicPublicationAllowed, false);
assert.equal(BLR_CP003_RELEASE_LOCK.productionStagingAllowed, false);
assert.equal(BLR_CP003_RELEASE_LOCK.mergeAllowed, false);

console.log(
  JSON.stringify(
    {
      freezeVersion: BLR_CP003_ENGLISH_DISCOVERY_FREEZE_VERSION,
      approvedRecords: BLR_CP003_RELEASE_LOCK.approvedRecordCount,
      passageGroups: BLR_CP003_RELEASE_LOCK.sharedPassageGroupCount,
      topologies: BLR_CP003_RELEASE_LOCK.topologyCount,
      prototypes: BLR_CP003_RELEASE_LOCK.prototypeCount,
      permanentQlRange: BLR_CP003_RELEASE_LOCK.permanentQlRange,
      permanentQlCount: BLR_CP003_RELEASE_LOCK.permanentQlCount,
      nextAvailableQlId: BLR_CP003_RELEASE_LOCK.nextAvailableChapterQlId,
      verdict:
        "BLR-CP-003 ENGLISH DISCOVERY FROZEN AT BLR-QL-009 THROUGH BLR-QL-012; RELEASE SURFACES REMAIN LOCKED",
    },
    null,
    2,
  ),
);
