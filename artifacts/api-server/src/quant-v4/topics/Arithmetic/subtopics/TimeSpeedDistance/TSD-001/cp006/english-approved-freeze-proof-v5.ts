import { TSD_CP005_ENGLISH_FREEZE_STATUS } from "../cp005/english-approved-freeze-v13";
import { generateCp006EnglishReviewSetV5 } from "./english-review-runtime-v5";
import {
  TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q,
  TSD_CP006_ENGLISH_APPROVED_ARTIFACT_DIGEST,
  TSD_CP006_ENGLISH_APPROVED_ARTIFACT_ID,
  TSD_CP006_ENGLISH_APPROVED_JSON_SHA256,
  TSD_CP006_ENGLISH_APPROVED_SOURCE_HEAD,
  TSD_CP006_ENGLISH_APPROVED_WORKFLOW_RUN_ID,
  TSD_CP006_ENGLISH_FREEZE_ID,
  TSD_CP006_ENGLISH_FREEZE_STATUS,
  TSD_CP006_PRODUCT_OWNER_APPROVAL_DATE,
  TSD_CP006_PRODUCT_OWNER_APPROVAL_RECORDED,
} from "./english-approved-freeze-v5";
import { independentlyVerifyCp006 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, child) => typeof child === "bigint" ? `${child}n` : child);
}

const source = generateCp006EnglishReviewSetV5();
const frozen = TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q;

assert(TSD_CP006_ENGLISH_APPROVED_SOURCE_HEAD === "d9ce572bbdb66b931dd298546d74ae7cac0ca248", "approved CP006 source head changed");
assert(TSD_CP006_ENGLISH_APPROVED_WORKFLOW_RUN_ID === 32337853471, "approved CP006 workflow run changed");
assert(TSD_CP006_ENGLISH_APPROVED_ARTIFACT_ID === 9395273089, "approved CP006 artifact id changed");
assert(TSD_CP006_ENGLISH_APPROVED_ARTIFACT_DIGEST === "sha256:edcb596311d109dde7597a1f75d2f201e0948146d55bc019a8e768e2be224ade", "approved CP006 artifact digest changed");
assert(TSD_CP006_ENGLISH_APPROVED_JSON_SHA256 === "4ce05894ab7934b7111e652375a0188ff65bbdf60bf924683e6d86c392ef47cb", "approved CP006 JSON SHA changed");
assert(TSD_CP006_ENGLISH_FREEZE_ID === "TSD-CP-006-EN-v5-frozen", "unexpected CP006 freeze id");
assert(TSD_CP006_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN", "unexpected CP006 freeze status");
assert(TSD_CP006_PRODUCT_OWNER_APPROVAL_DATE === "2026-08-20", "unexpected CP006 approval date");
assert(TSD_CP006_PRODUCT_OWNER_APPROVAL_RECORDED, "CP006 product-owner approval not recorded");
assert(TSD_CP005_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN", "CP005 English freeze boundary changed");
assert(source.length === 78 && frozen.length === 78, "CP006 English V5 freeze must contain exactly 78 rows");

let independentChecks = 0;
for (let index = 0; index < source.length; index += 1) {
  const before = source[index]!;
  const after = frozen[index]!;
  const { lifecycle: beforeLifecycle, ...beforeContent } = before;
  const { lifecycle: afterLifecycle, ...afterContent } = after;

  assert(stable(beforeContent) === stable(afterContent), `CP006 frozen row ${index + 1}: approved learner content changed`);
  assert(beforeLifecycle.englishReviewStatus === "REVIEW_CANDIDATE_V5", `CP006 source row ${index + 1}: source review state changed`);
  assert(beforeLifecycle.englishFreezeStatus === "UNFROZEN", `CP006 source row ${index + 1}: source should remain unfrozen`);
  assert(afterLifecycle.englishReviewStatus === "APPROVED_ENGLISH_FROZEN", `CP006 frozen row ${index + 1}: review status not frozen`);
  assert(afterLifecycle.englishFreezeStatus === "FROZEN", `CP006 frozen row ${index + 1}: English freeze status not frozen`);
  assert(afterLifecycle.productOwnerApprovalRecorded === true, `CP006 frozen row ${index + 1}: approval marker missing`);
  assert(!afterLifecycle.questionStudioEnabled, `CP006 frozen row ${index + 1}: Question Studio unlocked`);
  assert(afterLifecycle.questionBankStatus === "NOT_STORED", `CP006 frozen row ${index + 1}: Question Bank unlocked`);
  assert(afterLifecycle.testEligibility === "INELIGIBLE", `CP006 frozen row ${index + 1}: test eligibility unlocked`);
  assert(!afterLifecycle.publiclyPublishable, `CP006 frozen row ${index + 1}: public publication unlocked`);

  const verified = independentlyVerifyCp006(after.solveMode, after.input, after.solution);
  assert(verified.valid, `CP006 frozen row ${index + 1}: independent verifier rejected frozen source`);
  independentChecks += 1;
}

assert(new Set(frozen.map((row) => row.permanentQlId)).size === 13, "CP006 freeze must preserve 13 permanent QLs");
assert(new Set(frozen.map((row) => row.stem)).size === 78, "CP006 frozen stems must remain unique");
assert(new Set(frozen.map((row) => row.objectFamily)).size === 18, "CP006 frozen object-family surface changed");
assert(new Set(frozen.map((row) => row.routeFamily)).size === 6, "CP006 frozen route-context surface changed");
for (const ql of [...new Set(frozen.map((row) => row.permanentQlId))]) {
  const subset = frozen.filter((row) => row.permanentQlId === ql);
  assert(subset.length === 6, `${ql}: freeze must preserve six rows`);
  assert(new Set(subset.map((row) => row.stemStructureId)).size === 6, `${ql}: freeze must preserve six stem structures`);
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_APPROVED_ENGLISH_V5_FREEZE",
  freezeId: TSD_CP006_ENGLISH_FREEZE_ID,
  approvedSourceHead: TSD_CP006_ENGLISH_APPROVED_SOURCE_HEAD,
  approvedWorkflowRunId: TSD_CP006_ENGLISH_APPROVED_WORKFLOW_RUN_ID,
  approvedArtifactId: TSD_CP006_ENGLISH_APPROVED_ARTIFACT_ID,
  approvedArtifactDigest: TSD_CP006_ENGLISH_APPROVED_ARTIFACT_DIGEST,
  approvedJsonSha256: TSD_CP006_ENGLISH_APPROVED_JSON_SHA256,
  productOwnerApprovalDate: TSD_CP006_PRODUCT_OWNER_APPROVAL_DATE,
  frozenRows: frozen.length,
  permanentQlRange: "TSD-QL-071..TSD-QL-083",
  nextPermanentQl: "TSD-QL-084",
  objectFamilies: new Set(frozen.map((row) => row.objectFamily)).size,
  routeFamilies: new Set(frozen.map((row) => row.routeFamily)).size,
  independentVerifierChecks: independentChecks,
  learnerContentByteEquivalentExceptLifecycle: true,
  cp005EnglishFreezePreserved: true,
  englishFreezeStatus: "FROZEN",
  hindiPunjabiLocalization: "LOCKED_PENDING_SEPARATE_REVIEW",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  mergeAuthorized: false,
}, null, 2));
