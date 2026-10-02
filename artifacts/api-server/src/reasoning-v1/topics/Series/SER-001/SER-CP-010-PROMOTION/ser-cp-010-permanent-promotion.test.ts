import assert from "node:assert/strict";

import {
  SER_PERMANENT_QL_IDS_V4,
  SER_PERMANENT_QL_REGISTRY_V4_STATE,
} from "../SER-PERMANENT-QL-REGISTRY-V4";
import {
  SER_CP010_PERMANENT_ALLOCATIONS,
  SER_CP010_PERMANENT_QL_IDS,
  SER_CP010_SOURCE_PROVISIONAL_TO_PERMANENT,
  SER_CP010_MERGED_EXISTING_VARIANTS,
  SER_CP010_REJECTED_SOURCE_IDENTITIES,
} from "./ser-cp-010-permanent-allocation";
import {
  generateSerCp008Audited,
  SER_CP008_AUDITED_QL_IDS,
} from "../SER-CP-008-AUDIT-REMEDIATION/audited-candidate";
import {
  generateSerCp009AuditedNumberSeries,
  SER_CP009_AUDITED_QL_IDS,
} from "../SER-CP-009-NUMBER-SERIES-AUDIT/number-series-audited";

assert.equal(SER_CP010_PERMANENT_QL_IDS.length, 16);
assert.equal(SER_PERMANENT_QL_IDS_V4.length, 29);
assert.equal(SER_PERMANENT_QL_REGISTRY_V4_STATE.nextAvailableId, "SER-QL-030");
assert.deepEqual(
  SER_CP010_PERMANENT_QL_IDS,
  Array.from({ length: 16 }, (_, i) => `SER-QL-${String(i + 14).padStart(3, "0")}`),
);

const sourceRoots = SER_CP010_PERMANENT_ALLOCATIONS.map(
  (entry) => entry.sourceProvisionalQlIds[0]!,
);
assert.deepEqual(
  sourceRoots.slice(0, 9),
  [...SER_CP008_AUDITED_QL_IDS],
);
assert.deepEqual(
  sourceRoots.slice(9),
  [...SER_CP009_AUDITED_QL_IDS],
);

const rejectedIds = new Set(
  SER_CP010_REJECTED_SOURCE_IDENTITIES.map((entry) => entry.qlId),
);
for (const rejected of ["SER-QL-019", "SER-QL-020", "SER-QL-042"]) {
  assert.ok(rejectedIds.has(rejected), "Rejected source identity missing: " + rejected);
}

for (const merged of SER_CP010_MERGED_EXISTING_VARIANTS) {
  assert.ok(
    ["SER-QL-003", "SER-QL-007", "SER-QL-010", "SER-QL-011"].includes(
      merged.existingPermanentQlId,
    ),
    "Unexpected existing-QL merge target: " + merged.existingPermanentQlId,
  );
}

for (const entry of SER_CP010_PERMANENT_ALLOCATIONS) {
  assert.equal(entry.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.promotionBasis, "SOURCE_BACKED_AUDITED_CANDIDATE");
  assert.equal(entry.promotionApproval, "PRODUCT_OWNER_APPROVED_2026_10_02");
  assert.equal(entry.multilingualAuditStatus, "EN_HI_PA_AUDIT_PROVEN");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.mockTestEligible, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.equal(entry.automaticStudentPublication, false);
}

const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
const seeds = [3, 17, 41];
let generationProofs = 0;

for (const entry of SER_CP010_PERMANENT_ALLOCATIONS) {
  const sourceQlId = entry.sourceProvisionalQlIds[0]!;
  assert.equal(
    SER_CP010_SOURCE_PROVISIONAL_TO_PERMANENT[sourceQlId],
    entry.permanentQlId,
  );

  for (const seed of seeds) {
    for (const locale of locales) {
      const question = entry.sourceCheckpointId === "SER-CP-008"
        ? generateSerCp008Audited(sourceQlId as any, seed, locale)
        : generateSerCp009AuditedNumberSeries(sourceQlId as any, seed, locale);

      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map((option: any) => option.value)).size, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
      assert.equal(question.options[question.correctIndex]?.value, question.correctAnswer);
      assert.ok(question.explanation.length >= 2);
      if (entry.sourceCheckpointId === "SER-CP-009") {
        assert.equal((question as any).reviewOnly, true);
        assert.equal((question as any).questionStudioDiscoverable, false);
        assert.equal((question as any).questionBankWritable, false);
        assert.equal((question as any).mockTestEligible, false);
        assert.equal((question as any).publiclyPublishable, false);
      }
      generationProofs += 1;
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_SER_CP010_PERMANENT_PROMOTION",
  permanentRegistryCount: SER_PERMANENT_QL_IDS_V4.length,
  newlyAllocatedCount: SER_CP010_PERMANENT_QL_IDS.length,
  generationProofs,
  nextAvailableId: SER_PERMANENT_QL_REGISTRY_V4_STATE.nextAvailableId,
}, null, 2));
