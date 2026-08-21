import { independentlyVerifyCp006 } from "../verifier";
import { TSD_CP006_ENGLISH_FREEZE_ID } from "../english-approved-freeze-v5";
import {
  generateCp006NativeReviewV7,
  TSD_CP006_NATIVE_REVIEW_STATUS_V7,
} from "./native-review-editorial-v7";
import {
  TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q,
  TSD_CP006_HI_PA_APPROVED_ARTIFACT_DIGEST,
  TSD_CP006_HI_PA_APPROVED_ARTIFACT_ID,
  TSD_CP006_HI_PA_APPROVED_JSON_SHA256,
  TSD_CP006_HI_PA_APPROVED_SOURCE_HEAD,
  TSD_CP006_HI_PA_APPROVED_WORKFLOW_RUN_ID,
  TSD_CP006_HI_PA_FREEZE_ID,
  TSD_CP006_HI_PA_FREEZE_STATUS,
  TSD_CP006_HI_PA_PRODUCT_OWNER_APPROVAL_DATE,
} from "./native-approved-freeze-v7";

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

const sourceRows = generateCp006NativeReviewV7();
const frozenRows = TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q;

assert(TSD_CP006_ENGLISH_FREEZE_ID === "TSD-CP-006-EN-v5-frozen", "English CP006 freeze authority changed");
assert(TSD_CP006_NATIVE_REVIEW_STATUS_V7 === "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V7", "approved V7 source status mismatch");
assert(TSD_CP006_HI_PA_APPROVED_SOURCE_HEAD === "362f0d9f66dd2944de7a89a0f0a7dc3c17d2e66e", "approved source head drifted");
assert(TSD_CP006_HI_PA_FREEZE_ID === "TSD-CP-006-HI-PA-v7-frozen", "native freeze id drifted");
assert(TSD_CP006_HI_PA_FREEZE_STATUS === "APPROVED_NATIVE_FROZEN", "native freeze status drifted");
assert(TSD_CP006_HI_PA_PRODUCT_OWNER_APPROVAL_DATE === "2026-08-21", "approval date drifted");
assert(TSD_CP006_HI_PA_APPROVED_WORKFLOW_RUN_ID === 32357700409, "approved workflow run drifted");
assert(TSD_CP006_HI_PA_APPROVED_ARTIFACT_ID === 9402292419, "approved artifact id drifted");
assert(TSD_CP006_HI_PA_APPROVED_ARTIFACT_DIGEST === "sha256:129d7947d79448b7eb5da0184992be99c75cf2c3fa142ff5bc9b3d866c90162a", "approved artifact digest drifted");
assert(TSD_CP006_HI_PA_APPROVED_JSON_SHA256 === "84548f9014f23957ede31ad717d774cd1f10dc46c3b2d71626a1c18ed905f648", "approved JSON SHA drifted");
assert(sourceRows.length === 156 && frozenRows.length === 156, "freeze must contain exactly 156 native rows");

let verifierChecks = 0;
for (let index = 0; index < sourceRows.length; index += 1) {
  const source = sourceRows[index]!;
  const frozen = frozenRows[index]!;

  assert(
    stableJson(stripLifecycle(source as unknown as { source: unknown; presentation: Record<string, unknown> })) ===
      stableJson(stripLifecycle(frozen as unknown as { source: unknown; presentation: Record<string, unknown> })),
    `row ${index + 1}: approved native learner content changed during freeze`,
  );
  assert(source.source.lifecycle.englishFreezeStatus === "FROZEN", `row ${index + 1}: English source not frozen`);
  assert(source.presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `row ${index + 1}: source V7 was already frozen`);
  assert(!source.presentation.lifecycle.productOwnerApprovalRecorded, `row ${index + 1}: source V7 approval flag was already set`);
  assert(frozen.presentation.lifecycle.multilingualFreezeStatus === "FROZEN", `row ${index + 1}: frozen row not frozen`);
  assert(frozen.presentation.lifecycle.nativeReviewStatus === TSD_CP006_HI_PA_FREEZE_STATUS, `row ${index + 1}: frozen native status mismatch`);
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
  assert(independentlyVerifyCp006(source.source.solveMode, source.source.input, source.source.solution).valid, `row ${index + 1}: verifier rejected frozen source`);
  verifierChecks += 1;
}

const hi = frozenRows.filter((row) => row.presentation.language === "hi");
const pa = frozenRows.filter((row) => row.presentation.language === "pa");
assert(hi.length === 78 && pa.length === 78, "freeze must contain 78 Hindi + 78 Punjabi rows");
for (const languageRows of [hi, pa]) {
  assert(new Set(languageRows.map((row) => row.source.permanentQlId)).size === 13, "frozen native QL coverage changed");
  assert(new Set(languageRows.map((row) => row.presentation.stem)).size === 78, "frozen native stem uniqueness changed");
  assert(new Set(languageRows.map((row) => row.source.objectFamily)).size === 18, "frozen object-family coverage changed");
  assert(new Set(languageRows.map((row) => row.source.routeFamily)).size === 6, "frozen route-family coverage changed");
}

const punjabiLearnerText = pa.map((row) => `${row.presentation.stem} ${row.presentation.explanation.steps.join(" ")}`).join("\n");
assert(!/ਧਾਵਕ|ਪ੍ਰਸ਼ਿਕਸ਼ੂ|ਐਥਲੀਟ|ਜੌਗਰ|ਵਾਕਰ|ਰੇਸਰ/.test(punjabiLearnerText), "legacy Punjabi actor term returned during freeze");
assert(!/ਹੌਲੀ ਦੌੜਨ ਵਾਲਾ|ਕਸਰਤ ਲਈ ਤੁਰਨ ਵਾਲਾ|ਤੁਰਨ ਵਾਲਾ/.test(punjabiLearnerText), "inflection-prone Punjabi actor phrase returned during freeze");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_HI_PA_V7_APPROVED_FREEZE",
  freezeId: TSD_CP006_HI_PA_FREEZE_ID,
  approvedSourceHead: TSD_CP006_HI_PA_APPROVED_SOURCE_HEAD,
  productOwnerApprovalDate: TSD_CP006_HI_PA_PRODUCT_OWNER_APPROVAL_DATE,
  approvedWorkflowRunId: TSD_CP006_HI_PA_APPROVED_WORKFLOW_RUN_ID,
  approvedArtifactId: TSD_CP006_HI_PA_APPROVED_ARTIFACT_ID,
  approvedArtifactDigest: TSD_CP006_HI_PA_APPROVED_ARTIFACT_DIGEST,
  approvedJsonSha256: TSD_CP006_HI_PA_APPROVED_JSON_SHA256,
  englishFreezeAuthority: TSD_CP006_ENGLISH_FREEZE_ID,
  frozenRows: frozenRows.length,
  hindiRows: hi.length,
  punjabiRows: pa.length,
  learnerContentByteEquivalentExceptLifecycle: true,
  permanentQlRange: "TSD-QL-071..TSD-QL-083",
  selectedObjectFamiliesPerLanguage: 18,
  selectedRouteFamiliesPerLanguage: 6,
  independentVerifierChecks: verifierChecks,
  punjabiLexicalLocalizationPreserved: true,
  multilingualFreezeStatus: "FROZEN",
  productOwnerApprovalRecorded: true,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  mergeAuthorized: false,
}, null, 2));
