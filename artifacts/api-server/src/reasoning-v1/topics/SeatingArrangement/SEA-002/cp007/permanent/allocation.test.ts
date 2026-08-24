import assert from "node:assert/strict";

import { SEA002_CP006_COMPLETION_AUTHORITY } from "../../cp006/cp006-completion-authority.ts";
import { SEA002_CP007_SOURCE_SATURATION_V1 } from "../source-saturation-v1.ts";
import {
  SEA002_CP007_AUTHORITY_TO_PERMANENT_QL,
  SEA002_CP007_PERMANENT_QL_IDS,
  SEA002_CP007_PERMANENT_QL_REGISTRY,
  SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP007,
} from "./registry.ts";

assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.nextCheckpoint, "SEA-CP-007");
assert.equal(SEA002_CP006_COMPLETION_AUTHORITY.nextPermanentQlId, "SEA-QL-025");
assert.equal(SEA002_CP007_SOURCE_SATURATION_V1.proposedAuthorities.length, 4);
assert.equal(SEA002_CP007_SOURCE_SATURATION_V1.proposedPermanentRangeIfApproved, "SEA-QL-025..SEA-QL-028");

assert.deepEqual(SEA002_CP007_PERMANENT_QL_IDS, ["SEA-QL-025", "SEA-QL-026", "SEA-QL-027", "SEA-QL-028"]);
assert.deepEqual(SEA002_CP007_AUTHORITY_TO_PERMANENT_QL, {
  "CP007-AUTH-01": "SEA-QL-025",
  "CP007-AUTH-02": "SEA-QL-026",
  "CP007-AUTH-03": "SEA-QL-027",
  "CP007-AUTH-04": "SEA-QL-028",
});
assert.equal(new Set(SEA002_CP007_PERMANENT_QL_REGISTRY.map((entry) => entry.permanentQlId)).size, 4);
assert.equal(new Set(SEA002_CP007_PERMANENT_QL_REGISTRY.map((entry) => entry.authorityKey)).size, 4);

for (const entry of SEA002_CP007_PERMANENT_QL_REGISTRY) {
  assert.equal(entry.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.sourceSaturationStatus, "FOUR_AUTHORITIES_PROVEN");
  assert.equal(entry.productionUniquenessStatus, "INDEPENDENT_UNIQUENESS_V2_PROVEN");
  assert.equal(entry.englishReviewStatus, "REVIEW_READY_NOT_APPROVED");
  assert.equal(entry.localizationStatus, "NOT_STARTED");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.mockTestEligible, false);
  assert.equal(entry.productionStaging, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.equal(entry.automaticStudentPublication, false);
  assert.ok(entry.solveContract.length > 40);
  assert.ok(entry.definingDiscriminators.length >= 3);
}

const auth03 = SEA002_CP007_PERMANENT_QL_REGISTRY.find((entry) => entry.authorityKey === "CP007-AUTH-03")!;
assert.equal(auth03.permanentQlId, "SEA-QL-027");
assert.match(auth03.solveContract, /infer row membership/iu);
assert.ok(auth03.definingDiscriminators.includes("row membership not roster-supplied"));

const auth04 = SEA002_CP007_PERMANENT_QL_REGISTRY.find((entry) => entry.authorityKey === "CP007-AUTH-04")!;
assert.equal(auth04.permanentQlId, "SEA-QL-028");
assert.match(auth04.solveContract, /infer the reference person's facing/iu);

assert.equal(SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP007, "SEA-QL-029");

console.log("PASS_SEA002_CP007_PERMANENT_QL_ALLOCATION_V1");
console.log("allocated inactive QLs", SEA002_CP007_PERMANENT_QL_IDS.join(","));
console.log("authority count", SEA002_CP007_PERMANENT_QL_REGISTRY.length);
console.log("English review approved", false);
console.log("localization started", false);
console.log("Studio/Bank/test/mock/staging/public", false, false, false, false, false, false);
console.log("next permanent QL", SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP007);
