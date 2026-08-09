import assert from "node:assert/strict";

import {
  BLR_CP003_FINAL_APPROVED_BANK_VERSION,
  BLR_CP003_FINAL_APPROVAL_SCOPE,
  buildBlrCp003FinalBankTelemetry,
  generateBlrCp003FinalApprovedBank,
} from "./cp003-final-approved-bank";

const records = generateBlrCp003FinalApprovedBank();
const telemetry = buildBlrCp003FinalBankTelemetry(records);

assert.equal(
  BLR_CP003_FINAL_APPROVED_BANK_VERSION,
  "BLR_CP003_FINAL_APPROVED_BANK_V1",
);
assert.equal(BLR_CP003_FINAL_APPROVAL_SCOPE, "ENGLISH_DISCOVERY_FREEZE");
assert.equal(telemetry.recordCount, 298);
assert.equal(telemetry.groupCount, 102);
assert.equal(telemetry.topologyCount, 9);
assert.equal(telemetry.prototypeCount, 29);
assert.equal(telemetry.authorityCount, 4);
assert.equal(telemetry.permanentQlCount, 4);
assert.deepEqual(telemetry.answerPositions, [74, 75, 75, 74]);
assert.deepEqual(telemetry.sourceBankCounts, {
  V8_EDITORIAL_BASELINE: 130,
  V9_WAVE01_STRUCTURAL_STAGING: 96,
  V9_WAVE02_STRUCTURAL_STAGING: 72,
});
assert.equal(telemetry.uniqueQuestionSignatureCount, 298);
assert.equal(telemetry.questionSignatureUniquenessRatio, 1);
assert.ok(telemetry.uniqueStemCount > 0);
assert.ok(telemetry.unresolvedStatusRecordCount > 0);
assert.ok(Object.keys(telemetry.difficultyCounts).length >= 2);
assert.equal(new Set(records.map((record) => record.itemId)).size, 298);
assert.equal(
  new Set(records.map((record) => record.metadata.semanticFingerprint)).size,
  298,
);

for (const authority of [
  "SELECT_UNORDERED_FAMILY_PAIR",
  "IDENTIFY_ALL_MEMBERS_BY_RELATION",
  "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
  "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
] as const) {
  assert.ok((telemetry.authorityCounts[authority] ?? 0) > 0);
}

for (const record of records) {
  assert.equal(record.qlId, record.permanentQlId);
  assert.equal(record.prototypeOnly, false);
  assert.equal(record.reviewOnly, true);
  assert.equal(record.metadata.approvedBy, "PROJECT_OWNER");
  assert.equal(record.metadata.approvalDirective, "FINISH_CP");
  assert.equal(record.metadata.humanReviewApproved, true);
  assert.equal(record.metadata.structuralSaturationApproved, true);
  assert.equal(record.metadata.finalDiscoveryFreezeApproved, true);
  assert.equal(record.metadata.productionStagingApproved, false);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.semanticKey)).size, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.isCorrect, true);
}

const unresolved = records.filter(
  (record) =>
    record.originalAuthority ===
    "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS",
);
assert.ok(unresolved.length > 0);
assert.ok(
  unresolved.every(
    (record) =>
      record.finalAuthority === "IDENTIFY_MEMBER_BY_MARITAL_STATUS" &&
      record.permanentQlId === "BLR-QL-011",
  ),
);

console.log(
  JSON.stringify(
    {
      bankVersion: BLR_CP003_FINAL_APPROVED_BANK_VERSION,
      ...telemetry,
      permanentQlRange: "BLR-QL-009..BLR-QL-012",
      verdict:
        "BLR-CP-003 COMBINED ENGLISH BANK IS STRUCTURALLY SATURATED, FULL-ITEM REPETITION-CHECKED AND READY FOR FINAL DISCOVERY FREEZE",
    },
    null,
    2,
  ),
);
