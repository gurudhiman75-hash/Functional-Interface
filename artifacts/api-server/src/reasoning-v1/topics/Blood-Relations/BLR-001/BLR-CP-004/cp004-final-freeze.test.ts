import assert from "node:assert/strict";

import {
  BLR_CP004_FINAL_FREEZE,
  BLR_CP004_INVERSE_AND_OVERLAP_AUDIT,
  BLR_CP004_MERGE_SPLIT_AUDIT,
  BLR_CP004_SOURCE_AUDIT,
} from "./cp004-final-freeze";
import { BLR_CP004_PERMANENT_CONTRACTS } from "./cp004-model";

assert.equal(BLR_CP004_FINAL_FREEZE.version, "BLR_CP004_ENGLISH_DISCOVERY_FREEZE_V1");
assert.equal(BLR_CP004_FINAL_FREEZE.approvedBy, "PROJECT_OWNER");
assert.equal(
  BLR_CP004_FINAL_FREEZE.ownerDirective,
  "APPROVED_CONTINUE_AND_FINISH_NEXT_CP",
);
assert.equal(BLR_CP004_FINAL_FREEZE.state, "ENGLISH_DISCOVERY_FROZEN");
assert.equal(BLR_CP004_FINAL_FREEZE.telemetry.recordCount, 612);
assert.equal(BLR_CP004_FINAL_FREEZE.telemetry.groupCount, 102);
assert.equal(BLR_CP004_FINAL_FREEZE.telemetry.prototypeCount, 13);
assert.equal(BLR_CP004_FINAL_FREEZE.telemetry.authorityCount, 5);
assert.equal(BLR_CP004_FINAL_FREEZE.permanentQlRange, "BLR-QL-013..BLR-QL-017");
assert.deepEqual(BLR_CP004_FINAL_FREEZE.permanentQlIds, [
  "BLR-QL-013",
  "BLR-QL-014",
  "BLR-QL-015",
  "BLR-QL-016",
  "BLR-QL-017",
]);
assert.equal(BLR_CP004_FINAL_FREEZE.nextAvailableChapterQlId, "BLR-QL-018");
assert.equal(BLR_CP004_FINAL_FREEZE.sourcePrototypeCount, 13);
assert.equal(BLR_CP004_FINAL_FREEZE.solveAuthorityCount, 5);
assert.equal(BLR_CP004_FINAL_FREEZE.structuralSaturationApproved, true);
assert.equal(BLR_CP004_FINAL_FREEZE.finalDiscoveryFreezeApproved, true);
assert.equal(BLR_CP004_MERGE_SPLIT_AUDIT.length, 13);
assert.equal(
  new Set(BLR_CP004_MERGE_SPLIT_AUDIT.map((entry) => entry.prototypeId)).size,
  13,
);
assert.equal(
  new Set(BLR_CP004_MERGE_SPLIT_AUDIT.map((entry) => entry.authority)).size,
  5,
);
assert.equal(BLR_CP004_INVERSE_AND_OVERLAP_AUDIT.length, 5);
assert.ok(
  BLR_CP004_SOURCE_AUDIT.some(
    (entry) => entry.owner === "BLR-CP-005" && entry.disposition === "DELEGATE",
  ),
);
assert.ok(
  BLR_CP004_SOURCE_AUDIT.some(
    (entry) => entry.owner === "Puzzle" && entry.disposition === "EXCLUDE",
  ),
);
assert.ok(
  BLR_CP004_SOURCE_AUDIT.some(
    (entry) => entry.owner === "Data Sufficiency" && entry.disposition === "EXCLUDE",
  ),
);
assert.equal(BLR_CP004_PERMANENT_CONTRACTS.length, 5);
for (const allowed of Object.values(BLR_CP004_FINAL_FREEZE.releaseLock)) {
  if (typeof allowed === "boolean" && allowed !== true) assert.equal(allowed, false);
}
assert.equal(BLR_CP004_FINAL_FREEZE.releaseLock.englishReviewOnly, true);
assert.equal(BLR_CP004_FINAL_FREEZE.releaseLock.questionStudioAllowed, false);
assert.equal(BLR_CP004_FINAL_FREEZE.releaseLock.questionBankWriteAllowed, false);
assert.equal(BLR_CP004_FINAL_FREEZE.releaseLock.mockTestAllowed, false);
assert.equal(BLR_CP004_FINAL_FREEZE.releaseLock.localisationAllowed, false);
assert.equal(BLR_CP004_FINAL_FREEZE.releaseLock.publicPublicationAllowed, false);
assert.equal(BLR_CP004_FINAL_FREEZE.releaseLock.productionStagingAllowed, false);
assert.equal(BLR_CP004_FINAL_FREEZE.releaseLock.mergeAllowed, false);

console.log(
  JSON.stringify(
    {
      freezeVersion: BLR_CP004_FINAL_FREEZE.version,
      records: BLR_CP004_FINAL_FREEZE.telemetry.recordCount,
      groups: BLR_CP004_FINAL_FREEZE.telemetry.groupCount,
      prototypes: BLR_CP004_FINAL_FREEZE.sourcePrototypeCount,
      authorities: BLR_CP004_FINAL_FREEZE.solveAuthorityCount,
      permanentQlRange: BLR_CP004_FINAL_FREEZE.permanentQlRange,
      nextAvailableQlId: BLR_CP004_FINAL_FREEZE.nextAvailableChapterQlId,
      verdict:
        "BLR-CP-004 SOURCE, MERGE/SPLIT, INVERSE AND CROSS-CHECKPOINT AUDITS ARE CLOSED; ENGLISH DISCOVERY IS FROZEN",
    },
    null,
    2,
  ),
);
