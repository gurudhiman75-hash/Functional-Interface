import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { SRI_001_MANIFEST } from "../SRI-001/manifest";
import { SRI_002_MANIFEST } from "../SRI-002/manifest";
import { SRI_ENGLISH_REVIEW_MEMBERS_R1, SRI_ENGLISH_REVIEW_READY_GROUPS_R1 } from "../english-review-r1";
import {
  SRI_001_PERMANENT_ALLOCATION_V1,
  SRI_002_PERMANENT_ALLOCATION_V1,
  SRI_PERMANENT_ALLOCATION_V1,
  expectedSriPackageForCheckpoint,
  getSriPermanentAllocationByQlId,
  getSriPermanentAllocationByRetainedGroupId,
} from "../permanent-allocation-v1";

const expectedIds = (packageId: "SRI-001" | "SRI-002") =>
  Array.from({ length: 29 }, (_, index) => `${packageId}-QL-${String(index + 1).padStart(3, "0")}`);
const expectedSolveModes = (packageId: "SRI-001" | "SRI-002") =>
  Array.from({ length: 29 }, (_, index) => `${packageId}-SM-${String(index + 1).padStart(3, "0")}`);

assert.equal(SRI_PERMANENT_ALLOCATION_V1.length, 58);
assert.equal(SRI_001_PERMANENT_ALLOCATION_V1.length, 29);
assert.equal(SRI_002_PERMANENT_ALLOCATION_V1.length, 29);
assert.deepEqual(SRI_001_PERMANENT_ALLOCATION_V1.map((entry) => entry.qlId), expectedIds("SRI-001"));
assert.deepEqual(SRI_002_PERMANENT_ALLOCATION_V1.map((entry) => entry.qlId), expectedIds("SRI-002"));
assert.deepEqual(SRI_001_PERMANENT_ALLOCATION_V1.map((entry) => entry.solveModeId), expectedSolveModes("SRI-001"));
assert.deepEqual(SRI_002_PERMANENT_ALLOCATION_V1.map((entry) => entry.solveModeId), expectedSolveModes("SRI-002"));
assert.equal(new Set(SRI_PERMANENT_ALLOCATION_V1.map((entry) => entry.qlId)).size, 58);
assert.equal(new Set(SRI_PERMANENT_ALLOCATION_V1.map((entry) => entry.solveModeId)).size, 58);
assert.equal(new Set(SRI_PERMANENT_ALLOCATION_V1.map((entry) => entry.retainedGroupId)).size, 58);
assert.equal(SRI_PERMANENT_ALLOCATION_V1.some((entry) => entry.retainedGroupId === "SRI-RG-039"), false);
assert.equal(SRI_PERMANENT_ALLOCATION_V1.some((entry) => entry.retainedGroupId === "SRI-RG-047"), true);

assert.equal(SRI_ENGLISH_REVIEW_READY_GROUPS_R1.length, 58);
assert.deepEqual(
  [...SRI_PERMANENT_ALLOCATION_V1.map((entry) => entry.retainedGroupId)].sort(),
  [...SRI_ENGLISH_REVIEW_READY_GROUPS_R1.map((entry) => entry.retainedGroupId)].sort(),
  "permanent allocation must be exactly the pre-allocation English-approved retained set",
);
assert.equal(
  SRI_PERMANENT_ALLOCATION_V1.reduce((count, entry) => count + entry.memberCandidateIds.length, 0),
  SRI_ENGLISH_REVIEW_MEMBERS_R1.length,
  "all source-supported prototype ancestry must remain reachable through permanent QLs",
);

for (const entry of SRI_PERMANENT_ALLOCATION_V1) {
  assert.equal(entry.packageId, expectedSriPackageForCheckpoint(entry.checkpointId), `${entry.qlId}: package/CP ownership mismatch`);
  assert.equal(entry.sourceSupported, true);
  assert.equal(entry.permanentIdentityAllocated, true);
  assert.equal(entry.allocationStatus, "PERMANENT_ID_ALLOCATED_ENGLISH_FREEZE_PENDING");
  assert.equal(entry.solveModeFrozen, false);
  assert.equal(entry.englishFingerprint, null);
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionStudioGenerationEnabled, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.ok(entry.memberCandidateIds.length > 0, `${entry.qlId}: missing prototype ancestry`);
  assert.equal(getSriPermanentAllocationByQlId(entry.qlId), entry);
  assert.equal(getSriPermanentAllocationByRetainedGroupId(entry.retainedGroupId), entry);
}

assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_001_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_002_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_001_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_002_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen, false);
assertSriReleaseLocks();

console.log(JSON.stringify({
  status: "PASS_SRI_PERMANENT_ALLOCATION_V1",
  permanentQlCount: SRI_PERMANENT_ALLOCATION_V1.length,
  packageCounts: {
    "SRI-001": SRI_001_PERMANENT_ALLOCATION_V1.length,
    "SRI-002": SRI_002_PERMANENT_ALLOCATION_V1.length,
  },
  qlRanges: {
    "SRI-001": "SRI-001-QL-001..SRI-001-QL-029",
    "SRI-002": "SRI-002-QL-001..SRI-002-QL-029",
  },
  heldRetainedGroup: "SRI-RG-039",
  allocatedSolveModeIds: 58,
  frozenSolveModeCount: SRI_CHAPTER_MANIFEST.frozenSolveModeCount,
  englishFrozen: SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen,
  downstreamReleaseEnabled: false,
}, null, 2));
