import assert from "node:assert/strict";
import {
  GEO_TEMPORARY_CANDIDATE_IDS_V1,
  GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1,
  GEO_TEMPORARY_CANDIDATE_REGISTRY_V1,
  GEO_TEMPORARY_CANDIDATE_STAGE_COUNTS_V1,
  GEO_TEMPORARY_CANDIDATES_BY_CP_V1,
} from "../permanent-review/geometry-temporary-candidate-registry-v1";

assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length, 81, "Geometry must expose exactly 81 temporary executable candidates before merge/split review");
assert.equal(GEO_TEMPORARY_CANDIDATE_IDS_V1.length, 81);
assert.equal(new Set(GEO_TEMPORARY_CANDIDATE_IDS_V1).size, 81, "Temporary prototype identities must be collision-free");

assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.baselineCandidateCount, 38);
assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.remediationWave1To7CandidateCount, 25);
assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.remediationWave8To13CandidateCount, 18);
assert.equal(
  GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.baselineCandidateCount
    + GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.remediationWave1To7CandidateCount
    + GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.remediationWave8To13CandidateCount,
  81,
);

const expectedRemediationCounts = Object.freeze({
  REMEDIATION_WAVE_1: 4,
  REMEDIATION_WAVE_2: 3,
  REMEDIATION_WAVE_3: 4,
  REMEDIATION_WAVE_4: 2,
  REMEDIATION_WAVE_5: 2,
  REMEDIATION_WAVE_6: 4,
  REMEDIATION_WAVE_7: 6,
  REMEDIATION_WAVE_8: 3,
  REMEDIATION_WAVE_9: 4,
  REMEDIATION_WAVE_10: 5,
  REMEDIATION_WAVE_11: 3,
  REMEDIATION_WAVE_12: 1,
  REMEDIATION_WAVE_13: 2,
});
for (const [stage, expectedCount] of Object.entries(expectedRemediationCounts)) {
  assert.equal(GEO_TEMPORARY_CANDIDATE_STAGE_COUNTS_V1[stage as keyof typeof GEO_TEMPORARY_CANDIDATE_STAGE_COUNTS_V1], expectedCount, `${stage} candidate count drifted`);
}

for (let cp = 1; cp <= 14; cp += 1) {
  const cpId = `GEO-CP-${String(cp).padStart(3, "0")}`;
  assert.ok((GEO_TEMPORARY_CANDIDATES_BY_CP_V1[cpId]?.length ?? 0) > 0, `${cpId} has no executable discovery candidate`);
}

for (const candidate of GEO_TEMPORARY_CANDIDATE_REGISTRY_V1) {
  assert.match(candidate.temporaryPrototypeId, /^GEO-TMP-/);
  assert.match(candidate.cpId, /^GEO-CP-0(0[1-9]|1[0-4])$/);
  assert.ok(candidate.solveMode.length > 3, `${candidate.temporaryPrototypeId} is missing solve-mode identity`);
}

assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.permanentQlCount, 0);
assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.permanentAllocationAuthorized, false);
assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.solveModeFreezeAuthorized, false);
assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.questionStudioActivationAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_TEMPORARY_CANDIDATE_REGISTRY_V1",
  totalCandidates: GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length,
  uniquePrototypeIds: new Set(GEO_TEMPORARY_CANDIDATE_IDS_V1).size,
  baselineCandidates: GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.baselineCandidateCount,
  remediationWave1To7: GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.remediationWave1To7CandidateCount,
  remediationWave8To13: GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1.remediationWave8To13CandidateCount,
  coveredCheckpoints: Object.keys(GEO_TEMPORARY_CANDIDATES_BY_CP_V1).length,
  permanentQlCount: 0,
  lifecycle: "LOCKED_PENDING_MERGE_SPLIT_REVIEW",
}, null, 2));
