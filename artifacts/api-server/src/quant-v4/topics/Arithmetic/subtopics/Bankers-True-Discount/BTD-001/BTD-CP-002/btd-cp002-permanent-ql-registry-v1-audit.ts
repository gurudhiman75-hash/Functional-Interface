import assert from "node:assert/strict";
import { BTD_CP002_CANDIDATE_CONTRACTS, BTD_CP002_CANDIDATE_IDS } from "./btd-cp002-source-saturation-v2";
import { BTD_PERMANENT_ALLOCATION_BOUNDARY, BTD_PERMANENT_QL_REGISTRY, BTD_PERMANENT_QL_REGISTRY_VERSION } from "./btd-cp002-permanent-ql-registry-v1";

assert.equal(BTD_PERMANENT_QL_REGISTRY_VERSION, "BTD-001-PERMANENT-QL-REGISTRY-v1");
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.chapterId, "BTD-001");
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.checkpointId, "BTD-CP-002");
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.permanentQlCount, 20);
assert.equal(BTD_PERMANENT_QL_REGISTRY.length, 20);
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.firstQl, "BTD-QL-001");
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.lastQl, "BTD-QL-020");
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.nextFreeQl, "BTD-QL-021");
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.permanentQlAllocationAuthorized, true);
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.contentFreezeStatus, "REVIEW_LOCKED");
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.questionStudioDiscoverable, false);
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.questionBankWritable, false);
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.testEligible, false);
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.mockTestEligible, false);
assert.equal(BTD_PERMANENT_ALLOCATION_BOUNDARY.publiclyPublishable, false);

const expectedQlIds = Array.from({ length: 20 }, (_, index) => `BTD-QL-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(BTD_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId), expectedQlIds, "BTD permanent IDs are not contiguous");
assert.equal(new Set(BTD_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId)).size, 20, "duplicate BTD QL IDs");
assert.equal(new Set(BTD_PERMANENT_QL_REGISTRY.map((entry) => entry.semanticSignature)).size, 20, "duplicate permanent semantic signatures");
assert.equal(BTD_PERMANENT_QL_REGISTRY.filter((entry) => entry.origin === "BTD-CP-001").length, 9, "CP001 ownership count drift");
assert.equal(BTD_PERMANENT_QL_REGISTRY.filter((entry) => entry.origin === "BTD-CP-002").length, 11, "CP002 ownership count drift");

for (let index = 0; index < BTD_CP002_CANDIDATE_IDS.length; index += 1) {
  const candidateId = BTD_CP002_CANDIDATE_IDS[index]!;
  const qlId = `BTD-QL-${String(index + 10).padStart(3, "0")}`;
  const entry = BTD_PERMANENT_QL_REGISTRY.find((item) => item.qlId === qlId);
  assert.ok(entry, `${qlId}: missing permanent registry entry`);
  assert.equal(entry.origin, "BTD-CP-002");
  assert.equal(entry.sourceAuthorityId, candidateId, `${qlId}: source candidate mapping drift`);
  assert.equal(entry.semanticSignature, BTD_CP002_CANDIDATE_CONTRACTS[candidateId].signature, `${qlId}: semantic mapping drift`);
  assert.equal(entry.answerSemantic, BTD_CP002_CANDIDATE_CONTRACTS[candidateId].answerSemantic, `${qlId}: answer semantic drift`);
}

console.log(JSON.stringify({
  auditVersion: "BTD-CP002-PERMANENT-QL-REGISTRY-AUDIT-v1",
  registryVersion: BTD_PERMANENT_QL_REGISTRY_VERSION,
  chapterId: BTD_PERMANENT_ALLOCATION_BOUNDARY.chapterId,
  checkpointId: BTD_PERMANENT_ALLOCATION_BOUNDARY.checkpointId,
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  cp001QlCount: BTD_PERMANENT_QL_REGISTRY.filter((entry) => entry.origin === "BTD-CP-001").length,
  cp002QlCount: BTD_PERMANENT_QL_REGISTRY.filter((entry) => entry.origin === "BTD-CP-002").length,
  firstQl: BTD_PERMANENT_ALLOCATION_BOUNDARY.firstQl,
  lastQl: BTD_PERMANENT_ALLOCATION_BOUNDARY.lastQl,
  nextFreeQl: BTD_PERMANENT_ALLOCATION_BOUNDARY.nextFreeQl,
  permanentQlAllocationAuthorized: BTD_PERMANENT_ALLOCATION_BOUNDARY.permanentQlAllocationAuthorized,
  contentFreezeStatus: BTD_PERMANENT_ALLOCATION_BOUNDARY.contentFreezeStatus,
  questionStudioDiscoverable: BTD_PERMANENT_ALLOCATION_BOUNDARY.questionStudioDiscoverable,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_CP002_PERMANENT_QL_REGISTRY_AUDIT_V1");
