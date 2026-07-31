import assert from "node:assert/strict";
import {
  auditMenCp008FreezeReadiness,
  MEN_CP_008_PENDING_FREEZE_GATES,
  MEN_CP_008_RESOLVED_FREEZE_GATES,
} from "./freeze-readiness";

const audit = auditMenCp008FreezeReadiness();

assert.equal(audit.status, "INTERNAL_FREEZE_GATES_PASSED_SOURCE_RECHECK_PENDING");
assert.equal(audit.internalGatesPassed, true);
assert.equal(audit.readyToFreeze, false);
assert.equal(audit.candidateFamilies, 48);
assert.equal(audit.prototypeAncestries, 62);
assert.equal(audit.settledMergeGroups, 12);
assert.equal(audit.standaloneFamilies, 36);
assert.equal(audit.directionalEvidencePackages, 320);
assert.ok(audit.noGapRows >= 31);
assert.equal(audit.noGapDimensions, 12);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.nextAvailableMen002Identity, "MEN-002-QL-044");
assert.equal(audit.questionStudioDiscoverable, false);
assert.equal(audit.publiclyPublishable, false);
assert.ok(MEN_CP_008_RESOLVED_FREEZE_GATES.length >= 6);
assert.deepEqual(MEN_CP_008_PENDING_FREEZE_GATES, [
  "FINAL_UPLOADED_SOURCE_RETRIEVAL_RECHECK",
]);

console.log(
  `MEN-CP-008 internal freeze readiness passed at ${audit.candidateFamilies} candidate families from ${audit.prototypeAncestries} ancestries. Final uploaded-source retrieval recheck remains the only external freeze blocker.`,
);
