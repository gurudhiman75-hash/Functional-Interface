import assert from "node:assert/strict";
import {
  auditMenCp008FreezeReadiness,
  MEN_CP_008_PENDING_FREEZE_GATES,
  MEN_CP_008_RESOLVED_FREEZE_GATES,
} from "./freeze-readiness";

const audit = auditMenCp008FreezeReadiness();

assert.equal(audit.status, "READY_FOR_PERMANENT_FREEZE");
assert.equal(audit.internalGatesPassed, true);
assert.equal(audit.readyToFreeze, true);
assert.equal(audit.candidateFamilies, 52);
assert.equal(audit.prototypeAncestries, 66);
assert.equal(audit.settledMergeGroups, 12);
assert.equal(audit.standaloneFamilies, 40);
assert.equal(audit.directionalEvidencePackages, 320);
assert.equal(audit.finalSourceRecheckContracts, 4);
assert.ok(audit.noGapRows >= 35);
assert.equal(audit.noGapDimensions, 12);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.nextAvailableMen002Identity, "MEN-002-QL-044");
assert.equal(audit.questionStudioDiscoverable, false);
assert.equal(audit.publiclyPublishable, false);
assert.ok(MEN_CP_008_RESOLVED_FREEZE_GATES.length >= 7);
assert.deepEqual(MEN_CP_008_PENDING_FREEZE_GATES, []);

console.log(
  `MEN-CP-008 freeze readiness passed at ${audit.candidateFamilies} source-closed families from ${audit.prototypeAncestries} ancestries. Permanent allocation may begin at ${audit.nextAvailableMen002Identity}.`,
);
