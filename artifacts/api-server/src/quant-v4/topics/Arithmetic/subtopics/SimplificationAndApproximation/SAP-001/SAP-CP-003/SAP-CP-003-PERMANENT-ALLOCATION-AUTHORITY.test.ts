import assert from "node:assert/strict";
import {
  SAP_PERMANENT_QL_BY_ID,
  SAP_PERMANENT_QL_REGISTRY,
  SAP_PERMANENT_QL_REGISTRY_STATE,
} from "../../SAP-PERMANENT-QL-REGISTRY";
import { generateSapCp003Package } from "./editorial-runtime";
import {
  SAP_CP003_PERMANENT_ALLOCATION,
  SAP_CP003_PERMANENT_QL_IDS,
  SAP_CP003_PERMANENT_STATE,
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
  generateSapCp003PermanentSweep,
} from "./permanent-runtime/runtime";
import { SAP_CP003_PROTOTYPE_IDS } from "./types";

assert.equal(SAP_CP003_PERMANENT_QL_IDS.length, 19);
assert.equal(SAP_CP003_PERMANENT_ALLOCATION.length, 19);
assert.equal(new Set(SAP_CP003_PERMANENT_QL_IDS).size, 19);
assert.equal(new Set(Object.values(SAP_CP003_PROTOTYPE_TO_PERMANENT_QL)).size, 19);
assert.deepEqual(Object.keys(SAP_CP003_PROTOTYPE_TO_PERMANENT_QL), [...SAP_CP003_PROTOTYPE_IDS]);

const numericIds = SAP_CP003_PERMANENT_QL_IDS.map((id) => Number(id.slice(-3)));
assert.deepEqual(numericIds, Array.from({ length: 19 }, (_, index) => 34 + index));

for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
  const discovery = generateSapCp003Package(prototypeId, 1);
  assert.equal(discovery.lifecycle.permanentQlId, null);
  assert.equal(discovery.lifecycle.active, false);
}

const sweep = generateSapCp003PermanentSweep(100);
assert.equal(sweep.length, 1_900);
const countsByQl = new Map<string, number>();
const generationIdentities = new Set<string>();

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.permanentQlId, SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[pkg.prototypeId]);
  assert.equal(pkg.lifecycle.permanentQlId, pkg.permanentQlId);
  assert.equal(pkg.lifecycle.identityStatus, "PERMANENT_ID_ALLOCATED");
  assert.equal(pkg.lifecycle.contentStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(pkg.approvalStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
  assert.ok(!generationIdentities.has(pkg.generationIdentity), `Duplicate identity ${pkg.generationIdentity}.`);
  generationIdentities.add(pkg.generationIdentity);
  countsByQl.set(pkg.permanentQlId, (countsByQl.get(pkg.permanentQlId) ?? 0) + 1);
}

assert.equal(generationIdentities.size, 1_900);
assert.equal(countsByQl.size, 19);
for (const qlId of SAP_CP003_PERMANENT_QL_IDS) assert.equal(countsByQl.get(qlId), 100);

assert.equal(SAP_PERMANENT_QL_REGISTRY.length, 52);
assert.equal(new Set(SAP_PERMANENT_QL_REGISTRY.map((entry) => entry.permanentQlId)).size, 52);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.registryVersion, 3);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.allocatedCheckpointCount, 3);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.lastAllocatedId, "SAP-QL-052");
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.nextAvailableId, "SAP-QL-053");
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.cp003Range, "SAP-QL-034..SAP-QL-052");

for (const qlId of SAP_CP003_PERMANENT_QL_IDS) {
  const entry = SAP_PERMANENT_QL_BY_ID[qlId];
  assert.equal(entry.checkpointId, "SAP-CP-003");
  assert.equal(entry.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.englishStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(entry.allocationApproval, "PRODUCT_OWNER_APPROVED_CP003_QA_2026_08_07");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
}

assert.equal(SAP_CP003_PERMANENT_STATE.permanentQlRange, "SAP-QL-034..SAP-QL-052");
assert.equal(SAP_CP003_PERMANENT_STATE.nextAvailableQlId, "SAP-QL-053");
assert.equal(SAP_CP003_PERMANENT_STATE.editorialApproval, "PRODUCT_OWNER_APPROVED_CP003_EDITORIAL_V3_2026_08_08");
assert.equal(SAP_CP003_PERMANENT_STATE.freezeApproval, "PRODUCT_OWNER_APPROVED_CP003_ENGLISH_FREEZE_2026_08_08");
assert.equal(SAP_CP003_PERMANENT_STATE.questionAndAnswerReview, "APPROVED_EDITORIAL_REMEDIATION_V3");
assert.equal(SAP_CP003_PERMANENT_STATE.fullEditorialReview, "FULL_300_QUESTION_HUMAN_APPROVED");
assert.equal(SAP_CP003_PERMANENT_STATE.englishExplanationFreeze, "ENGLISH_MANUAL_FREEZE_APPROVED");

console.log(JSON.stringify({
  status: "PASS_SAP_CP003_PERMANENT_IDENTITY_ENGLISH_FREEZE_AUTHORITY",
  permanentQlRange: SAP_CP003_PERMANENT_STATE.permanentQlRange,
  permanentQlCount: SAP_CP003_PERMANENT_QL_IDS.length,
  packagesTested: sweep.length,
  uniqueGenerationIdentities: generationIdentities.size,
  registryEntries: SAP_PERMANENT_QL_REGISTRY.length,
  nextAvailableQlId: SAP_CP003_PERMANENT_STATE.nextAvailableQlId,
  contentReview: SAP_CP003_PERMANENT_STATE.questionAndAnswerReview,
  fullEditorialReview: SAP_CP003_PERMANENT_STATE.fullEditorialReview,
  explanationFreeze: SAP_CP003_PERMANENT_STATE.englishExplanationFreeze,
  approvalAuthority: SAP_CP003_PERMANENT_STATE.freezeApproval,
  lifecycle: "INACTIVE_ENGLISH_FROZEN",
}, null, 2));
