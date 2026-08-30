import assert from "node:assert/strict";
import { GEO_PERMANENT_QL_ALLOCATION_PROOF_V1 } from "../permanent-review/geometry-permanent-ql-allocation-proof-v1";
import {
  GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  GEO_PERMANENT_QL_ALLOCATIONS_V1,
} from "../permanent-review/geometry-permanent-ql-allocation-v1";
import {
  GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1,
  GEO_SOLVE_MODE_FREEZE_V1,
} from "../permanent-review/geometry-solve-mode-freeze-v1";

assert.equal(GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.status, "PERMANENT_75_QL_ALLOCATION_PROVEN");
assert.equal(GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.proof.headSha, "b67e602105efda7bd2f0a67d4fc6698daaa3c4aa");
assert.equal(GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.proof.workflowRunId, 33154550293);
assert.equal(GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.proof.workflowJobId, 98794102972);
assert.equal(GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.proof.artifactId, 9679061402);
assert.equal(
  GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.proof.artifactDigest,
  "sha256:f6811e00ee39805a32b0cba9ac24bd74d36701e5aa2630a959e1e86c45af5831",
);
assert.equal(GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.lifecycle.solveModeFreezeAllowed, true);

assert.equal(GEO_PERMANENT_QL_ALLOCATIONS_V1.length, 75);
assert.equal(GEO_SOLVE_MODE_FREEZE_V1.length, 75, "Canonical Geometry solve-mode family count drifted");
assert.equal(GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.canonicalSolveModeFamilyRange, "GEO-SM-001..GEO-SM-075");
assert.equal(GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.nextAvailableCanonicalSolveModeFamilyId, "GEO-SM-076");

const canonicalIds = GEO_SOLVE_MODE_FREEZE_V1.map((entry) => entry.canonicalSolveModeFamilyId);
const expectedCanonicalIds = Array.from({ length: 75 }, (_, index) => `GEO-SM-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(canonicalIds, expectedCanonicalIds, "Canonical Geometry solve-mode family IDs must be contiguous");
assert.equal(new Set(canonicalIds).size, 75, "Canonical Geometry solve-mode family IDs must be unique");

for (let index = 0; index < GEO_SOLVE_MODE_FREEZE_V1.length; index += 1) {
  const freeze = GEO_SOLVE_MODE_FREEZE_V1[index]!;
  const allocation = GEO_PERMANENT_QL_ALLOCATIONS_V1[index]!;
  assert.equal(freeze.permanentQlId, allocation.permanentQlId);
  assert.equal(freeze.proposalKey, allocation.proposalKey);
  assert.equal(freeze.cpId, allocation.cpId);
  assert.equal(freeze.learnerDecision, allocation.learnerDecision);
  assert.deepEqual(freeze.candidateIds, allocation.candidateIds);
  assert.deepEqual(freeze.prototypeSolveModes, allocation.solveModes);
  assert.ok(freeze.prototypeSolveModes.length > 0, `${freeze.permanentQlId} must preserve solve-mode provenance`);
  assert.equal(freeze.frozen, true);
  assert.equal(freeze.solveModeContractStatus, "FROZEN_FOR_ENGLISH_RUNTIME_IMPLEMENTATION");
}

const allCandidateIds = GEO_SOLVE_MODE_FREEZE_V1.flatMap((entry) => entry.candidateIds);
assert.equal(allCandidateIds.length, 81, "Solve-mode freeze must still account for all 81 temporary authorities");
assert.equal(new Set(allCandidateIds).size, 81, "A temporary authority cannot belong to multiple canonical solve-mode families");

const parameterizedFamilies = GEO_SOLVE_MODE_FREEZE_V1.filter(
  (entry) => entry.freezeKind === "PARAMETERIZED_MULTI_AUTHORITY",
);
assert.equal(parameterizedFamilies.length, 6, "Exactly six canonical solve-mode families may merge multiple temporary authorities");
assert.equal(
  parameterizedFamilies.reduce((sum, entry) => sum + entry.candidateIds.length - 1, 0),
  6,
  "Solve-mode merge savings must stay exactly six",
);

for (const [cpId, expectedCount] of Object.entries(GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.chapterCounts)) {
  assert.equal(GEO_SOLVE_MODE_FREEZE_V1.filter((entry) => entry.cpId === cpId).length, expectedCount, `${cpId} solve-mode family count drifted`);
}

function byCandidate(candidateId: string) {
  const match = GEO_SOLVE_MODE_FREEZE_V1.find((entry) => entry.candidateIds.includes(candidateId));
  assert.ok(match, `Missing solve-mode freeze record for ${candidateId}`);
  return match;
}

const centreIdentification = byCandidate("GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1");
const rightTriangleOrthocentre = byCandidate("GEO-TMP-GAP-W3-CP006-RIGHT-TRIANGLE-ORTHOCENTRE-V1");
assert.notEqual(
  centreIdentification.canonicalSolveModeFamilyId,
  rightTriangleOrthocentre.canonicalSolveModeFamilyId,
  "Right-triangle orthocentre location must remain distinct from centre-name identification",
);

const directSecant = byCandidate("GEO-TMP-CP013-SECANT-SECANT-V1");
const reverseQuadraticSecant = byCandidate("GEO-TMP-GAP-W12-CP013-REVERSE-UNKNOWN-EXTERNAL-SECANT-V1");
assert.notEqual(
  directSecant.canonicalSolveModeFamilyId,
  reverseQuadraticSecant.canonicalSolveModeFamilyId,
  "Linear missing-whole secant and quadratic reverse external-secant recovery must remain distinct",
);

const lifecycle = GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.lifecycle;
assert.equal(lifecycle.permanentQlAllocationProven, true);
assert.equal(lifecycle.solveModeFreezeImplemented, true);
assert.equal(lifecycle.solveModesFrozenInAuthority, true);
assert.equal(lifecycle.solveModeFreezeProven, false);
assert.equal(lifecycle.englishRuntimeImplementationAllowed, false);
assert.equal(lifecycle.englishRuntimeImplemented, false);
assert.equal(lifecycle.englishFreezeAllowed, false);
assert.equal(lifecycle.localizationAllowed, false);
assert.equal(lifecycle.questionStudioActivationAllowed, false);
assert.equal(lifecycle.questionBankWriteAllowed, false);
assert.equal(lifecycle.testEligibilityAllowed, false);
assert.equal(lifecycle.publicPublicationAllowed, false);
assert.equal(lifecycle.prMergeAuthorized, false);
assert.equal(GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.postProofNextGate, "ENGLISH_RUNTIME_REVIEW");

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_PERMANENT_75_SOLVE_MODE_FREEZE_V1",
  temporaryCandidateAuthorities: allCandidateIds.length,
  permanentQlCount: GEO_PERMANENT_QL_ALLOCATIONS_V1.length,
  canonicalSolveModeFamilyCount: GEO_SOLVE_MODE_FREEZE_V1.length,
  canonicalSolveModeFamilyRange: GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.canonicalSolveModeFamilyRange,
  parameterizedMultiAuthorityFamilies: parameterizedFamilies.length,
  familiesByCp: GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.chapterCounts,
  postProofNextGate: GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.postProofNextGate,
}, null, 2));
