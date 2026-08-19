import { TSD_CP004_ENGLISH_FREEZE_STATUS } from "../cp004/english-approved-freeze";
import { generateCp005ReviewSetV13 } from "./english-review-runtime-v13";
import {
  TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q,
  TSD_CP005_ENGLISH_APPROVED_ARTIFACT_DIGEST,
  TSD_CP005_ENGLISH_APPROVED_ARTIFACT_ID,
  TSD_CP005_ENGLISH_APPROVED_SOURCE_HEAD,
  TSD_CP005_ENGLISH_APPROVED_WORKFLOW_RUN_ID,
  TSD_CP005_ENGLISH_FREEZE_ID,
  TSD_CP005_ENGLISH_FREEZE_STATUS,
  TSD_CP005_PRODUCT_OWNER_APPROVAL_DATE,
  TSD_CP005_PRODUCT_OWNER_APPROVAL_RECORDED,
} from "./english-approved-freeze-v13";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, child) => typeof child === "bigint" ? `${child}n` : child);
}

const source = generateCp005ReviewSetV13(6);
const frozen = TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q;

assert(TSD_CP005_ENGLISH_APPROVED_SOURCE_HEAD === "93b1f84ddd054acdcdbbc787281cc2dc47782bfb", "approved CP005 source head changed");
assert(TSD_CP005_ENGLISH_APPROVED_WORKFLOW_RUN_ID === 32213562607, "approved CP005 workflow run changed");
assert(TSD_CP005_ENGLISH_APPROVED_ARTIFACT_ID === 9351577376, "approved CP005 artifact id changed");
assert(TSD_CP005_ENGLISH_APPROVED_ARTIFACT_DIGEST === "sha256:e65a6509f68fff612e45dcc9c5ab46587b5816e53c6e0a75464ac49d1ae42beb", "approved CP005 artifact digest changed");
assert(TSD_CP005_ENGLISH_FREEZE_ID === "TSD-CP-005-EN-v13-frozen", "unexpected CP005 freeze id");
assert(TSD_CP005_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN", "unexpected CP005 freeze status");
assert(TSD_CP005_PRODUCT_OWNER_APPROVAL_DATE === "2026-08-19", "unexpected CP005 approval date");
assert(TSD_CP005_PRODUCT_OWNER_APPROVAL_RECORDED, "CP005 product-owner approval not recorded");
assert(TSD_CP004_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN", "CP004 English freeze boundary changed");
assert(source.length === 78 && frozen.length === 78, "CP005 English V13 freeze must contain exactly 78 rows");

for (let index = 0; index < source.length; index += 1) {
  const before = source[index]!;
  const after = frozen[index]!;
  const { lifecycle: beforeLifecycle, ...beforeContent } = before;
  const { lifecycle: afterLifecycle, ...afterContent } = after;

  assert(stable(beforeContent) === stable(afterContent), `CP005 frozen row ${index + 1}: approved learner content changed`);
  assert(beforeLifecycle.reviewStatus === "ENGLISH_REVIEW_CANDIDATE", `CP005 source row ${index + 1}: source review state changed`);
  assert(beforeLifecycle.englishFreezeStatus === "UNFROZEN", `CP005 source row ${index + 1}: source should remain unfrozen`);
  assert(afterLifecycle.reviewStatus === "APPROVED_ENGLISH_FROZEN", `CP005 frozen row ${index + 1}: review status not frozen`);
  assert(afterLifecycle.englishFreezeStatus === "FROZEN", `CP005 frozen row ${index + 1}: English freeze status not frozen`);
  assert(afterLifecycle.productOwnerApprovalRecorded === true, `CP005 frozen row ${index + 1}: approval marker missing`);
  assert(!afterLifecycle.questionStudioEnabled, `CP005 frozen row ${index + 1}: Question Studio unlocked`);
  assert(afterLifecycle.questionBankStatus === "NOT_STORED", `CP005 frozen row ${index + 1}: Question Bank unlocked`);
  assert(afterLifecycle.testEligibility === "INELIGIBLE", `CP005 frozen row ${index + 1}: test eligibility unlocked`);
  assert(!afterLifecycle.publiclyPublishable, `CP005 frozen row ${index + 1}: public publication unlocked`);
}

assert(new Set(frozen.map((row) => row.permanentQlId)).size === 13, "CP005 freeze must preserve 13 permanent QLs");
assert(new Set(frozen.map((row) => row.solveMode)).size === 20, "CP005 freeze must preserve all 20 learner solve modes");
assert(new Set(frozen.map((row) => row.stem)).size === 78, "CP005 frozen stems must remain unique");
assert(new Set(frozen.map((row) => row.mathematicalFingerprint)).size === 78, "CP005 frozen mathematical fingerprints must remain unique");
assert(new Set(frozen.map((row) => row.objectContextId)).size === 44, "CP005 frozen V13 object-context surface changed");
assert(new Set(frozen.map((row) => row.objectFamily)).size === 25, "CP005 frozen V13 object-family surface changed");
assert(new Set(frozen.map((row) => row.endpointFamily)).size === 18, "CP005 frozen V13 endpoint-family surface changed");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_APPROVED_ENGLISH_V13_FREEZE",
  freezeId: TSD_CP005_ENGLISH_FREEZE_ID,
  approvedSourceHead: TSD_CP005_ENGLISH_APPROVED_SOURCE_HEAD,
  approvedWorkflowRunId: TSD_CP005_ENGLISH_APPROVED_WORKFLOW_RUN_ID,
  approvedArtifactId: TSD_CP005_ENGLISH_APPROVED_ARTIFACT_ID,
  approvedArtifactDigest: TSD_CP005_ENGLISH_APPROVED_ARTIFACT_DIGEST,
  productOwnerApprovalDate: TSD_CP005_PRODUCT_OWNER_APPROVAL_DATE,
  frozenRows: frozen.length,
  permanentQlRange: "TSD-QL-058..TSD-QL-070",
  learnerSolveModes: new Set(frozen.map((row) => row.solveMode)).size,
  objectContexts: new Set(frozen.map((row) => row.objectContextId)).size,
  objectFamilies: new Set(frozen.map((row) => row.objectFamily)).size,
  endpointFamilies: new Set(frozen.map((row) => row.endpointFamily)).size,
  learnerContentByteEquivalentExceptLifecycle: true,
  cp004EnglishFreezePreserved: true,
  englishFreezeStatus: "FROZEN",
  hindiPunjabiLocalization: "LOCKED_PENDING_SEPARATE_REVIEW",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
