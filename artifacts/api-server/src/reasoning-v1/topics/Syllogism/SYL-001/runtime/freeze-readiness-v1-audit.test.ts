import assert from "node:assert/strict";
import {
  SYL_FREEZE_READINESS_V1,
  SYL_FREEZE_REQUIREMENTS_V1,
} from "../source-authority/freeze-readiness-v1";

const ids = SYL_FREEZE_REQUIREMENTS_V1.map((entry) => entry.requirementId);
assert.equal(SYL_FREEZE_REQUIREMENTS_V1.length, 10);
assert.equal(new Set(ids).size, ids.length);
assert.deepEqual(SYL_FREEZE_READINESS_V1.counts, {
  MET: 3,
  PARTIAL: 3,
  BLOCKED: 4,
});
assert.equal(SYL_FREEZE_READINESS_V1.status, "NOT_READY_FOR_PROFILE_OR_QL_FREEZE");
assert.equal(SYL_FREEZE_READINESS_V1.permanentQlFreezePermitted, false);
assert.equal(SYL_FREEZE_READINESS_V1.profileActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V1.difficultyActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V1.generatorIntegrationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V1.prMergeRecommended, false);
assert.ok(SYL_FREEZE_READINESS_V1.nextCriticalPath.length >= 5);

for (const requirement of SYL_FREEZE_REQUIREMENTS_V1) {
  assert.ok(requirement.evidence.trim().length > 20);
  if (requirement.status === "MET") assert.equal(requirement.unblockAction, null);
  else assert.ok(requirement.unblockAction && requirement.unblockAction.trim().length > 20);
}

const banking = SYL_FREEZE_REQUIREMENTS_V1.find(
  (entry) => entry.requirementId === "BANKING_PROFILE_MOCK_READY",
);
assert.equal(banking?.status, "BLOCKED");
assert.ok(banking?.evidence.includes("80% active canonical"));
assert.ok(banking?.evidence.includes("20% blocked"));

const ssc = SYL_FREEZE_REQUIREMENTS_V1.find(
  (entry) => entry.requirementId === "SSC_PROFILE_MOCK_READY",
);
assert.equal(ssc?.status, "PARTIAL");
assert.ok(ssc?.evidence.includes("90% active canonical"));
assert.ok(ssc?.evidence.includes("10% adapted practice"));

const punjab = SYL_FREEZE_REQUIREMENTS_V1.find(
  (entry) => entry.requirementId === "PUNJAB_PROFILE_SOURCE_SATURATED",
);
assert.equal(punjab?.status, "PARTIAL");
assert.ok(punjab?.evidence.includes("12-question"));
assert.ok(punjab?.evidence.includes("not statewide"));

const difficulty = SYL_FREEZE_REQUIREMENTS_V1.find(
  (entry) => entry.requirementId === "DIFFICULTY_CALIBRATED",
);
assert.equal(difficulty?.status, "BLOCKED");
assert.ok(difficulty?.evidence.includes("AUDIT_ONLY_NOT_ACTIVE"));

console.log(JSON.stringify({
  status: "PASS_SYL_001_FREEZE_READINESS_AUDIT",
  authority: SYL_FREEZE_READINESS_V1.authorityId,
  decision: SYL_FREEZE_READINESS_V1.status,
  counts: SYL_FREEZE_READINESS_V1.counts,
  met: SYL_FREEZE_REQUIREMENTS_V1
    .filter((entry) => entry.status === "MET")
    .map((entry) => entry.requirementId),
  partial: SYL_FREEZE_REQUIREMENTS_V1
    .filter((entry) => entry.status === "PARTIAL")
    .map((entry) => entry.requirementId),
  blocked: SYL_FREEZE_REQUIREMENTS_V1
    .filter((entry) => entry.status === "BLOCKED")
    .map((entry) => entry.requirementId),
  nextCriticalPath: SYL_FREEZE_READINESS_V1.nextCriticalPath,
  locks: {
    permanentQlFreezePermitted: SYL_FREEZE_READINESS_V1.permanentQlFreezePermitted,
    profileActivationPermitted: SYL_FREEZE_READINESS_V1.profileActivationPermitted,
    difficultyActivationPermitted: SYL_FREEZE_READINESS_V1.difficultyActivationPermitted,
    generatorIntegrationPermitted: SYL_FREEZE_READINESS_V1.generatorIntegrationPermitted,
    prMergeRecommended: SYL_FREEZE_READINESS_V1.prMergeRecommended,
  },
}, null, 2));
