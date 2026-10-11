import { TSD_CP005_NATIVE_EDITORIAL_REVIEW_V5, TSD_CP005_NATIVE_EDITORIAL_V5_STATUS } from "./native-review-editorial-v5";
import {
  TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q,
  TSD_CP005_HI_PA_APPROVED_ARTIFACT_DIGEST,
  TSD_CP005_HI_PA_APPROVED_ARTIFACT_ID,
  TSD_CP005_HI_PA_APPROVED_JSON_SHA256,
  TSD_CP005_HI_PA_APPROVED_SOURCE_HEAD,
  TSD_CP005_HI_PA_APPROVED_WORKFLOW_RUN_ID,
  TSD_CP005_HI_PA_FREEZE_ID,
  TSD_CP005_HI_PA_FREEZE_STATUS,
  TSD_CP005_HI_PA_PRODUCT_OWNER_APPROVAL_DATE,
} from "./native-approved-freeze-v5";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function stripLifecycle(row: { source: unknown; presentation: Record<string, unknown> }) {
  const { lifecycle: _lifecycle, ...presentation } = row.presentation;
  return { source: row.source, presentation };
}

const sourceRows = TSD_CP005_NATIVE_EDITORIAL_REVIEW_V5;
const frozenRows = TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q;

assert(TSD_CP005_NATIVE_EDITORIAL_V5_STATUS === "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V5", "approved V5 source status mismatch");
assert(TSD_CP005_HI_PA_APPROVED_SOURCE_HEAD === "6f619fe95c108434d1db6c59f3d38b8c5bffa434", "approved source head drifted");
assert(TSD_CP005_HI_PA_FREEZE_ID === "TSD-CP-005-HI-PA-v5-frozen", "native freeze id drifted");
assert(TSD_CP005_HI_PA_FREEZE_STATUS === "APPROVED_NATIVE_FROZEN", "native freeze status drifted");
assert(TSD_CP005_HI_PA_PRODUCT_OWNER_APPROVAL_DATE === "2026-08-20", "approval date drifted");
assert(TSD_CP005_HI_PA_APPROVED_WORKFLOW_RUN_ID === 32275777332, "approved workflow run drifted");
assert(TSD_CP005_HI_PA_APPROVED_ARTIFACT_ID === 9373944402, "approved artifact id drifted");
assert(TSD_CP005_HI_PA_APPROVED_ARTIFACT_DIGEST === "sha256:53c8e2bafa0582304ced8d678c854ad5b75ef13986f2f47df442247173c4da0b", "approved artifact digest drifted");
assert(TSD_CP005_HI_PA_APPROVED_JSON_SHA256 === "6f423143d4059e3e90c4001629e38b6d5c74fd223c720e9b0bf2951ee7cedb6a", "approved JSON SHA drifted");
assert(sourceRows.length === 156 && frozenRows.length === 156, "freeze must contain exactly 156 native rows");

for (let index = 0; index < sourceRows.length; index += 1) {
  const source = sourceRows[index]!;
  const frozen = frozenRows[index]!;

  assert(
    stableJson(stripLifecycle(source as unknown as { source: unknown; presentation: Record<string, unknown> })) ===
      stableJson(stripLifecycle(frozen as unknown as { source: unknown; presentation: Record<string, unknown> })),
    `row ${index + 1}: approved native learner content changed during freeze`,
  );
  assert(source.presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `row ${index + 1}: source V5 was already frozen`);
  assert(!source.presentation.lifecycle.productOwnerApprovalRecorded, `row ${index + 1}: source V5 approval flag was already set`);
  assert(frozen.presentation.lifecycle.multilingualFreezeStatus === "FROZEN", `row ${index + 1}: frozen row not frozen`);
  assert(frozen.presentation.lifecycle.nativeReviewStatus === TSD_CP005_HI_PA_FREEZE_STATUS, `row ${index + 1}: frozen native status mismatch`);
  assert(frozen.presentation.lifecycle.productOwnerApprovalRecorded, `row ${index + 1}: approval not recorded`);
  assert(!frozen.presentation.lifecycle.questionStudioEnabled, `row ${index + 1}: Studio unlocked during freeze`);
  assert(frozen.presentation.lifecycle.questionBankStatus === "NOT_STORED", `row ${index + 1}: Bank unlocked during freeze`);
  assert(frozen.presentation.lifecycle.testEligibility === "INELIGIBLE", `row ${index + 1}: tests unlocked during freeze`);
  assert(!frozen.presentation.lifecycle.publiclyPublishable, `row ${index + 1}: publication unlocked during freeze`);
  assert(frozen.approvedNativeFreeze.productOwnerApprovalRecorded, `row ${index + 1}: freeze provenance missing approval`);
  assert(frozen.approvedNativeFreeze.approvalBasis === "EXPLICIT_PRODUCT_OWNER_APPROVAL", `row ${index + 1}: approval basis mismatch`);
  assert(!frozen.approvedNativeFreeze.questionStudioActivationAuthorized, `row ${index + 1}: Studio authorization leaked`);
  assert(!frozen.approvedNativeFreeze.questionBankStorageAuthorized, `row ${index + 1}: Bank authorization leaked`);
  assert(!frozen.approvedNativeFreeze.testEligibilityAuthorized, `row ${index + 1}: test authorization leaked`);
  assert(!frozen.approvedNativeFreeze.publicPublicationAuthorized, `row ${index + 1}: publication authorization leaked`);
  assert(!frozen.approvedNativeFreeze.mergeAuthorized, `row ${index + 1}: merge authorization leaked`);
}

const hi = frozenRows.filter((row) => row.presentation.language === "hi");
const pa = frozenRows.filter((row) => row.presentation.language === "pa");
assert(hi.length === 78 && pa.length === 78, "freeze must contain 78 Hindi + 78 Punjabi rows");
for (const languageRows of [hi, pa]) {
  assert(new Set(languageRows.map((row) => row.source.permanentQlId)).size === 13, "frozen native QL coverage changed");
  assert(new Set(languageRows.map((row) => row.source.solveMode)).size === 20, "frozen native solve-mode coverage changed");
  assert(new Set(languageRows.map((row) => row.presentation.stem)).size === 78, "frozen native stem uniqueness changed");
  assert(new Set(languageRows.map((row) => row.source.objectContextId)).size === 44, "frozen object-context coverage changed");
  assert(new Set(languageRows.map((row) => row.source.objectFamily)).size === 25, "frozen object-family coverage changed");
  assert(new Set(languageRows.map((row) => row.source.endpointFamily)).size === 18, "frozen endpoint-family coverage changed");
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_HI_PA_V5_APPROVED_FREEZE",
  freezeId: TSD_CP005_HI_PA_FREEZE_ID,
  approvedSourceHead: TSD_CP005_HI_PA_APPROVED_SOURCE_HEAD,
  productOwnerApprovalDate: TSD_CP005_HI_PA_PRODUCT_OWNER_APPROVAL_DATE,
  approvedWorkflowRunId: TSD_CP005_HI_PA_APPROVED_WORKFLOW_RUN_ID,
  approvedArtifactId: TSD_CP005_HI_PA_APPROVED_ARTIFACT_ID,
  approvedArtifactDigest: TSD_CP005_HI_PA_APPROVED_ARTIFACT_DIGEST,
  approvedJsonSha256: TSD_CP005_HI_PA_APPROVED_JSON_SHA256,
  frozenRows: frozenRows.length,
  hindiRows: hi.length,
  punjabiRows: pa.length,
  learnerContentByteEquivalentExceptLifecycle: true,
  permanentQlRange: "TSD-QL-058..TSD-QL-070",
  learnerSolveModes: 20,
  selectedObjectContextsPerLanguage: 44,
  selectedObjectFamiliesPerLanguage: 25,
  selectedEndpointFamiliesPerLanguage: 18,
  multilingualFreezeStatus: "FROZEN",
  productOwnerApprovalRecorded: true,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  mergeAuthorized: false,
}, null, 2));
