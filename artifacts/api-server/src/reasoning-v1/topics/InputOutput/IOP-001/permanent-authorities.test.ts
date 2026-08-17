import assert from "node:assert/strict";
import { IOP_ADVANCED_PROTOTYPES } from "./advanced-prototypes.ts";
import { IOP_001_PERMANENT_ALLOCATION, IOP_001_PERMANENT_QL_AUTHORITIES } from "./permanent-authorities.ts";
import { IOP_FOUNDATION_PROTOTYPES } from "./prototypes.ts";

assert.equal(IOP_001_PERMANENT_QL_AUTHORITIES.length, 8, "IOP permanent allocation must contain exactly eight semantic machine QLs");
assert.equal(IOP_001_PERMANENT_ALLOCATION.permanentQlCount, 8, "Package permanent QL count drifted");
assert.equal(IOP_001_PERMANENT_ALLOCATION.maturity, "ENGLISH_REVIEW_CANDIDATE");
assert.equal(IOP_001_PERMANENT_ALLOCATION.sourceFamilySaturation, "PASS_V1");
assert.equal(IOP_001_PERMANENT_ALLOCATION.whitelistedSourceModeCount, 19);
assert.equal(IOP_001_PERMANENT_ALLOCATION.englishAutomatedScaleProof, "PASS");
assert.equal(IOP_001_PERMANENT_ALLOCATION.englishHumanAuditPack, "PASS");
assert.equal(IOP_001_PERMANENT_ALLOCATION.englishArtifactAudit, "PASS");

const expectedIds = Array.from({ length: 8 }, (_, index) => `IOP-QL-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(IOP_001_PERMANENT_QL_AUTHORITIES.map((authority) => authority.qlId), expectedIds, "IOP permanent QL IDs must be contiguous and stable");

const semanticContracts = IOP_001_PERMANENT_QL_AUTHORITIES.map((authority) => authority.semanticContract);
assert.equal(new Set(semanticContracts).size, semanticContracts.length, "Two permanent QLs share the same semantic contract");

const mappedDiscoveryAuthorities = IOP_001_PERMANENT_QL_AUTHORITIES.flatMap((authority) => authority.discoveryAuthorities);
assert.equal(new Set(mappedDiscoveryAuthorities).size, mappedDiscoveryAuthorities.length, "A discovery authority was mapped to more than one permanent QL");

const expectedDiscoveryAuthorities = new Set([
  ...IOP_FOUNDATION_PROTOTYPES.map((authority) => authority.prototypeId),
  ...IOP_ADVANCED_PROTOTYPES
    .filter((authority) => authority.checkpointId !== "IOP-CP-010")
    .map((authority) => authority.prototypeId),
  "IOP-CP008-GAP-PROT-001",
]);

assert.equal(mappedDiscoveryAuthorities.length, expectedDiscoveryAuthorities.size, "Permanent map does not cover exactly the non-CP010 discovery authorities plus the source gap");
for (const authorityId of mappedDiscoveryAuthorities) {
  assert.ok(expectedDiscoveryAuthorities.has(authorityId), `Unknown permanent discovery authority ${authorityId}`);
}
for (const authorityId of expectedDiscoveryAuthorities) {
  assert.ok(mappedDiscoveryAuthorities.includes(authorityId), `Unmapped discovery authority ${authorityId}`);
}

for (const authority of IOP_001_PERMANENT_QL_AUTHORITIES) {
  assert.equal(authority.allocationStatus, "PERMANENT_ALLOCATED", `${authority.qlId} is not permanently allocated`);
  assert.equal(authority.englishProductionStatus, "ENGLISH_REVIEW_CANDIDATE", `${authority.qlId} is not at the English review-candidate gate`);
  assert.equal(authority.primaryExamFamily, "BANKING", `${authority.qlId} lost Banking ownership`);
  assert.equal(authority.nonBankingWeighting, "SOURCE_GATED", `${authority.qlId} leaked non-Banking weighting`);
  assert.ok(authority.allowedSolveModes.length > 0, `${authority.qlId} has no solve modes`);
  assert.equal(new Set(authority.allowedSolveModes).size, authority.allowedSolveModes.length, `${authority.qlId} has duplicate solve modes`);
  assert.equal(authority.questionStudioDiscoverable, false, `${authority.qlId} leaked into Question Studio`);
  assert.equal(authority.questionBankWritable, false, `${authority.qlId} leaked into Question Bank`);
  assert.equal(authority.testEligible, false, `${authority.qlId} leaked into tests`);
  assert.equal(authority.publiclyPublishable, false, `${authority.qlId} leaked into public delivery`);
}

const mixedAuthority = IOP_001_PERMANENT_QL_AUTHORITIES.find((authority) => authority.qlId === "IOP-QL-007");
assert.ok(mixedAuthority, "Mixed transformed-pair authority is missing");
assert.equal(mixedAuthority.sourceStatus, "SOURCE_PINNED_RBI_GRADE_B_2024");
assert.deepEqual(mixedAuthority.discoveryAuthorities, ["IOP-CP008-GAP-PROT-001"]);

for (const qlId of ["IOP-QL-005", "IOP-QL-006", "IOP-QL-008"] as const) {
  const authority = IOP_001_PERMANENT_QL_AUTHORITIES.find((candidate) => candidate.qlId === qlId);
  assert.ok(authority, `${qlId} missing`);
  assert.equal(authority.sourceStatus, "SOURCE_MODE_WHITELISTED_V1", `${qlId} should have a closed V1 source-mode whitelist`);
  assert.equal(authority.englishProductionStatus, "ENGLISH_REVIEW_CANDIDATE", `${qlId} should be English review-ready but unfrozen`);
}

assert.equal(IOP_001_PERMANENT_ALLOCATION.englishFreeze, false);
assert.equal(IOP_001_PERMANENT_ALLOCATION.questionStudioDiscoverable, false);
assert.equal(IOP_001_PERMANENT_ALLOCATION.questionBankWritable, false);
assert.equal(IOP_001_PERMANENT_ALLOCATION.testEligible, false);
assert.equal(IOP_001_PERMANENT_ALLOCATION.publiclyPublishable, false);
assert.equal(IOP_001_PERMANENT_ALLOCATION.hindiPunjabiStatus, "NOT_STARTED");

console.log("PASS_IOP_001_PERMANENT_QL_ALLOCATION");
console.log(`permanent QLs ${IOP_001_PERMANENT_QL_AUTHORITIES.length}`);
console.log(`mapped discovery authorities ${mappedDiscoveryAuthorities.length}`);
console.log("whitelisted source modes 19");
console.log("English review candidate true");
console.log("English freeze false");
console.log("CP010 machine QLs 0");
console.log("Question Studio false");
console.log("Question Bank false");
console.log("test eligible false");
console.log("publicly publishable false");
