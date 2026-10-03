import assert from "node:assert/strict";

import { SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP007 } from "../../cp007/permanent/registry.ts";
import { SEA002_CP008_SOURCE_SATURATION_V3 } from "../source-saturation-v3.ts";
import {
  SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS,
  SEA002_CP008_WAVE04_AUTHORITY_STATUS,
  SEA002_CP008_WAVE04_SOLVE_SIGNATURES,
} from "../solve-signature-v4.ts";
import {
  SEA002_CP008_PERMANENT_QL_IDS,
  SEA002_CP008_PERMANENT_QL_REGISTRY,
  SEA002_CP008_SIGNATURE_TO_PERMANENT_QL,
  SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP008,
} from "./registry.ts";

assert.equal(SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP007, "SEA-QL-029");
assert.equal(SEA002_CP008_SOURCE_SATURATION_V3.productionSourceSaturationClaimed, true);
assert.equal(SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS.length, 7);
assert.deepEqual(SEA002_CP008_PERMANENT_QL_IDS, [
  "SEA-QL-029", "SEA-QL-030", "SEA-QL-031", "SEA-QL-032", "SEA-QL-033", "SEA-QL-034", "SEA-QL-035",
]);
assert.deepEqual(SEA002_CP008_SIGNATURE_TO_PERMANENT_QL, {
  "SEA-CP008-SIG-A": "SEA-QL-029",
  "SEA-CP008-SIG-B": "SEA-QL-030",
  "SEA-CP008-SIG-C": "SEA-QL-031",
  "SEA-CP008-SIG-E": "SEA-QL-032",
  "SEA-CP008-SIG-F": "SEA-QL-033",
  "SEA-CP008-SIG-G": "SEA-QL-034",
  "SEA-CP008-SIG-H": "SEA-QL-035",
});
assert.equal(SEA002_CP008_PERMANENT_QL_REGISTRY.length, 7);
assert.equal(new Set(SEA002_CP008_PERMANENT_QL_REGISTRY.map((entry) => entry.permanentQlId)).size, 7);
assert.equal(new Set(SEA002_CP008_PERMANENT_QL_REGISTRY.map((entry) => entry.signatureId)).size, 7);
assert.equal(new Set(SEA002_CP008_PERMANENT_QL_REGISTRY.map((entry) => entry.authorityKey)).size, 7);

for (const entry of SEA002_CP008_PERMANENT_QL_REGISTRY) {
  assert.equal(entry.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.sourceSaturationStatus, "PRODUCTION_SOURCE_SATURATION_WAVE04_PROVEN");
  assert.equal(entry.structuralProofStatus, "INDEPENDENT_UNIQUENESS_FAMILY_PROVEN");
  assert.equal(entry.englishReviewStatus, "NOT_STARTED");
  assert.equal(entry.localizationStatus, "NOT_STARTED");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.mockTestEligible, false);
  assert.equal(entry.productionStaging, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.equal(entry.automaticStudentPublication, false);
  assert.ok(entry.solveContract.length > 80);
  assert.ok(entry.definingDiscriminators.length >= 4);
}

const ql029 = SEA002_CP008_PERMANENT_QL_REGISTRY.find((entry) => entry.permanentQlId === "SEA-QL-029");
assert.ok(ql029);
assert.equal(ql029.signatureId, "SEA-CP008-SIG-A");
assert.match(ql029.authorityLabel, /8-seat and 12-seat scales/iu);
assert.match(ql029.solveContract, /12-seat/iu);
assert.ok(ql029.definingDiscriminators.includes("8-seat or 12-seat scale parameter"));
assert.deepEqual(SEA002_CP008_WAVE04_SOLVE_SIGNATURES["SEA-CP008-SIG-A"].prototypeIds, [
  "SEA-CP008-PROT-001", "SEA-CP008-PROT-002", "SEA-CP008-PROT-005",
]);
assert.equal(SEA002_CP008_WAVE04_AUTHORITY_STATUS.sourceBackedRoleDerivedScaleVariantMergedInto, "SEA-CP008-SIG-A");
assert.equal(SEA002_CP008_PERMANENT_QL_REGISTRY.some((entry) => entry.signatureId === "SEA-CP008-SIG-D"), false);
assert.equal(SEA002_CP008_PERMANENT_QL_REGISTRY.some((entry) => entry.permanentQlId === "SEA-QL-036"), false);
assert.equal(SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP008, "SEA-QL-036");

console.log("PASS_SEA002_CP008_PERMANENT_QL_ALLOCATION_V1");
console.log("allocated inactive QLs", SEA002_CP008_PERMANENT_QL_IDS.join(","));
console.log("authority count", SEA002_CP008_PERMANENT_QL_REGISTRY.length);
console.log("source-backed SIG-D scale variant merged into SIG-A", true);
console.log("eighth QL allocated", false);
console.log("English/localization", "NOT_STARTED", "NOT_STARTED");
console.log("Studio/Bank/test/mock/staging/public", false, false, false, false, false, false);
console.log("next permanent QL", SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP008);
